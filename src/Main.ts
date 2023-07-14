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
  private readonly notificationSystem: NotificationSystem
  private readonly stateSystem: StateSystem

  public readonly cardwidth: number
  public readonly cardheight: number
  public playerId: number
  public gameName: string
  public playerHand: PlayerHand

  constructor() {
    super()
    console.log('heartsblueinyellow constructor')
    this.cardwidth = 72
    this.cardheight = 96

    this.playerHand = new PlayerHand(this, new ebg.stock())
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
    this.gameName = this.game_name

    this.playerHand.setup()
    this.setupTableCards()
    this.notificationSystem.setup()

    console.log('Ending game setup')
  }

  /* Cards played on table */
  setupTableCards(): void {
    for (const i in this.gamedatas.cardsontable) {
      const card = this.gamedatas.cardsontable[i]
      const color = card.type
      const value = card.type_arg
      const playerId = card.location_arg

      Util.Display.playCardOnTable(this, playerId, color, value, card.id)
    }
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
    this.stateSystem.states[stateName]?.onEnterState(args.args)

    this.stateSystem.states[stateName] ??
      console.log('Missing state: ' + stateName)
  }

  /**
   * Called each time we are leaving a game state.
   * You can use this method to perform some user interface changes at this moment.
   *
   * @param {string} stateName State the game is leaving
   */
  onLeavingState(stateName: string): void {
    console.log('Leaving state: ' + stateName)
    this.stateSystem.states[stateName]?.onLeaveState()

    this.stateSystem.states[stateName] ??
      console.log('Missing state: ' + stateName)
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
      this.stateSystem.states[stateName]?.handleAction(args)
    } else if (!this.isSpectator) {
      // Multiplayer action
      this.stateSystem.states[stateName]?.handleOutOfTurnAction(args)
    }

    this.stateSystem.states[stateName] ??
      console.log('Missing state: ' + stateName)
  }
}
