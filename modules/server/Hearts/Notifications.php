<?php

namespace Hearts;

/**
 * Notification system publish to UI
 */
class Notifications
{

    private static function lookupNotif()
    {
        return array(
            "playCard" => array(
                "message" => clienttranslate('${playerName} plays ${valueDisplayed} ${colorDisplayed}'),
                "build_args" => function ($card, $playerId) {
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
            "newHand" => array(
                "build_args" => fn($cards) => array('cards' => $cards)
            ),
            "trickWin" => array(
                "message" => clienttranslate('${playerName} wins the trick'),
                "build_args" => function ($trickWinnerId) {
                    $trickWinnerName = Players::get()[$trickWinnerId]['player_name'];

                    return array(
                        'playerId' => $trickWinnerId,
                        'playerName' => $trickWinnerName,
                    );
                }
            ),
            "giveAllCardsToPlayer" => array(
                "build_args" => fn($trickWinnerId) => array('playerId' => $trickWinnerId)
            ),
            "points" => array(
                "build_args" => function ($playerId, $points = null) {
                    $playerName = Players::get()[$playerId]['player_name'];
                    $args = array(
                        "playerId" => $playerId,
                        "playerName" => $playerName,
                    );
                    if ($points) {
                        $args = array_merge($args, array("nbr" => $points));
                    }
                    return $args;
                }
            ),
            "newScores" => array(
                "build_args" => fn($newScores) => array('newScores' => $newScores)
            ),
        );
    }

    public static function notify($playerId, $notification, $data = array())
    {
        $message = '';
        if (array_key_exists('message', self::lookupNotif()[$notification])) {
            $message = self::lookupNotif()[$notification]['message'];
        }

        Game::get()->notifyPlayer(
            $playerId,
            $notification,
            $message,
            self::lookupNotif()[$notification]["build_args"](...$data),
        );
    }
    public static function notifyAll($notification, $data = array(), $overrideMessage = null)
    {
        $message = $overrideMessage ?? '';
        if (array_key_exists('message', self::lookupNotif()[$notification])) {
            $message = self::lookupNotif()[$notification]['message'];
        }

        Game::get()->notifyAllPlayers(
            $notification,
            $message,
            self::lookupNotif()[$notification]["build_args"](...$data),
        );
    }
}