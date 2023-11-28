# Hearts (BGA Adaptation)

Game adapation on [Board Game Arena](https://boardgamearena.com/) following [BGA Studio Hearts Tutorial](https://en.doc.boardgamearena.com/Tutorial_hearts)

Completed tutorial reference found at [elaskavaia/bga-heartsla](https://github.com/elaskavaia/bga-heartsla)

# Setup

Frontend

`npm install`

Php

`composer update`

Database

`composer startdb`

`composer logindb`

`composer stopdb`

## Watching code

`npm run watch`

## Running tests

`composer test`

## Other additions

Dev experience

- [x] eslint formatting
- [x] intelephense PHP formatting
- [x] remove example comment code
- [x] typescript implementation
- [x] Automated unit tests
- [x] Add state transition diagram
- [x] Refactor _.ts _.game.php into files under modules or src folder

Gameplay mechanics

- [ ] Rule enforcement for playCard
- [ ] Start score from 100 and reach 0
- [ ] Add game option to start from 75 points
- [ ] Fix scoring rules with Q of spades and 26 point reverse scoring
- [ ] Player 1 starts with 2 of clubs
- [ ] Add card exchange states

BGA Features

- [x] Add statistics
- [ ] Add progress handling
- [ ] Add zombified player logic
