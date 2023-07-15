class NotificationHandler {
  name: string
  callback: (Notif) => void
  syncTimer: number | null

  constructor(
    name: string,
    callback: (Notif) => void,
    syncTimer: number | null = null,
  ) {
    this.name = name
    this.callback = callback
    this.syncTimer = syncTimer
  }
}

/**
 * Associate each of your game notifications with your local method to handle it.
 *
 * Note: game notification names correspond to
 * "notifyAllPlayers" and "notifyPlayer" calls in your heartsblueinyellow.game.php file.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class NotificationSystem {
  private readonly main: Main
  private readonly handlers: NotificationHandler[]

  constructor(main: Main) {
    this.main = main

    this.handlers = [
      new NotificationHandler('newHand', (notif: Notif) => {
        main.playerHand.removeAll()
        main.playerHand.constructHand(notif.args.cards)
      }),
      new NotificationHandler('playCard', (notif: Notif) => {
        const card: Card = {
          id: +notif.args.cardId,
          location: 'unknown',
          location_arg: +notif.args.playerId,
          type: notif.args.color,
          type_arg: +notif.args.value,
        }
        Util.Display.playCardOnTable(main, card)
      }),
      new NotificationHandler('trickWin', () => {}, 1000),
      new NotificationHandler('giveAllCardsToPlayer', (notif: Notif) => {
        Util.Display.giveTableCardsToTrickWinner(main, notif.args.playerId)
      }),
      new NotificationHandler('newScores', (notif: Notif) => {
        for (const playerId in notif.args.newScores) {
          main.scoreCtrl[playerId].toValue(notif.args.newScores[playerId])
        }
      }),
    ]
  }

  setup(): void {
    console.log('notifications subscriptions setup')

    this.handlers.forEach((handler) => {
      dojo.subscribe(handler.name, handler.callback.bind(this))
      if (handler.syncTimer != null) {
        this.main.notifqueue.setSynchronous(handler.name, handler.syncTimer)
      }
    })
  }
}
