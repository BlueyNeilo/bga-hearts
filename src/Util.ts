/**
 * Utility methods
 */
// eslint-disable-next-line
namespace Util {
  // eslint-disable-next-line
  export namespace Ajax {
    export function sendAction(main: Main, action: string, args: object): void {
      const actionEndpoint = ''.concat(
        '/',
        main.gameName,
        '/',
        main.gameName,
        '/',
        action,
        '.html',
      )

      main.ajaxcall(
        actionEndpoint,
        { ...args, lock: true },
        this,
        function (result) {},
        function (isError) {},
      )
    }
  }

  // eslint-disable-next-line
  export namespace Display {
    /**
     * Play card on the table for any player
     *
     * @param {Main} main - main game program
     * @param {number} playerId - player direction (N,S,W,E)
     * @param {number} color - suit of card
     * @param {number} value - value of card
     * @param {number} cardId - card id
     */
    export function playCardOnTable(
      main: Main,
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
        main.format_block('jstpl_cardontable', {
          x: main.cardwidth * (value - 2),
          y: main.cardheight * (color - 1),
          player_id: playerId,
        }),
        playerTableCardPlayerId,
      )

      // Move card from player panel or from hand
      if (+playerId !== +main.playerId) {
        // Move card from opponent player panel
        main.placeOnObject(cardOnTablePlayerId, overallPlayerBoardPlayerId)
      } else {
        // Play card from your own hand
        if ($(myHandItemCardId) != null) {
          main.placeOnObject(cardOnTablePlayerId, myHandItemCardId)
          main.playerHand.removeCard(cardId)
        }
      }

      // In any case: move it to its final destination
      main.slideToObject(cardOnTablePlayerId, playerTableCardPlayerId).play()
    }
  }
}
