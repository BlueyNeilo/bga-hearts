<?php
/**
 *------
 * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
 * HeartsBlueInYellow implementation : © Patrick Neilson <patrick.neilson.tech@gmail.com>
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 *
 * material.inc.php
 *
 * HeartsBlueInYellow game material description
 *
 * Here, you can describe the material of your game with PHP variables.
 *
 * This file is loaded in your game logic class constructor, ie these variables
 * are available everywhere in your game logic code.
 *
 */


/*

Example:

$this->card_types = array(
    1 => array( "card_name" => ...,
                ...
              )
);

*/
require_once(__DIR__ . '/Constants.inc.php');

/** @disregard PHP0437 because loaded into main class */
$this->colors = array(
  CardSuits::SPADE => array(
    'name' => clienttranslate('spade'),
    'nametr' => self::_('spade')
  ),
  CardSuits::HEART => array(
    'name' => clienttranslate('heart'),
    'nametr' => self::_('heart')
  ),
  CardSuits::CLUB => array(
    'name' => clienttranslate('club'),
    'nametr' => self::_('club')
  ),
  CardSuits::DIAMOND => array(
    'name' => clienttranslate('diamond'),
    'nametr' => self::_('diamond')
  )
);

/** @disregard PHP0437 because loaded into main class */
$this->values_label = array(
  CardValues::TWO => '2',
  CardValues::THREE => '3',
  CardValues::FOUR => '4',
  CardValues::FIVE => '5',
  CardValues::SIX => '6',
  CardValues::SEVEN => '7',
  CardValues::EIGHT => '8',
  CardValues::NINE => '9',
  CardValues::TEN => '10',
  CardValues::JACK => clienttranslate('J'),
  CardValues::QUEEN => clienttranslate('Q'),
  CardValues::KING => clienttranslate('K'),
  CardValues::ACE => clienttranslate('A')
);
