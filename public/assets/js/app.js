/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/assets/js/app.js":
/*!******************************!*\
  !*** ./src/assets/js/app.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var current = '';
var count = 0;
var retryInterval;
var gameConnection;
var time = localStorage.gameTimer || 8;
var dur = 0;
var actionButton = document.getElementById("actionButton");
var gameId = document.getElementById("gameId");
var gameName = document.getElementById("gameName");
var playerName = document.getElementById("playerName");
var stages = document.querySelectorAll("article.small-11");
var stat = document.querySelector('#countdownPanel .stat');
var types = document.querySelectorAll('article#introPanel .button-group .button');
var allPlayers = document.getElementById('playerSection');
var player = document.querySelector('.plyr');
var pl = player.cloneNode(true);
stages.forEach(function (div) {
  var titles = div.querySelectorAll('.card  .card-divider');
  if (titles) toggleVisibility(titles);
});
var actionButtonStages = {
  "intro": {
    title: "Join Game",
    action: intro
  },
  "options": {
    title: "Confirm Options",
    action: options
  },
  "countdown": {
    title: "Skip Countdown",
    action: countdown
  },
  "confirmation": {
    title: "Confirm Players",
    action: confirmation
  },
  "randomization": {
    title: "Randomize Players",
    action: randomization
  },
  "assignment": {
    title: "Assign Abilities",
    action: assignment
  },
  "application": {
    title: "Apply Special Abilities",
    action: application
  },
  "cycle": {
    title: "Start Game",
    action: cycle
  },
  "comment": {
    title: "Leave Comment",
    action: comment
  },
  "feedback": {
    title: "View Feedback",
    action: feedback
  },
  "fin": {
    title: "Game Over",
    action: restart
  }
};
var actionButtonNames = Object.keys(actionButtonStages).map(function (v) {
  return v;
});

function gameType(type, data) {
  var clean = data;
  if (localStorage.playerType === 'spectate' || localStorage.playerType === 'join') delete clean.gameName;
  if (localStorage.playerType === 'spectate') delete clean.playerName;
  return clean;
}

function randomString(s, f) {
  return Math.random().toString(36).substring(s || 2, f || 10).toUpperCase();
}

function syncLocalStorage(data) {
  return Object.entries(data).forEach(function (v) {
    return localStorage.setItem(v[0], _typeof(v[1]) === 'object' ? JSON.stringify(v[1]) : v[1].toString());
  });
}

function getFormData() {
  return gameType(types[localStorage.playerType], {
    game: {
      gameId: localStorage.gameId || gameId.value,
      gameName: localStorage.gameName || gameName.value
    },
    player: {
      playerName: localStorage.playerName || playerName.value,
      playerType: localStorage.playerType || 'spectate',
      playerId: localStorage.playerId || randomString()
    }
  });
}

function setStage(data) {
  document.body.classList.add(localStorage.playerType + 'ing');
  stages.forEach(function (stage) {
    return stage.classList.add('hide');
  });
  var id = localStorage.gameStage || "intro";
  var pos = actionButtonNames.indexOf(id);
  var rndm = JSON.parse(localStorage.gameRandomized)
  var plyrs = (rndm.length) ? rndm : Object.values(JSON.parse(localStorage.players));

  if (plyrs.length > 1) {
    allPlayers.classList.remove('hide');
    allPlayers.querySelector('.stacked').innerHTML = "";
    plyrs.forEach(function (p) {
      var pl2 = pl.cloneNode(true);
      pl2.innerHTML = `<small class="button secondary cell small-6">${p.playerName}</small>`;

      if(pos > 6 && p.playerAbility) {
          pl2.classList.add('ability');
          pl2.dataset.ability = p.playerAbility.name;
          pl2.innerHTML += `<small class="button secondary hollow cell small-5">${p.playerAbility.name}</small>`
      }

      allPlayers.querySelector('.stacked').append(pl2);

    });
  }

  if (id === 'intro') {
    Object.values(types).filter(function (e) {
      return !e.classList.contains('clear');
    })[0].classList.add('clear');
    types[0].classList.remove('clear');
    localStorage.clear();
  } else {
    document.getElementById("gameDetails").classList.remove('hide');
    document.getElementById("playerNameTag").innerText = localStorage.playerName;
    document.getElementById("gameNameTag").innerText = localStorage.gameName;
    document.getElementById("gameIdTag").innerText = localStorage.gameId;
  }

  if (id === 'countdown') {
    let remainder = parseInt(localStorage.gameTimer) * 60 - Math.round((Date.now()-localStorage.gameTime)/1000);
    stat.innerHTML = `${Math.round(remainder/60)-1}:${Math.round(remainder%60).toString().padStart(2,"0")}`;
    timer = setInterval(moveTime, 1000);
    if (localStorage.playerType !== 'host') {
      actionButton.classList.add('host');


    }
  }



  if (id === 'confirmation') {}

  // if (id === 'assignment') {
  //   var ps = JSON.parse(localStorage.gameRandomized);
  //   allPlayers.querySelectorAll('a').forEach(function (a, b) {
  //
  //
  //     a.innerText = ps[b].playerName;
  //   });
  // }
  //
  // if (id === 'application') {
  //   var _ps = JSON.parse(localStorage.gameRandomized);
  //
  //   allPlayers.querySelectorAll('a').forEach(function (a, b) {
  //     a.innerText = _ps[b].playerName;
  //   });
  // }

  if (id === 'cycle') {
    console.log(localStorage.gameRandomization);
  }

  actionButton.innerText = actionButtonStages[id].title;
  document.getElementById("".concat(id, "Panel")).classList.remove('hide');
}

types.forEach(function (type) {
  type.addEventListener('click', function (ev) {
    localStorage.setItem('playerType', type.innerText.split(' ')[0].toLowerCase());
    var card = type.parentElement.nextElementSibling;
    card.setAttribute('class', 'card-section grid-x');
    card.classList.add(localStorage.playerType + 'ing');
    types.forEach(function (e) {
      return e.classList.add('clear');
    });
    type.classList.remove('clear');
    localStorage.playerType === 'host' ? gameId.setAttribute('disabled', 'disabled') : gameId.removeAttribute('disabled');
    actionButton.innerText = type.innerText + " Game";
  });
});

function getPlayer() {
  return {
    playerType: localStorage.playerType || "spectate",
    playerId: localStorage.playerId || randomString(),
    playerName: localStorage.playerName || ""
  };
}

function getNextStage() {
  var nStage = actionButtonNames.indexOf(localStorage.gameStage);
  gameConnection.send(JSON.stringify({
    update: true,
    game: {
      game: {
        gameId: localStorage.gameId,
        gameStage: actionButtonNames[nStage + 1]
      },
      player: {
        playerId: localStorage.playerId
      }
    }
  }));
}

function intro(rejoin) {
  var game = getFormData();
  gameConnection = new WebSocket('ws://192.168.0.20:3000');

  gameConnection.onmessage = function (event) {
    console.log("on message");
    var message = JSON.parse(event.data);

    if (message.remove) {
      localStorage.clear();
    } else if (message.sync) {
      var sg = message.sync.game;
      var sp = message.sync.player;
      if (sg) syncLocalStorage(sg);
      if (sp) syncLocalStorage(sp);

      if (message.sync.error) {
        var ePanel = document.getElementById("errorPanel");
        ePanel.innerText = message.sync.error.toString();
        ePanel.classList.remove('hide');
      }

      if (localStorage.gameAbilities === "true") {
        document.body.classList.add('abilities');
        if (localStorage.gameStage === 'countdown' && localStorage.playerType !== 'host' && localStorage.playerAbility === undefined) localStorage.gameStage = 'options';
      }

      setStage(sg);
    } else if (message.error) {
      var _ePanel = document.getElementById("errorPanel");

      _ePanel.innerText = message.error.toString();

      _ePanel.classList.remove('hide');
    } else {
      console.log({
        message: message
      });
      console.log('clear');
    }
  };

  gameConnection.onopen = function () {
    console.log('on open');
    if (game) gameConnection.send(JSON.stringify({
      game: game,
      rejoin: rejoin
    }));
  };

  gameConnection.onclosed = function () {
    retryInterval = setInterval(function () {
      console.log("Retrying: ".concat(count));
      if (count === 5) clearInterval(retryInterval);
    }, 2000);
    count++;
  };
}

function options() {
  gameConnection.send(JSON.stringify({
    update: true,
    game: {
      game: {
        gameId: localStorage.gameId,
        gameAbilities: localStorage.gameAbilities || false,
        optionsSet: true,
        gameTimer: localStorage.gameTimer || 5,
        gameStage: "countdown"
      },
      player: {
        playerId: localStorage.playerId,
        playerAbility: localStorage.playerAbility || ""
      }
    }
  }));
}

function countdown() {
  getNextStage();
}

function confirmation() {
  getNextStage();
}

function randomization() {
  getNextStage();
}

function assignment() {
  getNextStage();
}

function application() {
  getNextStage();
}

function cycle() {
  getNextStage();
}

function comment() {
  getNextStage();
}

function feedback() {
  getNextStage();
  localStorage.clear();
}

actionButton.addEventListener('click', function (ev) {
  var id = actionButtonStages[localStorage.gameStage ? localStorage.gameStage : 'intro'];
  id.action();
});

window.onload = function () {
  localStorage.playerType = localStorage.playerType || "join";
  document.body.classList.add(localStorage.playerType + 'ing');
  gameId.value = localStorage.gameId || randomString(2, 7);
  if (localStorage.gameAbilities) document.body.classList.add('abilities');
  if (localStorage.gameId && localStorage.playerId) intro(true);
}; // window.onbeforeunload = event => {
//     if (localStorage.playerId && localStorage.gameId) {
//         event.preventDefault();
//         gameConnection.send(JSON.stringify({closing: {playerId: localStorage.playerId, gameId: localStorage.gameId}}))
//     }
// }


var pauseBtn = document.querySelector('.pause');
pauseBtn.addEventListener('click', function (ev) {
  var btn = ev.target;

  if (btn.classList.contains('paused')) {
    btn.innerText = "Pause Timer";
    timer = setInterval(moveTime, 1000);
    btn.classList.add('warning');
  } else {
    btn.innerText = "Timer Paused";
    btn.classList.remove('warning');
    clearInterval(timer);
  }

  btn.classList.toggle('paused');
});

function toggleVisibility(els) {
  els.forEach(function (el) {
    return el.addEventListener('click', function (ev) {
      abilityLabels.forEach(function (el) {
        return el.nextElementSibling.classList.add('hide');
      });
      el.nextElementSibling.classList.toggle('hide');
    });
  });
}

var abilityLabels = document.querySelectorAll("#optionsPanel .primary");
toggleVisibility(abilityLabels);
var playerSpecialAbilityButtons = document.querySelectorAll('.stacked .button');
playerSpecialAbilityButtons.forEach(function (el, ind, all) {
  return el.addEventListener('click', function (ev) {
    ev.target.parentNode.querySelectorAll('.button').forEach(function (sa) {
      return sa.classList.add('hollow');
    });

    if (el.parentElement.classList.contains('game')) {
      localStorage.removeItem('gameAbility');
      document.body.classList.remove('abilities');
    } else {
      localStorage.removeItem('playerAbility');
    }

    if (el.classList.contains('success')) {
      if (el.parentElement.classList.contains('game')) {
        localStorage.setItem('gameAbilities', "true");
      } else {
        localStorage.setItem('playerAbility', "true");
      }
    }

    el.classList.remove('hollow');
  });
});
var countdownDuration = document.getElementById("gameOptionsTimer");
countdownDuration.addEventListener('keyup', function (ev) {
  localStorage.setItem('gameTimer', ev.target.value || 5);
});

function moveTime() {
  let remainder = (parseInt(localStorage.gameTimer-1) * 60) - Math.round((Date.now()-localStorage.gameTime)/1000);

  if (localStorage.playerType !== 'host') {actionButton.classList.add('host');}
  stat.innerHTML = `${Math.round(remainder/60)}:${Math.round(remainder%60).toString().padStart(2,"0")}`;

  if(remainder === 0) { clearInterval(); actionButton.click()}


}

document.getElementById('reset').addEventListener('click', function (ev) {
  restart();
});

function restart() {
  localStorage.clear();
  window.location.reload();
}

document.title = window.location.port;

function addPlayer() {
  var panel = document.getElementById("confirmationPanel");
  var nplayer = {
    game: {
      game: {
        gameId: localStorage.gameId
      },
      player: {
        playerId: randomString(),
        playerName: document.getElementById("newPlayerName").value.toString(),
        playerAbility: document.getElementById("newPlayerAbility").checked,
        playerType: "join",
        skip: true
      }
    }
  };
  document.getElementById("newPlayerName").value = ''
  gameConnection.send(JSON.stringify(nplayer));
}

document.getElementById("newPlayerSubmit").addEventListener('click', function (ev) {
  return addPlayer();
});

/***/ }),

/***/ 0:
/*!************************************!*\
  !*** multi ./src/assets/js/app.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! E:\Jams\SecretSanta\GiftExchange\src\assets\js\app.js */"./src/assets/js/app.js");


/***/ })

/******/ });
//# sourceMappingURL=app.js.map