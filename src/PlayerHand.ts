// eslint-disable-next-line @typescript-eslint/no-unused-vars
class PlayerHand {
  private readonly stock: any
  private readonly main: Main

  constructor(main: Main, stock: any) {
    this.main = main
    this.stock = stock
  }

  setup(): void {
    // Player hand
    this.stock.create(
      this.main,
      $('myhand'),
      this.main.cardwidth,
      this.main.cardheight,
    )

    this.stock.image_items_per_row = 13

    // Create cards types
    for (let color = 1; color <= 4; color++) {
      for (let value = 2; value <= 14; value++) {
        // Build card type id
        const cardTypeId = this.getCardUniqueId(color, value)
        this.stock.addItemType(
          cardTypeId,
          cardTypeId,
          g_gamethemeurl + 'img/cards.jpg',
          cardTypeId,
        )
      }
    }

    // Cards in player's hand
    this.constructHand(this.main.gamedatas.hand)

    // Connect card selection with handler
    dojo.connect(
      this.stock,
      'onChangeSelection',
      this,
      'onPlayerHandSelectionChanged',
    )
  }

  /* Player's action */
  private onPlayerHandSelectionChanged(): void {
    const items = this.stock.getSelectedItems()
    const playCardAction: string = 'playCard'
    const giveCardsAction: string = 'giveCards'

    if (items.length > 0) {
      const hasChosenPlayCard: boolean = this.main.checkAction(
        playCardAction,
        true,
      )
      const hasChosenGiveCards: boolean = this.main.checkAction(
        giveCardsAction,
        true,
      )

      if (hasChosenPlayCard) {
        // Can play a card
        const cardId = items[0].id
        Util.Ajax.sendAction(this.main, playCardAction, { id: cardId })
        this.stock.unselectAll()
      } else if (hasChosenGiveCards) {
        // Can give cards => let the player select some cards
      } else {
        this.stock.unselectAll()
      }
    }
  }

  /**
   * Get card unique identifier based on its color and value
   *
   * @param {number} color suit of card
   * @param {number} value value of card
   * @returns Unique number derived from suit and value
   */
  private getCardUniqueId(color: number, value: number): number {
    return (color - 1) * 13 + (value - 2)
  }

  constructHand(cards: any): void {
    for (const i in cards) {
      const card = cards[i]
      const color = card.type
      const value = card.type_arg

      const cardId = this.getCardUniqueId(color, value)
      this.stock.addToStockWithId(cardId, card.id)
    }
  }

  removeCard(cardId: number): void {
    this.stock.removeFromStockById(cardId)
  }

  removeAll(): void {
    this.stock.removeAll()
  }
}
