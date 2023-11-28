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
        $value = $currentCard['type_arg'];
        $color = $currentCard['type'];

        // First player of trick sets the trick suit
        $currentTrickColor = Game::get()->getGameStateValue('trickColor');
        if ($currentTrickColor == 0) {
            Game::get()->setGameStateValue('trickColor', $color);
        }

        // And notify
        Game::get()->notifyAllPlayers(
            'playCard',
            clienttranslate('${playerName} plays ${valueDisplayed} ${colorDisplayed}'),
            array(
                'i18n' => array('colorDisplayed', 'valueDisplayed'),
                'cardId' => $cardId,
                'playerId' => $playerId,
                'playerName' => Game::get()->getActivePlayerName(),
                'value' => $value,
                'valueDisplayed' => Game::get()->values_label[$value],
                'color' => $color,
                'colorDisplayed' => Game::get()->colors[$color]['name']
            )
        );
        // Next player
        Game::get()->gamestate->nextState('playCard');
    }
}