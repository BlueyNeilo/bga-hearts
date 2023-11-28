<?php

namespace Hearts;

use Deck;

/**
 * Card management
 */
class Cards
{
    protected static Deck $cards;

    public static function init()
    {
        self::$cards = Game::get()->newDeck();
        self::$cards->init("card");
        return self::$cards;
    }
    public static function get()
    {
        return self::$cards ?? self::init();
    }
    public static function setupNewGame()
    {
        // Create cards
        $cards = array();
        // spade, heart, diamond, club
        foreach (Game::get()->colors as $colorId => $color) {
            //  2, 3, 4, ... K, A
            for ($value = 2; $value <= 14; $value++) {
                $cards[] = array('type' => $colorId, 'type_arg' => $value, 'nbr' => 1);
            }
        }

        self::$cards->createCards($cards, 'deck');
    }

    public static function getData()
    {
        return array(
            "hand" => self::getPlayerHand(Players::getCurrentPlayerId()),
            "cardsontable" => self::getCardsOnTable(),
        );
    }

    public static function getPlayerHand($playerId)
    {
        return self::$cards->getCardsInLocation('hand', $playerId);
    }

    public static function moveCardToTable($cardId, $playerId)
    {
        self::$cards->moveCard($cardId, 'cardsontable', $playerId);
    }

    public static function getCard($cardId)
    {
        return self::$cards->getCard($cardId);
    }

    public static function getCardsOnTable()
    {
        return self::$cards->getCardsInLocation('cardsontable');
    }

    public static function tableIsFull()
    {
        return self::$cards->countCardInLocation('cardsontable') >= 4;
    }

    public static function allHandsAreEmpty()
    {
        return self::$cards->countCardInLocation('hand') == 0;
    }

    public static function resetDeck()
    {
        self::$cards->moveAllCardsInLocation(null, "deck");
        self::$cards->shuffle('deck');
    }

    public static function dealFromDeck($playerId, $handSize = 13)
    {
        return self::$cards->pickCards($handSize, 'deck', $playerId);
    }

    public static function moveTableCardsToWinner($winnerId)
    {
        self::$cards->moveAllCardsInLocation('cardsontable', 'cardswon', null, $winnerId);
    }

    public static function getCardsWon()
    {
        return self::$cards->getCardsInLocation('cardswon');
    }
}
