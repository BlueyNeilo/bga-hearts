<?php

namespace Hearts;

use Hearts\Game;

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
        Notifications::notify('playCard', array($currentCard, $playerId));

        // Next player
        Game::get()->gamestate->nextState('playCard');
    }
}