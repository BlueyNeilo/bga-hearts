var __extends =
  (this && this.__extends) ||
  (function () {
    var extendStatics = function (d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (d, b) {
            d.__proto__ = b;
          }) ||
        function (d, b) {
          for (var p in b)
            if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function (d, b) {
      if (typeof b !== 'function' && b !== null)
        throw new TypeError(
          'Class extends value ' + String(b) + ' is not a constructor or null'
        );
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype =
        b === null
          ? Object.create(b)
          : ((__.prototype = b.prototype), new __());
    };
  })();
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
define([
  'dojo',
  'dojo/_base/declare',
  'ebg/core/gamegui',
  'ebg/counter',
  'ebg/stock'
], function (dojo, declare) {
  return declare('bgagame.heartsblueinyellow', ebg.core.gamegui, new Main());
});
/**
 *------
 * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
 * HeartsBlueInYellow implementation : © Patrick Neilson <patrick.neilson.tech@gmail.com>
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 *
 * heartsblueinyellow.ts
 *
 * HeartsBlueInYellow user interface script
 *
 * In this file, you are describing the logic of your user interface, in Typescript language.
 *
 */
/* @ts-expect-error eslint-disable-next-line no-undef Typescript workaround for unrecognised class extension */
// eslint-disable-next-line no-undef
GameGui = /** @class */ (function () {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  function GameGui() {}
  return GameGui;
})();
/**
 * Main program
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var Main = /** @class */ (function (_super) {
  __extends(Main, _super);
  function Main() {
    var _this = _super.call(this) || this;
    console.log('heartsblueinyellow constructor');
    _this.cardwidth = 72;
    _this.cardheight = 96;
    _this.playerHand = new PlayerHand(_this);
    _this.notificationSystem = new NotificationSystem(_this);
    _this.stateSystem = new StateSystem(_this);
    return _this;
  }
  /**
   * This method must set up the game user interface
   * according to current game situation specified in parameters.
   *
   * The method is called each time the game interface is displayed to a player, ie:
   * - when the game starts
   * - when a player refreshes the game page (F5)
   *
   * @param {*} _gamedatas contains all datas retrieved by your "getAllDatas" PHP method.
   */
  Main.prototype.setup = function (_gamedatas) {
    console.log('Starting game setup');
    dojo.destroy('debug_output');
    this.playerId = +this.player_id;
    this.gameName = this.game_name;
    this.playerHand.setup();
    this.setupTableCards();
    this.notificationSystem.setup();
    console.log('Ending game setup');
  };
  /* Cards played on table */
  Main.prototype.setupTableCards = function () {
    var _this = this;
    Object.values(this.gamedatas.cardsontable).forEach(function (card) {
      Util.Display.playCardOnTable(_this, card);
    });
  };
  /* Game & client states */
  /**
   * Called each time we are entering into a new game state.
   *
   * @param {string} stateName
   * @param {*} args
   */
  Main.prototype.onEnteringState = function (stateName, args) {
    var _a, _b;
    console.log('Entering state: ' + stateName);
    (_a = this.stateSystem.states[stateName]) === null || _a === void 0
      ? void 0
      : _a.onEnterState(args.args);
    (_b = this.stateSystem.states[stateName]) !== null && _b !== void 0
      ? _b
      : console.log('Missing state: ' + stateName);
  };
  /**
   * Called each time we are leaving a game state.
   * You can use this method to perform some user interface changes at this moment.
   *
   * @param {string} stateName State the game is leaving
   */
  Main.prototype.onLeavingState = function (stateName) {
    var _a, _b;
    console.log('Leaving state: ' + stateName);
    (_a = this.stateSystem.states[stateName]) === null || _a === void 0
      ? void 0
      : _a.onLeaveState();
    (_b = this.stateSystem.states[stateName]) !== null && _b !== void 0
      ? _b
      : console.log('Missing state: ' + stateName);
  };
  /**
   * Manage "action buttons" that are displayed in the action status bar (ie: the HTML links in the status bar).
   *
   * @param {string} stateName New state to transition to
   * @param {*} [args] data passed from state transition
   */
  Main.prototype.onUpdateActionButtons = function (stateName, args) {
    var _a, _b, _c;
    console.log('onUpdateActionButtons: ' + stateName);
    if (this.isCurrentPlayerActive()) {
      (_a = this.stateSystem.states[stateName]) === null || _a === void 0
        ? void 0
        : _a.handleAction(args);
    } else if (!this.isSpectator) {
      // Multiplayer action
      (_b = this.stateSystem.states[stateName]) === null || _b === void 0
        ? void 0
        : _b.handleOutOfTurnAction(args);
    }
    (_c = this.stateSystem.states[stateName]) !== null && _c !== void 0
      ? _c
      : console.log('Missing state: ' + stateName);
  };
  return Main;
})(GameGui);
var NotificationHandler = /** @class */ (function () {
  function NotificationHandler(name, callback, syncTimer) {
    if (syncTimer === void 0) {
      syncTimer = null;
    }
    this.name = name;
    this.callback = callback;
    this.syncTimer = syncTimer;
  }
  return NotificationHandler;
})();
/**
 * Associate each of your game notifications with your local method to handle it.
 *
 * Note: game notification names correspond to
 * "notifyAllPlayers" and "notifyPlayer" calls in your heartsblueinyellow.game.php file.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var NotificationSystem = /** @class */ (function () {
  function NotificationSystem(main) {
    this.main = main;
    this.handlers = [
      new NotificationHandler('newHand', function (notif) {
        main.playerHand.removeAll();
        main.playerHand.constructHand(notif.args.cards);
      }),
      new NotificationHandler('playCard', function (notif) {
        var card = {
          id: +notif.args.cardId,
          location: 'unknown',
          location_arg: +notif.args.playerId,
          type: notif.args.color,
          type_arg: +notif.args.value
        };
        Util.Display.playCardOnTable(main, card);
      }),
      new NotificationHandler('trickWin', function () {}, 1000),
      new NotificationHandler('giveAllCardsToPlayer', function (notif) {
        Util.Display.giveTableCardsToTrickWinner(main, notif.args.playerId);
      }),
      new NotificationHandler('newScores', function (notif) {
        for (var playerId in notif.args.newScores) {
          main.scoreCtrl[playerId].toValue(notif.args.newScores[playerId]);
        }
      })
    ];
  }
  NotificationSystem.prototype.setup = function () {
    var _this = this;
    console.log('notifications subscriptions setup');
    this.handlers.forEach(function (handler) {
      dojo.subscribe(handler.name, handler.callback.bind(_this));
      if (handler.syncTimer != null) {
        _this.main.notifqueue.setSynchronous(handler.name, handler.syncTimer);
      }
    });
  };
  return NotificationSystem;
})();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var PlayerHand = /** @class */ (function () {
  function PlayerHand(main) {
    this.main = main;
    this.stock = new ebg.stock();
  }
  PlayerHand.prototype.setup = function () {
    this.setupStock();
    this.constructHand(this.main.gamedatas.hand);
    dojo.connect(this.stock, 'onChangeSelection', this, 'onSelectionChanged');
  };
  PlayerHand.prototype.setupStock = function () {
    this.stock.create(
      this.main,
      $('myhand'),
      this.main.cardwidth,
      this.main.cardheight
    );
    this.stock.image_items_per_row = 13;
    this.createCardTypes();
  };
  PlayerHand.prototype.createCardTypes = function () {
    for (var color = 1; color <= 4; color++) {
      for (var value = 2; value <= 14; value++) {
        // Build card type id
        var cardTypeId = this.getCardUniqueId(color, value);
        this.stock.addItemType(
          cardTypeId,
          cardTypeId,
          g_gamethemeurl + 'img/cards.jpg',
          cardTypeId
        );
      }
    }
  };
  /* Player's action */
  PlayerHand.prototype.onSelectionChanged = function () {
    var selectedItems = this.stock.getSelectedItems();
    var playCardAction = 'playCard';
    var giveCardsAction = 'giveCards';
    if (selectedItems.length > 0) {
      var hasChosenPlayCard = Util.Ajax.checkAction(this.main, playCardAction);
      var hasChosenGiveCards = Util.Ajax.checkAction(
        this.main,
        giveCardsAction
      );
      if (hasChosenPlayCard) {
        // Can play a card
        var cardId = selectedItems[0].id;
        Util.Ajax.sendAction(this.main, playCardAction, { id: cardId });
        this.stock.unselectAll();
      } else if (hasChosenGiveCards) {
        // Can give cards => let the player select some cards
      } else {
        this.stock.unselectAll();
      }
    }
  };
  /**
   * Get card unique identifier based on its color and value
   *
   * @param {number} color suit of card
   * @param {number} value value of card
   * @returns Unique number derived from suit and value
   */
  PlayerHand.prototype.getCardUniqueId = function (color, value) {
    return (color - 1) * 13 + (value - 2);
  };
  PlayerHand.prototype.constructHand = function (cards) {
    var _this = this;
    Object.values(cards).forEach(function (card) {
      var color = +card.type;
      var value = card.type_arg;
      var cardId = _this.getCardUniqueId(color, value);
      _this.stock.addToStockWithId(cardId, card.id);
    });
  };
  PlayerHand.prototype.removeCard = function (cardId) {
    this.stock.removeFromStockById(cardId);
  };
  PlayerHand.prototype.removeAll = function () {
    this.stock.removeAll();
  };
  return PlayerHand;
})();
var State = /** @class */ (function () {
  function State(
    name,
    onEnterState,
    onLeaveState,
    handleAction,
    handleOutOfTurnAction
  ) {
    if (onEnterState === void 0) {
      onEnterState = function () {};
    }
    if (onLeaveState === void 0) {
      onLeaveState = function () {};
    }
    if (handleAction === void 0) {
      handleAction = function () {};
    }
    if (handleOutOfTurnAction === void 0) {
      handleOutOfTurnAction = function () {};
    }
    this.name = name;
    this.onEnterState = onEnterState;
    this.onLeaveState = onLeaveState;
    this.handleAction = handleAction;
    this.handleOutOfTurnAction = handleOutOfTurnAction;
  }
  return State;
})();
/**
 * Handle game states and their transitions
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var StateSystem = /** @class */ (function () {
  function StateSystem(main) {
    this.main = main;
    this.states = Object.fromEntries(
      [
        new State('playerTurn'),
        new State('nextPlayer'),
        new State('newTrick')
      ].map(function (state) {
        return [state.name, state];
      })
    );
  }
  return StateSystem;
})();
/**
 * Utility methods
 */
// eslint-disable-next-line
var Util;
(function (Util) {
  // eslint-disable-next-line
  var Ajax;
  (function (Ajax) {
    function sendAction(main, action, args) {
      var actionEndpoint = ''.concat(
        '/',
        main.gameName,
        '/',
        main.gameName,
        '/',
        action,
        '.html'
      );
      main.ajaxcall(
        actionEndpoint,
        __assign(__assign({}, args), { lock: true }),
        this,
        function (result) {},
        function (isError) {}
      );
    }
    Ajax.sendAction = sendAction;
    function checkAction(main, action) {
      return main.checkAction(action, true);
    }
    Ajax.checkAction = checkAction;
  })((Ajax = Util.Ajax || (Util.Ajax = {})));
  // eslint-disable-next-line
  var Display;
  (function (Display) {
    /**
     * Play card on the table for any player
     *
     * @param {Main} main - main game program
     * @param {Card} card - card to play
     */
    function playCardOnTable(main, card) {
      var _a = __assign(__assign({}, card), { type: +card.type }),
        cardId = _a.id,
        playerId = _a.location_arg,
        color = _a.type,
        value = _a.type_arg;
      var cardOnTablePlayerId = 'cardontable_' + playerId.toString();
      var overallPlayerBoardPlayerId =
        'overall_player_board_' + playerId.toString();
      var myHandItemCardId = 'myhand_item_' + cardId.toString();
      var playerTableCardPlayerId = 'playertablecard_' + playerId.toString();
      // Draw card on screen
      dojo.place(
        main.format_block('jstpl_cardontable', {
          x: main.cardwidth * (value - 2),
          y: main.cardheight * (color - 1),
          player_id: playerId
        }),
        playerTableCardPlayerId
      );
      // Move card from player panel or from hand
      if (playerId !== main.playerId) {
        // Move card from opponent player panel
        main.placeOnObject(cardOnTablePlayerId, overallPlayerBoardPlayerId);
      } else {
        // Play card from your own hand
        if ($(myHandItemCardId) != null) {
          main.placeOnObject(cardOnTablePlayerId, myHandItemCardId);
          main.playerHand.removeCard(cardId);
        }
      }
      // In any case: move it to its final destination
      main.slideToObject(cardOnTablePlayerId, playerTableCardPlayerId).play();
    }
    Display.playCardOnTable = playCardOnTable;
    /**
     * Give table cards to trick winner
     *
     * @param {Main} main - main game program
     * @param {Card} winnerId - playerId of trick winner
     */
    function giveTableCardsToTrickWinner(main, winnerId) {
      var overallPlayerBoardWinnerId =
        'overall_player_board_' + winnerId.toString();
      for (var playerId in main.gamedatas.players) {
        var cardOnTablePlayerId = 'cardontable_' + playerId;
        var anim = main.slideToObject(
          cardOnTablePlayerId,
          overallPlayerBoardWinnerId
        );
        dojo.connect(anim, 'onEnd', function (node) {
          dojo.destroy(node);
        });
        anim.play();
      }
    }
    Display.giveTableCardsToTrickWinner = giveTableCardsToTrickWinner;
  })((Display = Util.Display || (Util.Display = {})));
})(Util || (Util = {}));
