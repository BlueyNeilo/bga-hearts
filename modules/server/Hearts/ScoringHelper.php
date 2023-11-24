<?php

namespace Hearts;

class ScoringHelper {
    public static function calculateTrickWinner($cardsPlayed, $currentTrickColor) : string {
        $bestValue = 0;
        $bestValuePlayerId = null;

        foreach ($cardsPlayed as $card) {
            $cardColor = $card ['type'];
            $cardValue = $card ['type_arg'];
            $cardPlayerId = $card ['location_arg'];

            if ($cardColor == $currentTrickColor) {
                if ($bestValuePlayerId === null || $cardValue > $bestValue) {
                    $bestValuePlayerId = $cardPlayerId;
                    $bestValue = $cardValue;
                }
            }
        }

        return $bestValuePlayerId;
    }
}
