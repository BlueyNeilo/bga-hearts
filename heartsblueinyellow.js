/**
 *------
 * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
 * HeartsBlueInYellow implementation : © Patrick Neilson <patrick.neilson.tech@gmail.com>
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 *
 * heartsblueinyellow.js
 *
 * HeartsBlueInYellow user interface script
 *
 * In this file, you are describing the logic of your user interface, in Javascript language.
 *
 */

define([
  'dojo', 'dojo/_base/declare',
  'ebg/core/gamegui',
  'ebg/counter',
  'ebg/stock'
],
function (dojo, declare) {
  return declare('bgagame.heartsblueinyellow', ebg.core.gamegui, {
    constructor: function () {
      console.log('heartsblueinyellow constructor');
      this.cardwidth = 72;
      this.cardheight = 96;

      // Here, you can init the global variables of your user interface
      // Example:
      // this.myGlobalValue = 0;
    },

    /**
     * This method must set up the game user interface
     * according to current game situation specified in parameters.
     *
     * The method is called each time the game interface is displayed to a player, ie:
     * - when the game starts
     * - when a player refreshes the game page (F5)
     *
     * @param {*} gamedatas contains all datas retrieved by your "getAllDatas" PHP method.
     */
    setup: function (gamedatas) {
      console.log('Starting game setup');

      this.playerId = this.player_id;

      // Player hand
      this.playerHand = new ebg.stock();
      this.playerHand.create(
        this,
        $('myhand'),
        this.cardwidth,
        this.cardheight
      );

      this.playerHand.image_items_per_row = 13;

      // Create cards types:
      for (let color = 1; color <= 4; color++) {
        for (let value = 2; value <= 14; value++) {
          // Build card type id
          const cardTypeId = this.getCardUniqueId(color, value);
          this.playerHand.addItemType(
            cardTypeId,
            cardTypeId,
            g_gamethemeurl + 'img/cards.jpg',
            cardTypeId
          );
        }
      }

      // Cards in player's hand
      for (const i in this.gamedatas.hand) {
        const card = this.gamedatas.hand[i];
        const color = card.type;
        const value = card.type_arg;
        const cardId = this.getCardUniqueId(color, value);
        this.playerHand.addToStockWithId(cardId, card.id);
      }

      // Cards played on table
      for (const i in this.gamedatas.cardsontable) {
        const card = this.gamedatas.cardsontable[i];
        const color = card.type;
        const value = card.type_arg;
        const playerId = card.location_arg;
        this.playCardOnTable(playerId, color, value, card.id);
      }

      dojo.connect(
        this.playerHand,
        'onChangeSelection', this, 'onPlayerHandSelectionChanged'
      );

      // Setting up player boards
      // for (const playerId in gamedatas.players) {
      //   const player = gamedatas.players[playerId];

      //   // TODO: Setting up players boards if needed
      // }

      // TODO: Set up your game interface here, according to "gamedatas"

      // Setup game notifications to handle (see "setupNotifications" method below)
      this.setupNotifications();

      console.log('Ending game setup');
    },

    /// ////////////////////////////////////////////////
    /// / Game & client states

    /**
     * Called each time we are entering into a new game state.
     *
     * @param {*} stateName
     * @param {*} _args
     */
    onEnteringState: function (stateName, _args) {
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
    },

    /**
     * Called each time we are leaving a game state.
     * You can use this method to perform some user interface changes at this moment.
     *
     * @param {string} stateName State the game is leaving
     */
    onLeavingState: function (stateName) {
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
    },

    /**
     * Manage "action buttons" that are displayed in the action status bar (ie: the HTML links in the status bar).
     *
     * @param {string} stateName New state to transition to
     * @param {*} [_args] ?
     */
    onUpdateActionButtons: function (stateName, _args) {
      console.log('onUpdateActionButtons: ' + stateName);
      /*
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
            *//*
          }
        }
      */
    },

    /// ////////////////////////////////////////////////
    /// / Utility methods

    /*
      Here, you can defines some utility methods that you can use everywhere in your javascript
      script.
    */

    // Get card unique identifier based on its color and value
    getCardUniqueId: function (color, value) {
      return (color - 1) * 13 + (value - 2);
    },

    /**
     * Play card on the table for any player
     *
     * @param {number} playerId - player direction (N,S,W,E)
     * @param {number} color - suit of card
     * @param {number} value - value of card
     * @param {number} cardId - card id
     */
    playCardOnTable: function (playerId, color, value, cardId) {
      // playerId => direction
      const cardOnTablePlayerId = 'cardontable_' + playerId;
      const overallPlayerBoardPlayerId = 'overall_player_board_' + playerId;
      const myHandItemCardId = 'myhand_item_' + cardId;
      const playerTableCardPlayerId = 'playertablecard_' + playerId;

      dojo.place(this.format_block('jstpl_cardontable', {
        x: this.cardwidth * (value - 2),
        y: this.cardheight * (color - 1),
        player_id: playerId
      }), playerTableCardPlayerId);

      if (+playerId !== +this.playerId) {
        // Some opponent played a card
        // Move card from player panel
        this.placeOnObject(cardOnTablePlayerId, overallPlayerBoardPlayerId);
      } else {
        // You played a card. If it exists in your hand, move card from there and remove
        // corresponding item

        if ($(myHandItemCardId)) {
          this.placeOnObject(cardOnTablePlayerId, myHandItemCardId);
          this.playerHand.removeFromStockById(cardId);
        }
      }

      // In any case: move it to its final destination
      this.slideToObject(cardOnTablePlayerId, playerTableCardPlayerId).play();
    },

    /// ////////////////////////////////////////////////
    /// / Player's action

    /*
      Here, you are defining methods to handle player's action (ex: results of mouse click on
      game objects).

      Most of the time, these methods:
      - check the action is possible at this game state.
      - make a call to the game server
    */

    onPlayerHandSelectionChanged: function () {
      const items = this.playerHand.getSelectedItems();
      const action = 'playCard';

      if (items.length > 0) {
        if (this.checkAction(action, true)) {
          // Can play a card
          const cardId = items[0].id;
          const actionEndpoint = '/' + this.game_name + '/' + this.game_name +
            '/' + action + '.html';

          this.ajaxcall(actionEndpoint, { id: cardId, lock: true }, this,
            function (result) {},
            function (isError) {}
          );

          this.playerHand.unselectAll();
        } else if (this.checkAction('giveCards')) {
          // Can give cards => let the player select some cards
        } else {
          this.playerHand.unselectAll();
        }
      }
    },

    /* Example:

      onMyMethodToCall1: function (evt) {
        console.log('onMyMethodToCall1');

        // Preventing default browser reaction
        dojo.stopEvent(evt);

        // Check that this action is possible (see "possibleactions" in states.inc.php)
        if (!this.checkAction('myAction')) { return; }

        this.ajaxcall(
          '/heartsblueinyellow/heartsblueinyellow/myAction.html',
          {
            lock: true
            // myArgument1: arg1,
            // myArgument2: arg2,
            // ...
          },
          this, function (result) {

            // What to do after the server call if it succeeded
            // (most of the time: nothing)

          }, function (isError) {

            // What to do after the server call in anyway (success or failure)
            // (most of the time: nothing)
          }
        );
      },
    */

    /// ////////////////////////////////////////////////
    /// / Reaction to cometD notifications

    /**
      * In this method, you associate each of your game notifications with your local method to handle it.
      *
      * Note: game notification names correspond to
      * "notifyAllPlayers" and "notifyPlayer" calls in your heartsblueinyellow.game.php file.
      */
    setupNotifications: function () {
      console.log('notifications subscriptions setup');

      // TODO: here, associate your game notifications with local methods

      // Example 1: standard notification handling
      // dojo.subscribe( 'cardPlayed', this, "notif_cardPlayed" );

      // Example 2: standard notification handling + tell the user interface to wait
      //            during 3 seconds after calling the method in order to let the players
      //            see what is happening in the game.
      // dojo.subscribe( 'cardPlayed', this, "notif_cardPlayed" );
      // this.notifqueue.setSynchronous( 'cardPlayed', 3000 );
      //

      dojo.subscribe('newHand', this, 'notif_newHand');
      dojo.subscribe('playCard', this, 'notif_playCard');

      dojo.subscribe('trickWin', this, 'notif_empty');
      this.notifqueue.setSynchronous('trickWin', 1000);

      dojo.subscribe(
        'giveAllCardsToPlayer', this, 'notif_giveAllCardsToPlayer'
      );
    },

    // TODO: from this point and below, you can write your game notifications handling methods

    /* Example:

      notif_cardPlayed: function( notif )
      {
          console.log( 'notif_cardPlayed' );
          console.log( notif );

          // Note: notif.args contains the arguments specified during you "notifyAllPlayers" / "notifyPlayer" PHP call

          // TODO: play the card in the user interface.
      },
    */
    notif_newHand: function (notif) {
      // We received a received a new full hand of 13 cards.
      this.playerHand.removeAll();

      for (const i in notif.args.cards) {
        const card = notif.args.cards[i];
        const color = card.type;
        const value = card.value;
        this.playerHand.addToStockWithId(
          this.getCardUniqueId(color, value), card.id
        );
      }
    },

    notif_playCard: function (notif) {
      this.playCardOnTable(
        notif.args.playerId,
        notif.args.color,
        notif.args.value,
        notif.args.cardId
      );
    },

    notif_empty: function (notif) { /* No code */ },

    notif_giveAllCardsToPlayer: function (notif) {
      const winnerId = notif.args.playerId;
      const overallPlayerBoardWinnerId = 'overall_player_board_' + winnerId;

      for (const playerId in this.gamedatas.players) {
        const cardOnTablePlayerId = 'cardontable_' + playerId;
        const anim = this.slideToObject(
          cardOnTablePlayerId, overallPlayerBoardWinnerId
        );

        dojo.connect(anim, 'onEnd', function (node) {
          dojo.destroy(node);
        });
        anim.play();
      }
    }
  });
});
