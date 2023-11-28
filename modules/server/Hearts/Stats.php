<?php

namespace Hearts;

use Hearts\Game;

/**
 * Player action logic to load into main class
 */
class Stats
{
    public static function setupNewGame()
    {
        Game::get()->initStat("table", "turns_number", 0);
        Game::get()->initStat("player", "turns_number", 0);
    }

    public static function incrementTurnCount()
    {
        $playerId = Players::getActivePlayerId();
        Game::get()->incStat(1, "turns_number", $playerId);
        Game::get()->incStat(1, "turns_number");
    }
}