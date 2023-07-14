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
  return GameGui
})()

/**
 * Main program
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Main extends GameGui {
  private readonly cardwidth: number
  private readonly cardheight: number
  private readonly notificationSystem: NotificationSystem
  private readonly stateSystem: StateSystem
  private playerId: number
  public playerHand: any // Stock

  constructor() {
    super()
    console.log('heartsblueinyellow constructor')
    this.cardwidth = 72
    this.cardheight = 96

    this.notificationSystem = new NotificationSystem(this)
    this.stateSystem = new StateSystem(this)
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
  setup(_gamedatas: any): void {
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

    this.notificationSystem.setup()

    console.log('Ending game setup')
  }

  /* Game & client states */

  /**
   * Called each time we are entering into a new game state.
   *
   * @param {string} stateName
   * @param {*} args
   */
  onEnteringState(stateName: string, args: { args: any }): void {
    console.log('Entering state: ' + stateName)
    this.stateSystem.states[stateName].onEnterState(args.args)
  }

  /**
   * Called each time we are leaving a game state.
   * You can use this method to perform some user interface changes at this moment.
   *
   * @param {string} stateName State the game is leaving
   */
  onLeavingState(stateName: string): void {
    console.log('Leaving state: ' + stateName)
    this.stateSystem.states[stateName].onLeaveState()
  }

  /**
   * Manage "action buttons" that are displayed in the action status bar (ie: the HTML links in the status bar).
   *
   * @param {string} stateName New state to transition to
   * @param {*} [args] data passed from state transition
   */
  onUpdateActionButtons(stateName: string, args: any[]): void {
    console.log('onUpdateActionButtons: ' + stateName)

    if (this.isCurrentPlayerActive()) {
      this.stateSystem.states[stateName].handleAction(args)
    } else if (!this.isSpectator) {
      // Multiplayer action
      this.stateSystem.states[stateName].handleOutOfTurnAction(args)
    }
  }

  /* Utility methods */

  /**
   * Get card unique identifier based on its color and value
   *
   * @param {number} color suit of card
   * @param {number} value value of card
   * @returns Unique number derived from suit and value
   */
  getCardUniqueId(color: number, value: number): number {
    return (color - 1) * 13 + (value - 2)
  }

  /**
   * Play card on the table for any player
   *
   * @param {number} playerId - player direction (N,S,W,E)
   * @param {number} color - suit of card
   * @param {number} value - value of card
   * @param {number} cardId - card id
   */
  playCardOnTable(
    playerId: number,
    color: number,
    value: number,
    cardId: number,
  ): void {
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
  }

  /* Player's action */

  onPlayerHandSelectionChanged(): void {
    const items = this.playerHand.getSelectedItems()
    const playCardAction: string = 'playCard'
    const giveCardsAction: string = 'giveCards'

    if (items.length > 0) {
      const hasChosenPlayCard: boolean = this.checkAction(playCardAction, true)
      const hasChosenGiveCards: boolean = this.checkAction(
        giveCardsAction,
        true,
      )

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
  }
}
