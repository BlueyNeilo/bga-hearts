<?php

namespace Hearts;

class Notifications
{

    private static function lookupNotif()
    {
        return array(
            "playCard" => array(
                "message" => clienttranslate('${playerName} plays ${valueDisplayed} ${colorDisplayed}'),
                "make_args" => function ($card, $playerId) {
                    $cardId = $card["id"];
                    $value = $card["type_arg"];
                    $color = $card["type"];

                    return array(
                        'i18n' => array('colorDisplayed', 'valueDisplayed'),
                        'cardId' => $cardId,
                        'playerId' => $playerId,
                        'playerName' => Game::get()->getActivePlayerName(),
                        'value' => $value,
                        'valueDisplayed' => Game::get()->values_label[$value],
                        'color' => $color,
                        'colorDisplayed' => Game::get()->colors[$color]['name'],
                    );
                }
            ),
        );
    }

    public static function notify($playerId, $notification, $data = array())
    {
        Game::get()->notifyPlayer(
            $playerId,
            $notification,
            self::lookupNotif()[$notification]['message'],
            self::lookupNotif()[$notification]["make_args"](...$data),
        );
    }
    public static function notifyAll($notification, $data = array())
    {
        Game::get()->notifyAllPlayers(
            $notification,
            self::lookupNotif()[$notification]['message'],
            self::lookupNotif()[$notification]["make_args"](...$data),
        );
    }
}