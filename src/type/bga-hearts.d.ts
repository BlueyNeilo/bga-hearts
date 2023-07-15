declare interface Card {
  id: number
  /* Suit */
  type: string
  /* Value */
  type_arg: number
  /* Board position */
  location: string
  /* With player (id) */
  location_arg: number
}
