<?php

namespace Hearts;

use CardSuits;

/**
 * Scoring logic
 */
class ScoringHelper
{
    public static function calculateTrickWinner($cardsPlayed, $currentTrickColor): string
    {
        $bestValue = 0;
        $bestValuePlayerId = null;

        foreach ($cardsPlayed as $card) {
            $cardColor = $card['type'];
            $cardValue = $card['type_arg'];
            $cardPlayerId = $card['location_arg'];

            if ($cardColor == $currentTrickColor) {
                if ($bestValuePlayerId === null || $cardValue > $bestValue) {
                    $bestValuePlayerId = $cardPlayerId;
                    $bestValue = $cardValue;
                }
            }
        }

        return $bestValuePlayerId;
    }

    // Return points by player
    public static function calculateHandEndPoints($cardsWon)
    {
        $playerIds = array_keys(Players::get());

        $pointsByPlayer = array();
        foreach ($playerIds as $playerId) {
            $pointsByPlayer[$playerId] = 0;
        }

        // Gets all "hearts" + queen of spades (TODO)
        foreach ($cardsWon as $card) {
            $playerId = $card['location_arg'];
            if ($card['type'] == CardSuits::HEART) {
                $pointsByPlayer[$playerId]++;
            }
        }

        return $pointsByPlayer;
    }
}
