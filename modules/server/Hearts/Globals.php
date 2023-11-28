<?php

namespace Hearts;

require_once(__DIR__ . '/../../../Constants.inc.php');
use GlobalIds;

class Globals
{
    public static function init()
    {
        Game::get()->initGameStateLabels(
            array(
                "currentHandType" => GlobalIds::CURRENT_HAND_TYPE,
                "trickColor" => GlobalIds::TRICK_COLOR,
                "alreadyPlayedHearts" => GlobalIds::ALREADY_PLAYED_HEARTS,
                "pointsToLose" => GlobalIds::POINTS_TO_LOSE,
            )
        );
    }
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