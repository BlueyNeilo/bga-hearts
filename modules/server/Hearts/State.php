<?php

namespace Hearts;

use CardSuits;

/**
 * State actions to load into main class
 */
trait State
{
    public static function nextState($transition = "")
    {
        Game::get()->gamestate->nextState($transition);
    }

    function stNewHand()
    {
        Cards::resetDeck();
        $playerIds = array_keys(Players::get());

        foreach ($playerIds as $playerId) {
            $cards = Cards::dealFromDeck($playerId);
            Notifications::notify($playerId, 'newHand', array($cards));
        }

        Game::get()->setGameStateValue('alreadyPlayedHearts', 0);
        self::nextState();
    }

    function stNewTrick()
    {
        // New trick: active the player who wins the last trick, or the player who own the club-2 card
        // Reset trick color to 0 (= no color)
        Game::get()->setGameStateInitialValue('trickColor', CardSuits::UNDEFINED);
        self::nextState();
    }

    function stNextPlayer()
    {
        Stats::incrementTurnCount();
        // Active next player OR end the trick and go to the next trick OR end the hand
        if (Cards::tableIsFull()) {
            // This is the end of the trick
            // Move all cards to "cardswon" of the given player
            $currentTrickColor = Game::get()->getGameStateValue('trickColor');
            $cardsOnTable = Cards::getCardsOnTable();

            $bestValuePlayerId = ScoringHelper::calculateTrickWinner($cardsOnTable, $currentTrickColor);

            // Trick winner starts next trick
            Players::changeActivePlayer($bestValuePlayerId);
            Cards::moveTableCardsToWinner($bestValuePlayerId);

            // Notify
            // Note: we use 2 notifications here in order to pause the display during the first notification
            //  before we move all cards to the winner (during the second)
            Notifications::notifyAll('trickWin', array($bestValuePlayerId));
            Notifications::notifyAll('giveAllCardsToPlayer', array($bestValuePlayerId));

            if (Cards::allHandsAreEmpty()) {
                // End of the hand
                self::nextState("endHand");
            } else {
                // End of the trick
                self::nextState("nextTrick");
            }
        } else {
            // Standard case (not the end of the trick)
            // => just active the next player
            Players::activeNextPlayerWithTime();
            self::nextState('nextPlayer');
        }
    }

    function stEndHand()
    {
        // Count and score points, then end the game or go to the next hand.
        $cardsWon = Cards::getCardsWon();
        $pointsByPlayer = ScoringHelper::calculateHandEndPoints($cardsWon);

        // Apply scores to players
        foreach ($pointsByPlayer as $playerId => $points) {
            if ($points == 0) {
                // No point lost (just notify)
                Notifications::notifyAll(
                    "points",
                    array($playerId),
                    clienttranslate('${playerName} did not get any hearts'),
                );
                continue;
            }

            Players::subtractScore($playerId, $points);
            Notifications::notifyAll(
                "points",
                array($playerId, $points),
                clienttranslate('${playerName} gets ${nbr} hearts and loses ${nbr} points')
            );
        }

        // Publish new scores
        $newScores = Players::getScores();
        Notifications::notifyAll("newScores", array($newScores));

        // Test if this is the end of the game
        foreach ($newScores as $playerId => $score) {
            if ($score <= -Game::get()->getGameStateValue('pointsToLose')) {
                // Trigger the end of the game !
                self::nextState("endGame");
                return;
            }
        }

        // Continue game with new hand
        self::nextState("nextHand");
    }
}
