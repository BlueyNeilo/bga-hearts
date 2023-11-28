<?php

namespace Hearts;

use Hearts\Game;

/**
 * Player action logic to load into main class
 */
trait Actions
{
    function playCard($cardId)
    {
        Game::get()->checkAction("playCard");
        $playerId = Players::getActivePlayerId();

        Cards::moveCardToTable($cardId, $playerId);
        // XXX check rules here
        $currentCard = Cards::getCard($cardId);
        $color = $currentCard['type'];

        // First player of trick sets the trick suit
        $currentTrickColor = Game::get()->getGameStateValue('trickColor');
        if ($currentTrickColor == 0) {
            Game::get()->setGameStateValue('trickColor', $color);
        }

        // And notify
        Notifications::notifyAll('playCard', array($currentCard, $playerId));

        // Next player
        State::nextState('playCard');
    }
}