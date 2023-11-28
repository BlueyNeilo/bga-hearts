<?php

namespace Hearts;

use Hearts\Game;

class Players
{
    static public function get()
    {
        return Game::get()->players;
    }

    static public function setupNewGame($players)
    {
        // Set the colors of the players with HTML color code
        // The default below is red/green/blue/orange/brown
        // The number of colors defined here must correspond to the maximum number of players allowed for the gams
        $gameinfos = Game::get()->getGameinfos();
        $default_colors = $gameinfos['player_colors'];

        // Create players
        // Note: if you added some extra field on "player" table in the database (dbmodel.sql), you can initialize it there.
        $sql = "INSERT INTO player (player_id, player_color, player_canal, player_name, player_avatar) VALUES ";
        $values = array();
        foreach ($players as $player_id => $player) {
            $color = array_shift($default_colors);
            $values[] = "('" . $player_id . "','$color','" . $player['player_canal'] . "','" . addslashes($player['player_name']) . "','" . addslashes($player['player_avatar']) . "')";
        }
        $sql .= implode(",", $values);
        Game::get()->DbQuery($sql);
        Game::get()->reattributeColorsBasedOnPreferences($players, $gameinfos['player_colors']);
        Game::get()->reloadPlayersBasicInfos();
    }

    static public function getActivePlayerId()
    {
        return Game::get()->getActivePlayerId();
    }
}

// Unexpected error: Wrong formatted data from gameserver 1 (method: createGame): JSON_ERROR_SYNTAX
// Warning: The use statement with non-compound name 'GlobalIds' has no effect in /var/tournoi/release/games/heartsblueinyellow/999999-9999/heartsblueinyellow.game.php on line 36
// {"status":1,"data":true} (reference: GS0 28/11 03:48:38)