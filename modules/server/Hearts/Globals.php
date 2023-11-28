<?php

namespace Hearts;

class Globals
{
    public static function setupNewGame()
    {
        // Init global values with their initial values

        // Note: hand types: 0 = give 3 cards to player on the left
        //                   1 = give 3 cards to player on the right
        //                   2 = give 3 cards to player opposite
        //                   3 = keep cards
        Game::get()->setGameStateInitialValue('currentHandType', 0);

        // Set current trick color to zero (= no trick color)
        Game::get()->setGameStateInitialValue('trickColor', 0);

        // Mark if we already played hearts during this hand
        Game::get()->setGameStateInitialValue('alreadyPlayedHearts', 0);

        Game::get()->setGameStateInitialValue('pointsToLose', 100);
    }
}