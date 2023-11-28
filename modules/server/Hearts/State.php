<?php

namespace Hearts;

trait State
{
    function stNewHand()
    {
        // Take back all cards (from any location => null) to deck
        Cards::resetDeck();
        // Deal 13 cards to each players
        // Create deck, shuffle it and give 13 initial cards
        $playerIds = array_keys(Players::get());
        foreach ($playerIds as $playerId) {
            $cards = Cards::dealFromDeck($playerId);
            // Notify player about his cards
            self::notifyPlayer($playerId, 'newHand', '', array('cards' => $cards));
        }
        self::setGameStateValue('alreadyPlayedHearts', 0);
        $this->gamestate->nextState("");
    }

    function stNewTrick()
    {
        // New trick: active the player who wins the last trick, or the player who own the club-2 card
        // Reset trick color to 0 (= no color)
        self::setGameStateInitialValue('trickColor', 0);
        $this->gamestate->nextState();
    }

    function stNextPlayer()
    {
        // Active next player OR end the trick and go to the next trick OR end the hand
        if (Cards::tableIsFull()) {
            // This is the end of the trick
            // Move all cards to "cardswon" of the given player
            $currentTrickColor = self::getGameStateValue('trickColor');
            $cardsOnTable = Cards::getCardsOnTable();

            $bestValuePlayerId = ScoringHelper::calculateTrickWinner($cardsOnTable, $currentTrickColor);

            // Trick winner starts next trick
            Players::changeActivePlayer($bestValuePlayerId);
            Cards::moveTableCardsToWinner($bestValuePlayerId);

            // Notify
            // Note: we use 2 notifications here in order to pause the display during the first notification
            //  before we move all cards to the winner (during the second)

            $bestValuePlayerName = Players::get()[$bestValuePlayerId]['player_name'];

            self::notifyAllPlayers(
                'trickWin',
                clienttranslate('${playerName} wins the trick'),
                array(
                    'playerId' => $bestValuePlayerId,
                    'playerName' => $bestValuePlayerName
                )
            );

            self::notifyAllPlayers(
                'giveAllCardsToPlayer',
                '',
                array('playerId' => $bestValuePlayerId)
            );

            if (Cards::allHandsAreEmpty()) {
                // End of the hand
                $this->gamestate->nextState("endHand");
            } else {
                // End of the trick
                $this->gamestate->nextState("nextTrick");
            }
        } else {
            // Standard case (not the end of the trick)
            // => just active the next player
            Players::activeNextPlayerWithTime();
            $this->gamestate->nextState('nextPlayer');
        }
    }

    function stEndHand()
    {
        // Count and score points, then end the game or go to the next hand.
        $players = self::loadPlayersBasicInfos();

        $playerToPoints = array();
        foreach ($players as $playerId => $player) {
            $playerToPoints[$playerId] = 0;
        }

        // Gets all "hearts" + queen of spades (TODO)
        $HEART = 2;
        $cards = Cards::getCardsWon();
        foreach ($cards as $card) {
            $playerId = $card['location_arg'];
            if ($card['type'] == $HEART) {
                $playerToPoints[$playerId]++;
            }
        }

        // Apply scores to players
        foreach ($playerToPoints as $playerId => $points) {
            if ($points != 0) {
                $updateScoreSql = "
                    UPDATE player SET player_score=player_score-$points
                    WHERE player_id='$playerId'
                ";
                self::DbQuery($updateScoreSql);
                self::notifyAllPlayers(
                    'points',
                    clienttranslate('${playerName} gets ${nbr} hearts and loses ${nbr} points'),
                    array(
                        'playerId' => $playerId,
                        'playerName' => $players[$playerId]['player_name'],
                        'nbr' => $points
                    )
                );
            } else {
                // No point lost (just notify)
                self::notifyAllPlayers(
                    "points",
                    clienttranslate('${player_name} did not get any hearts'),
                    array(
                        'player_id' => $playerId,
                        'player_name' => $players[$playerId]['player_name']
                    )
                );
            }
        }

        // Publish new scores
        $selectScoresSql = "SELECT player_id, player_score FROM player";
        $newScores = self::getCollectionFromDb($selectScoresSql, true);
        self::notifyAllPlayers("newScores", '', array('newScores' => $newScores));

        // Test if this is the end of the game
        foreach ($newScores as $playerId => $score) {
            if ($score <= -self::getGameStateValue('pointsToLose')) {
                // Trigger the end of the game !
                $this->gamestate->nextState("endGame");
                return;
            }
        }

        // Continue game with new hand
        $this->gamestate->nextState("nextHand");
    }
}
