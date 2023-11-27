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

/** @disregard PHP0437 because loaded into main class */
$this->colors = array(
  1 => array(
    'name' => clienttranslate('spade'),
    'nametr' => self::_('spade')
  ),
  2 => array(
    'name' => clienttranslate('heart'),
    'nametr' => self::_('heart')
  ),
  3 => array(
    'name' => clienttranslate('club'),
    'nametr' => self::_('club')
  ),
  4 => array(
    'name' => clienttranslate('diamond'),
    'nametr' => self::_('diamond')
  )
);

/** @disregard PHP0437 because loaded into main class */
$this->values_label = array(
  2 => '2',
  3 => '3',
  4 => '4',
  5 => '5',
  6 => '6',
  7 => '7',
  8 => '8',
  9 => '9',
  10 => '10',
  11 => clienttranslate('J'),
  12 => clienttranslate('Q'),
  13 => clienttranslate('K'),
  14 => clienttranslate('A')
);
