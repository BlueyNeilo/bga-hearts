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
      new NotificationHandler('newHand', this.notif_newHand),
      new NotificationHandler('playCard', this.notif_playCard),
      new NotificationHandler('trickWin', this.notif_trickWin, 1000),
      new NotificationHandler(
        'giveAllCardsToPlayer',
        this.notif_giveAllCardsToPlayer,
      ),
      new NotificationHandler('newScores', this.notif_newScores),
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

  notif_newHand(notif: Notif): void {
    // We received a received a new full hand of 13 cards.
    this.main.playerHand.removeAll()
    this.main.playerHand.constructHand(notif.args.cards)
  }

  notif_playCard(notif: Notif): void {
    Util.Display.playCardOnTable(
      this.main,
      notif.args.playerId,
      notif.args.color,
      notif.args.value,
      notif.args.cardId,
    )
  }

  notif_trickWin = this.notif_empty

  notif_empty(notif: Notif): void {
    /* No code */
  }

  notif_giveAllCardsToPlayer(notif: Notif): void {
    const winnerId: number = notif.args.playerId
    const overallPlayerBoardWinnerId =
      'overall_player_board_' + winnerId.toString()

    for (const playerId in this.main.gamedatas.players) {
      const cardOnTablePlayerId = 'cardontable_' + playerId
      const anim = this.main.slideToObject(
        cardOnTablePlayerId,
        overallPlayerBoardWinnerId,
      )

      dojo.connect(anim, 'onEnd', function (node) {
        console.log('triggered')
        dojo.destroy(node)
      })
      anim.play()
    }
  }

  notif_newScores(notif: Notif): void {
    for (const playerId in notif.args.newScores) {
      this.main.scoreCtrl[playerId].toValue(notif.args.newScores[playerId])
      console.log(this.main.scoreCtrl)
    }
  }
}
