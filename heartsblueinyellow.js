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
    this.playerId = this.player_id;
    // Player hand
    this.playerHand = new ebg.stock();
    this.playerHand.create(this, $('myhand'), this.cardwidth, this.cardheight);
    this.playerHand.image_items_per_row = 13;
    // Create cards types
    for (var color = 1; color <= 4; color++) {
      for (var value = 2; value <= 14; value++) {
        // Build card type id
        var cardTypeId = this.getCardUniqueId(color, value);
        this.playerHand.addItemType(
          cardTypeId,
          cardTypeId,
          g_gamethemeurl + 'img/cards.jpg',
          cardTypeId
        );
      }
    }
    // Cards in player's hand
    for (var i in this.gamedatas.hand) {
      var card = this.gamedatas.hand[i];
      var color = card.type;
      var value = card.type_arg;
      var cardId = this.getCardUniqueId(color, value);
      this.playerHand.addToStockWithId(cardId, card.id);
    }
    // Cards played on table
    for (var i in this.gamedatas.cardsontable) {
      var card = this.gamedatas.cardsontable[i];
      var color = card.type;
      var value = card.type_arg;
      var playerId = card.location_arg;
      this.playCardOnTable(playerId, color, value, card.id);
    }
    console.log('connect to dojo');
    // Connect card selection with handler
    dojo.connect(
      this.playerHand,
      'onChangeSelection',
      this,
      'onPlayerHandSelectionChanged'
    );
    this._notificationSystem = new NotificationSystem(this);
    console.log('Ending game setup');
  };
  /* Game & client states */
  /**
   * Called each time we are entering into a new game state.
   *
   * @param {string} stateName
   * @param {*} args
   */
  Main.prototype.onEnteringState = function (stateName, args) {
    console.log('Entering state: ' + stateName);
    switch (stateName) {
      /* Example:
      
                case 'myGameState':
      
                    // Show some HTML block at this game state
                    dojo.style( 'my_html_block_id', 'display', 'block' );
      
                    break;
              */
      case 'dummmy':
        break;
    }
  };
  /**
   * Called each time we are leaving a game state.
   * You can use this method to perform some user interface changes at this moment.
   *
   * @param {string} stateName State the game is leaving
   */
  Main.prototype.onLeavingState = function (stateName) {
    console.log('Leaving state: ' + stateName);
    switch (stateName) {
      /* Example:
      
                case 'myGameState':
      
                  // Hide the HTML block we are displaying only during this game state
                  dojo.style( 'my_html_block_id', 'display', 'none' );
      
                  break;
              */
      case 'dummmy':
        break;
    }
  };
  /**
   * Manage "action buttons" that are displayed in the action status bar (ie: the HTML links in the status bar).
   *
   * @param {string} stateName New state to transition to
   * @param {*} [_args] data passed from state transition
   */
  Main.prototype.onUpdateActionButtons = function (stateName, _args) {
    console.log('onUpdateActionButtons: ' + stateName); /*
          /*
            TODO
            if (this.isCurrentPlayerActive()) {
              switch (stateName) {
                /*
                  Example:
    
                  case 'myGameState':
    
                    // Add 3 action buttons in the action status bar:
    
                    this.addActionButton( 'button_1_id', _('Button 1 label'), 'onMyMethodToCall1' );
                    this.addActionButton( 'button_2_id', _('Button 2 label'), 'onMyMethodToCall2' );
                    this.addActionButton( 'button_3_id', _('Button 3 label'), 'onMyMethodToCall3' );
                    break;
                */ /*
      }
    }
  */
  };
  /* Utility methods */
  /**
   * Get card unique identifier based on its color and value
   *
   * @param {number} color suit of card
   * @param {number} value value of card
   * @returns Unique number derived from suit and value
   */
  Main.prototype.getCardUniqueId = function (color, value) {
    return (color - 1) * 13 + (value - 2);
  };
  /**
   * Play card on the table for any player
   *
   * @param {number} playerId - player direction (N,S,W,E)
   * @param {number} color - suit of card
   * @param {number} value - value of card
   * @param {number} cardId - card id
   */
  Main.prototype.playCardOnTable = function (playerId, color, value, cardId) {
    // playerId => direction
    var cardOnTablePlayerId = 'cardontable_' + playerId.toString();
    var overallPlayerBoardPlayerId =
      'overall_player_board_' + playerId.toString();
    var myHandItemCardId = 'myhand_item_' + cardId.toString();
    var playerTableCardPlayerId = 'playertablecard_' + playerId.toString();
    // Draw card on screen
    dojo.place(
      this.format_block('jstpl_cardontable', {
        x: this.cardwidth * (value - 2),
        y: this.cardheight * (color - 1),
        player_id: playerId
      }),
      playerTableCardPlayerId
    );
    // Move card from player panel or from hand
    if (+playerId !== +this.playerId) {
      // Move card from opponent player panel
      this.placeOnObject(cardOnTablePlayerId, overallPlayerBoardPlayerId);
    } else {
      // Play card from your own hand
      if ($(myHandItemCardId) != null) {
        this.placeOnObject(cardOnTablePlayerId, myHandItemCardId);
        this.playerHand.removeFromStockById(cardId);
      }
    }
    // In any case: move it to its final destination
    this.slideToObject(cardOnTablePlayerId, playerTableCardPlayerId).play();
  };
  /* Player's action */
  Main.prototype.onPlayerHandSelectionChanged = function () {
    var items = this.playerHand.getSelectedItems();
    var playCardAction = 'playCard';
    var giveCardsAction = 'giveCards';
    if (items.length > 0) {
      var hasChosenPlayCard = this.checkAction(playCardAction, true);
      var hasChosenGiveCards = this.checkAction(giveCardsAction, true);
      if (hasChosenPlayCard) {
        // Can play a card
        var cardId = items[0].id;
        var actionEndpoint = ''.concat(
          '/',
          this.game_name,
          '/',
          this.game_name.toString(),
          '/',
          playCardAction,
          '.html'
        );
        this.ajaxcall(
          actionEndpoint,
          { id: cardId, lock: true },
          this,
          function (result) {},
          function (isError) {}
        );
        this.playerHand.unselectAll();
      } else if (hasChosenGiveCards) {
        // Can give cards => let the player select some cards
      } else {
        this.playerHand.unselectAll();
      }
    }
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
    var _this = this;
    this.notif_trickWin = this.notif_empty;
    this.main = main;
    this.handlers = [
      new NotificationHandler('newHand', this.notif_newHand),
      new NotificationHandler('playCard', this.notif_playCard),
      new NotificationHandler('trickWin', this.notif_trickWin, 1000),
      new NotificationHandler(
        'giveAllCardsToPlayer',
        this.notif_giveAllCardsToPlayer
      ),
      new NotificationHandler('newScores', this.notif_newScores)
    ];
    console.log('notifications subscriptions setup');
    this.handlers.forEach(function (handler) {
      dojo.subscribe(handler.name, handler.callback.bind(_this));
      if (handler.syncTimer != null) {
        _this.main.notifqueue.setSynchronous(handler.name, handler.syncTimer);
      }
    });
  }
  NotificationSystem.prototype.notif_newHand = function (notif) {
    // We received a received a new full hand of 13 cards.
    this.main.playerHand.removeAll();
    for (var i in notif.args.cards) {
      var card = notif.args.cards[i];
      var color = card.type;
      var value = card.type_arg;
      this.main.playerHand.addToStockWithId(
        this.main.getCardUniqueId(color, value),
        card.id
      );
    }
  };
  NotificationSystem.prototype.notif_playCard = function (notif) {
    this.main.playCardOnTable(
      notif.args.playerId,
      notif.args.color,
      notif.args.value,
      notif.args.cardId
    );
  };
  NotificationSystem.prototype.notif_empty = function (notif) {
    /* No code */
  };
  NotificationSystem.prototype.notif_giveAllCardsToPlayer = function (notif) {
    var winnerId = notif.args.playerId;
    var overallPlayerBoardWinnerId =
      'overall_player_board_' + winnerId.toString();
    for (var playerId in this.main.gamedatas.players) {
      var cardOnTablePlayerId = 'cardontable_' + playerId;
      var anim = this.main.slideToObject(
        cardOnTablePlayerId,
        overallPlayerBoardWinnerId
      );
      dojo.connect(anim, 'onEnd', function (node) {
        console.log('triggered');
        dojo.destroy(node);
      });
      anim.play();
    }
  };
  NotificationSystem.prototype.notif_newScores = function (notif) {
    for (var playerId in notif.args.newScores) {
      this.main.scoreCtrl[playerId].toValue(notif.args.newScores[playerId]);
      console.log(this.main.scoreCtrl);
    }
  };
  return NotificationSystem;
})();
