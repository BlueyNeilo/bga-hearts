// eslint-disable-next-line @typescript-eslint/no-unused-vars
class PlayerHand {
  private readonly main: Main
  private readonly stock: any

  constructor(main: Main) {
    this.main = main
    this.stock = new ebg.stock()
  }

  setup(): void {
    this.setupStock()
    this.constructHand(this.main.gamedatas.hand)
    dojo.connect(this.stock, 'onChangeSelection', this, 'onSelectionChanged')
  }

  private setupStock(): void {
    this.stock.create(
      this.main,
      $('myhand'),
      this.main.cardwidth,
      this.main.cardheight,
    )

    this.stock.image_items_per_row = 13

    this.createCardTypes()
  }

  private createCardTypes(): void {
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
  }

  /* Player's action */
  private onSelectionChanged(): void {
    const selectedItems = this.stock.getSelectedItems()
    const playCardAction: string = 'playCard'
    const giveCardsAction: string = 'giveCards'

    if (selectedItems.length > 0) {
      const hasChosenPlayCard: boolean = Util.Ajax.checkAction(
        this.main,
        playCardAction,
      )
      const hasChosenGiveCards: boolean = Util.Ajax.checkAction(
        this.main,
        giveCardsAction,
      )

      if (hasChosenPlayCard) {
        // Can play a card
        const cardId = selectedItems[0].id
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

  constructHand(cards: Record<number, Card>): void {
    Object.values(cards).forEach((card) => {
      const color = +card.type
      const value = card.type_arg

      const cardId = this.getCardUniqueId(color, value)
      this.stock.addToStockWithId(cardId, card.id)
    })
  }

  removeCard(cardId: number): void {
    this.stock.removeFromStockById(cardId)
  }

  removeAll(): void {
    this.stock.removeAll()
  }
}
