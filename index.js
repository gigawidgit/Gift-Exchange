'use strict';

const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');
const xss = require('xss');
const crypto = require('get-random-values')

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');
const GAMES = new Map();
const HOSTS = new Map();
const reg = /^[A-Za-z0-9]+$/g;
const valid = i => i.match(reg)


const random = a => crypto(new Uint8Array(256))[0]/256;


const randomize = (pre,post) => {
    const p = pre.splice(Math.floor(random()*pre.length),1)[0]
    post.push(p);
    return (pre.length) ? randomize(pre,post) : post
}

const abilities = [{
        "name": "Last One Standing",
        "description": "Last to choose"
    },
    {
        "name": "Front of the Line",
        "description": "Moves to be the first to pick a gift"
    },
    {
        "name": "Can't Touch This",
        "description": "Person can choose whether or not they want to trade"
    },
    {
        "name": "Scramble!",
        "description": "Randomizes remaining player's positions"
    },
    {
        "name": "Give it Up Already",
        "description": "Get No Gift - Give away to random other player"
    },
    {
        "name": "Redo",
        "description": "Start Over; Gifts go back in the middle, everyone is assigned a new card, and the list is randomized again"
    },
    {
        "name": "Sike",
        "description": "Like Can't Touch This, the player has one opportunity to deny a trade."
    }
]

const updateGame = (data) => {
    let g = data.game
    let p = data.player
    let game = GAMES.get(g.gameId)

    if (HOSTS.get(p.playerId) === g.gameId) {
        Object.entries(g).forEach(([k, v]) => {
            game[k] = v
        })
    }
    game.player = game.players[p.playerId]
    game.players[p.playerId].playerAbility = p.playerAbility

    if(g.gameStage === 'randomization'){
        const plys = [... Object.values(game.players)]
        game.gameRandomized = randomize(plys,[])
    }

    if(g.gameStage === 'assignment'){
        Object.values(game.gameRandomized).map((obj,ind)=>{
            const rn = Math.floor(random()*abilities.length)
            console.log(rn)
            const ability = abilities[rn];

            if (obj.playerAbility) {  obj.playerAbility = ability }
            return obj })
    }

    GAMES.set(g.gameId, game)

    const ngame = GAMES.get(g.gameId)
    return ngame
}

const joinGame = (data, ws) => {
    let error = {}
    const game = GAMES.get(data.game.gameId)
    if (!game) error = {error: "Game Not Found"}

    const player = {
        playerId: data.player.playerId,
        playerName: data.player.playerName,
        playerSocket: (data.player.skip) ? false : ws,
        playerAbility: data.player.playerAbility,
        skip: data.player.skip
    }

    game.player = player
    game.players[data.player.playerId] = player
    GAMES.set(data.game.gameId, game)
    const newgame = GAMES.get(data.game.gameId)
    return (!game) ? error : newgame
}

const createGame = (data, ws) => {
    let error = ""
    const player = data.game.player
    const game = data.game.game

    if (GAMES.get(game.gameId)) error = "Game Already Exists"

    let players = {}
    const nPlayer = {
        playerName: player.playerName,
        playerSocket: ws,
        playerId: player.playerId
    }

    if (game.gameId.length !== 5 && player.playerId.length !== 8) error = "Invalid Data"
    if (valid(game.gameId) === null || (!game.gameId && game.gameId.length === 5)) error = "Incorrect Format for Game Id. AlphaNumeric Characters Only (A-Z & 0-9)."
    if (valid(player.playerId) === null || player.playerId.length !== 8) error = "You are not a valid user; not you the person, you the request."
    if (player.playerName && valid(player.playerName)) players[player.playerId] = nPlayer
    let nData = {
        gameId: game.gameId,
        gameName: game.gameName,
        gameStage: 'options',
        gameOptionsSet: false,
        gameAbilities: true,
        gameTimer: 5,
        gameRandomized: [],
        players: {},
        spec: {},
        host: {
            hostId: player.playerId,
            hostSocket: ws,
            hostName: player.playerName
        }
    }
    nData.players[player.playerId] = nPlayer

    HOSTS.set(player.playerId, game.gameId)
    GAMES.set(game.gameId, nData)
    const g = GAMES.get(game.gameId)
    return (error.length) ? {error: error} : {game: g, player: nPlayer}

}

const index = express()
    .use(express.static('public'))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new SocketServer({server: index});
wss.on('connection', (ws) => {
    ws.on('close', () => console.log('Client disconnected'));
    ws.on('message', data => {
        if (data !== 'undefined') {
            try {
                const clean = JSON.parse(data)
                const game = clean.game.game
                const player = clean.game.player
                if (clean.rejoin) {
                    const sGame = GAMES.get(game.gameId)
                    if (sGame) {
                        sGame.players[player.playerId].playerSocket = ws
                        GAMES.set(game.gameId, sGame)
                        const nGame = GAMES.get(game.gameId)
                        ws.send(JSON.stringify({sync: {game:nGame}}))
                    } else {
                        ws.send(JSON.stringify({remove: true, error: "Game Not Found"}))
                    }

                } else if (clean.update) {
                    const newGame = updateGame({game: game, player:player}, ws)
                    Object.values(newGame.players).forEach(p => {
                        if(p.playerSocket) p.playerSocket.send(JSON.stringify({sync: {game:newGame, player:p}}))
                    })
                } else  {

                    if (player.playerType === 'host') {
                        return ws.send(JSON.stringify({sync: createGame(clean, ws)}))
                    } else if (player.playerType === 'join') {
                        let GAME = GAMES.get(game.gameId)
                        if (!GAME) {
                            ws.send(JSON.stringify({error: "Game Not Found"}))
                        } else {
                            if (GAME.optionsSet) {
                                const j = joinGame(clean.game, ws)
                                Object.values(GAMES.get(game.gameId).players).forEach(p => {
                                    if(p.playerSocket) p.playerSocket.send(JSON.stringify({sync: {game: j,player:p}}))
                                })
                            } else {
                                ws.send(JSON.stringify({error: "Game is presently being setup"}))
                            }
                        }
                    } else if (player.playerType === 'spectate') {
                        let GAME = GAMES.get(game.gameId)
                        GAME.spec.setItem(player.playerId, player)
                    } else {
                        ws.send(JSON.stringify({error: "Error somewhere in the code"}))
                    }
                }
            } catch (err) {
                console.log(err)
            }
        }
    })
});