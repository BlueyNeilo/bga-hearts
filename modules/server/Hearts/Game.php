<?php

namespace Hearts;

use HeartsBlueInYellow;

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
