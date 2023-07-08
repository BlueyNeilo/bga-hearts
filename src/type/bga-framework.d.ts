/* eslint-disable */
// Copied from https://github.com/elaskavaia/bga-dojoless/blob/main/src/types/bga-framework.d.ts

declare var gamegui: GameGui
declare var g_replayFrom: number | undefined
declare var g_gamethemeurl: string
declare var g_themeurl: string
declare var g_archive_mode: boolean
declare function _(str: string): string
declare function __(site: string, str: string): string
// declare function $(text: string | Element): HTMLElement

declare const define
declare const ebg
declare const dojo // TODO: Use dojo-typings
declare const dijit
declare type eventhandler = (event?: any) => void

type ElementOrId = Element | string
type StringProperties = Record<string, string>

declare class GameNotifQueue {
  /**
   * Set the notification deinfed by notif_type as "synchronous"
   * @param notif_type - the type of notification
   * @param duration - the duration of notification wait in milliseconds
   * If "duration" is specified: set a simple timer for it (milliseconds)
   * If "duration" is not specified, the notification handler MUST call "setSynchronousDuration"
   */
  setSynchronous(notif_type: string, duration?: number): void
  /**
   * Set dynamically the duration of a synchronous notification
   * MUST be called if your notification has not been associated with a duration in "setSynchronous"
   * @param duration - how long to hold off till next notficiation received (milliseconds)
   */
  setSynchronousDuration(duration: number): void

  /**
   * Ignore notification if predicate is true
   * @param notif_type  - the type of notificatio
   * @param predicate - the function that if returned true will make framework not dispatch notification.
   * NOTE: this cannot be used for syncronious unbound notifications
   */
  setIgnoreNotificationCheck(
    notif_type: string,
    predicate: (notif: object) => boolean,
  ): void
}
declare interface Notif {
  type: string // type of the notification (as passed by php function)
  log: string // the log string passed from php notification
  args: any // This is the arguments that you passed on your notification method on php
  bIsTableMsg: boolean // is true when you use [[Main_game_logic:_yourgamename.game.php#NotifyAllPlayers|NotifyAllPlayers]] method (false otherwise)
  channelorig: string // information about table ID (formatted as : "/table/t[TABLE_NUMBER]")
  gamenameorig: string // name of the game
  move_id: number // ID of the move associated with the notification
  table_id: number // ID of the table (comes as string)
  time: number // UNIX GMT timestamp
  uid: number // unique identifier of the notification
  h: string // unknown
}
declare class Counter {
  speed: number

  create(target: string): void //  associate counter with existing target DOM element
  getValue(): number //  return current value
  incValue(by: number): number //  increment value by "by" and animate from previous value
  setValue(value: number): void //  set value, no animation
  toValue(value: number): void // set value with animation
  disable(): void // Sets value to "-"
}

declare class GameGui {
  page_is_unloading: any
  game_name: string
  instantaneousMode: boolean
  player_id: number
  interface_min_width: number
  gamedatas: any
  isSpectator: boolean
  bRealtime: boolean
  notifqueue: GameNotifQueue
  last_server_state: any
  scoreCtrl: Record<number, Counter>
  on_client_state: boolean
  tooltips: string[]
  is_client_only: boolean
  prefs: any[]
  table_id: number
  metasiteurl: string

  isCurrentPlayerActive(): boolean
  getActivePlayerId(): number
  addActionButton(
    id: string,
    label: string,
    method: string | eventhandler,
    destination?: string | undefined,
    blinking?: boolean | undefined,
    color?: string | undefined,
  ): void
  checkAction(action: any, nomessage?: boolean | undefined): boolean
  ajaxcall(
    url: string,
    args: object,
    bind: GameGui,
    resultHandler: (result: any) => void,
    allHandler: (err: any) => void,
  ): void
  connect(node: ElementOrId, ontype: string, handler: any): void
  disconnect(node: ElementOrId, ontype: string): void
  connectClass(cls: string, ontype: string, handler: any): void
  setup(gamedatas: object): void
  onEnteringState(stateName: string, args: { args: any } | null): void
  onLeavingState(stateName: string): void
  onUpdateActionButtons(stateName: string, args: any): void
  setupNotifications(): void
  setClientState(newState: string, args: object): void
  restoreServerGameState(): void
  showMessage(msg: string, type: string): void
  showMoveUnauthorized(): void
  onScriptError(
    msg: string,
    url?: string | undefined,
    linenumber?: number | undefined,
  ): void
  inherited(args: any)
  format_string_recursive(log: string, args: any[]): string
  clienttranslate_string(text: string): string
  onScreenWidthChange(): void
  format_block(variable: string, args: object): string
  slideToObject(
    mobile_obj: string | Element,
    target_obj: string | Element,
    duration?: number | undefined,
    delay?: number | undefined,
  ): Animation
  slideToObjectPos(
    mobile_obj: string | Element,
    target_obj: string | Element,
    target_x: number,
    target_y: number,
    duration?: number | undefined,
    delay?: number | undefined,
  ): Animation
  slideTemporaryObject(
    mobile_obj_html: string,
    mobile_obj_parent: string | Element,
    from: string | Element,
    to: string | Element,
    duration?: number | undefined,
    delay?: number | undefined,
  ): Animation
  placeOnObject(child: ElementOrId, parent: ElementOrId): void
  displayScoring(
    anchor_id: string,
    color: string,
    score: string | number,
    duration?: number | undefined,
    offset_x?: number | undefined,
    offset_y?: number | undefined,
  ): void
  showBubble(
    anchor_id: string,
    text: string,
    delay?: number | undefined,
    duration?: number | undefined,
    custom_class?: string | undefined,
  ): void
  updateCounters(counters: any): void
  addTooltip(
    nodeId: string,
    helpStringTranslated: string,
    actionStringTranslated: string,
    delay?: number | undefined,
  ): void
  addTooltipHtml(nodeId: string, html: string, delay?: number | undefined): void
  addTooltipHtmlToClass(
    cssClass: string,
    html: string,
    delay?: number | undefined,
  ): void
  addTooltipToClass(
    cssClass: string,
    helpStringTranslated: string,
    actionStringTranslated: string,
    delay?: number | undefined,
  ): void
  removeTooltip(nodeId: string): void
  confirmationDialog(
    message: string,
    yesHandler: (param: any) => void,
    noHandler?: ((param: any) => void) | undefined,
    param?: any,
  ): void
  multipleChoiceDialog(
    message: string,
    choices: any[],
    callback: (choice: number) => void,
  ): void
  enablePlayerPanel(player_id: number): void
  disablePlayerPanel(player_id: number): void
}
