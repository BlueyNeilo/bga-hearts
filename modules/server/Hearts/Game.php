<?php

namespace Hearts;

use HeartsBlueInYellow;

require_once(__DIR__ . '/../../../Constants.inc.php');

/**
 * Singleton wrapper of main game class
 */
class Game
{
    public static function get()
    {
        return HeartsBlueInYellow::get();
    }
}
