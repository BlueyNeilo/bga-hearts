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

define([
  'dojo',
  'dojo/_base/declare',
  'ebg/core/gamegui',
  'ebg/counter',
  'ebg/stock',
], function (dojo, declare) {
  return declare('bgagame.heartsblueinyellow', ebg.core.gamegui, {
    constructor: function () {
      console.log('heartsblueinyellow constructor')
      this.cardwidth = 72
      this.cardheight = 96
    },

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
    setup: function (gamedatas) {
      console.log('Starting game setup')

      this.playerId = this.player_id

      // Player hand
      this.playerHand = new ebg.stock()
      this.playerHand.create(this, $('myhand'), this.cardwidth, this.cardheight)

      this.playerHand.image_items_per_row = 13

      // Create cards types
      for (let color = 1; color <= 4; color++) {
        for (let value = 2; value <= 14; value++) {
          // Build card type id
          const cardTypeId = this.getCardUniqueId(color, value)
          this.playerHand.addItemType(
            cardTypeId,
            cardTypeId,
            g_gamethemeurl + 'img/cards.jpg',
            cardTypeId,
          )
        }
      }

      // Cards in player's hand
      for (const i in this.gamedatas.hand) {
        const card = this.gamedatas.hand[i]
        const color = card.type
        const value = card.type_arg
        const cardId = this.getCardUniqueId(color, value)
        this.playerHand.addToStockWithId(cardId, card.id)
      }

      // Cards played on table
      for (const i in this.gamedatas.cardsontable) {
        const card = this.gamedatas.cardsontable[i]
        const color = card.type
        const value = card.type_arg
        const playerId = card.location_arg
        this.playCardOnTable(playerId, color, value, card.id)
      }

      // Connect card selection with handler
      dojo.connect(
        this.playerHand,
        'onChangeSelection',
        this,
        'onPlayerHandSelectionChanged',
      )

      this.setupNotifications()

      console.log('Ending game setup')
    },

    /* Game & client states */

    /**
     * Called each time we are entering into a new game state.
     *
     * @param {string} stateName
     * @param {*} _args
     */
    onEnteringState: function (stateName: string, _args: any[]) {
      console.log('Entering state: ' + stateName)

      switch (stateName) {
        /* Example:

          case 'myGameState':

              // Show some HTML block at this game state
              dojo.style( 'my_html_block_id', 'display', 'block' );

              break;
        */
        case 'dummmy':
          break
      }
    },

    /**
     * Called each time we are leaving a game state.
     * You can use this method to perform some user interface changes at this moment.
     *
     * @param {string} stateName State the game is leaving
     */
    onLeavingState: function (stateName: string) {
      console.log('Leaving state: ' + stateName)

      switch (stateName) {
        /* Example:

          case 'myGameState':

            // Hide the HTML block we are displaying only during this game state
            dojo.style( 'my_html_block_id', 'display', 'none' );

            break;
        */

        case 'dummmy':
          break
      }
    },

    /**
     * Manage "action buttons" that are displayed in the action status bar (ie: the HTML links in the status bar).
     *
     * @param {string} stateName New state to transition to
     * @param {*} [_args] data passed from state transition
     */
    onUpdateActionButtons: function (stateName: string, _args: any[]) {
      console.log('onUpdateActionButtons: ' + stateName) /*
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
    },

    /* Utility methods */

    /**
     * Get card unique identifier based on its color and value
     *
     * @param {number} color suit of card
     * @param {number} value value of card
     * @returns Unique number derived from suit and value
     */
    getCardUniqueId: function (color, value) {
      return (color - 1) * 13 + (value - 2)
    },

    /**
     * Play card on the table for any player
     *
     * @param {number} playerId - player direction (N,S,W,E)
     * @param {number} color - suit of card
     * @param {number} value - value of card
     * @param {number} cardId - card id
     */
    playCardOnTable: function (
      playerId: number,
      color: number,
      value: number,
      cardId: number,
    ) {
      // playerId => direction
      const cardOnTablePlayerId = 'cardontable_' + playerId.toString()
      const overallPlayerBoardPlayerId =
        'overall_player_board_' + playerId.toString()
      const myHandItemCardId = 'myhand_item_' + cardId.toString()
      const playerTableCardPlayerId = 'playertablecard_' + playerId.toString()

      // Draw card on screen
      dojo.place(
        this.format_block('jstpl_cardontable', {
          x: this.cardwidth * (value - 2),
          y: this.cardheight * (color - 1),
          player_id: playerId,
        }),
        playerTableCardPlayerId,
      )

      // Move card from player panel or from hand
      if (+playerId !== +this.playerId) {
        // Move card from opponent player panel
        this.placeOnObject(cardOnTablePlayerId, overallPlayerBoardPlayerId)
      } else {
        // Play card from your own hand
        if ($(myHandItemCardId) != null) {
          this.placeOnObject(cardOnTablePlayerId, myHandItemCardId)
          this.playerHand.removeFromStockById(cardId)
        }
      }

      // In any case: move it to its final destination
      this.slideToObject(cardOnTablePlayerId, playerTableCardPlayerId).play()
    },

    /* Player's action */

    onPlayerHandSelectionChanged: function () {
      const items = this.playerHand.getSelectedItems()
      const playCardAction: string = 'playCard'
      const giveCardsAction: string = 'giveCards'

      const hasChosenPlayCard: boolean = this.checkAction(playCardAction, true)
      const hasChosenGiveCards: boolean = this.checkAction(giveCardsAction)

      if (items.length > 0) {
        if (hasChosenPlayCard) {
          // Can play a card
          const cardId = items[0].id
          const actionEndpoint = ''.concat(
            '/',
            this.game_name,
            '/',
            this.game_name.toString(),
            '/',
            playCardAction,
            '.html',
          )

          this.ajaxcall(
            actionEndpoint,
            { id: cardId, lock: true },
            this,
            function (result) {},
            function (isError) {},
          )

          this.playerHand.unselectAll()
        } else if (hasChosenGiveCards) {
          // Can give cards => let the player select some cards
        } else {
          this.playerHand.unselectAll()
        }
      }
    },

    /**
     * In this method, you associate each of your game notifications with your local method to handle it.
     *
     * Note: game notification names correspond to
     * "notifyAllPlayers" and "notifyPlayer" calls in your heartsblueinyellow.game.php file.
     */
    setupNotifications: function () {
      console.log('notifications subscriptions setup')

      dojo.subscribe('newHand', this, 'notif_newHand')
      dojo.subscribe('playCard', this, 'notif_playCard')

      dojo.subscribe('trickWin', this, 'notif_empty')
      this.notifqueue.setSynchronous('trickWin', 1000)

      dojo.subscribe('giveAllCardsToPlayer', this, 'notif_giveAllCardsToPlayer')
      dojo.subscribe('newScores', this, 'notif_newScores')
    },

    /* Notification handlers */

    notif_newHand: function (notif) {
      // We received a received a new full hand of 13 cards.
      this.playerHand.removeAll()

      for (const i in notif.args.cards) {
        const card = notif.args.cards[i]
        const color = card.type
        const value = card.type_arg

        this.playerHand.addToStockWithId(
          this.getCardUniqueId(color, value),
          card.id,
        )
      }
    },

    notif_playCard: function (notif) {
      this.playCardOnTable(
        notif.args.playerId,
        notif.args.color,
        notif.args.value,
        notif.args.cardId,
      )
    },

    notif_empty: function (notif) {
      /* No code */
    },

    notif_giveAllCardsToPlayer: function (notif) {
      const winnerId: number = notif.args.playerId
      const overallPlayerBoardWinnerId =
        'overall_player_board_' + winnerId.toString()

      for (const playerId in this.gamedatas.players) {
        const cardOnTablePlayerId = 'cardontable_' + playerId
        const anim = this.slideToObject(
          cardOnTablePlayerId,
          overallPlayerBoardWinnerId,
        )

        dojo.connect(anim, 'onEnd', function (node) {
          dojo.destroy(node)
        })
        anim.play()
      }
    },

    notif_newScores: function (notif) {
      for (const playerId in notif.args.newScores) {
        this.scoreCtrl[playerId].toValue(notif.args.newScores[playerId])
        console.log(this.scoreCtrl)
      }
    },
  })
})
