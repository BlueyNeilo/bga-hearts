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
  * heartsblueinyellow.game.php
  *
  * This is the main file for your game logic.
  *
  * In this PHP file, you are going to defines the rules of the game.
  *
  */


require_once( APP_GAMEMODULE_PATH.'module/table/table.game.php' );


class HeartsBlueInYellow extends Table
{
    private Deck $cards;
    public array $colors;
    public array $values_label;

	function __construct( )
	{
        // Your global variables labels:
        //  Here, you can assign labels to global variables you are using for this game.
        //  You can use any number of global variables with IDs between 10 and 99.
        //  If your game has options (variants), you also have to associate here a label to
        //  the corresponding ID in gameoptions.inc.php.
        // Note: afterwards, you can get/set the global variables with getGameStateValue/setGameStateInitialValue/setGameStateValue
        parent::__construct();
        self::initGameStateLabels( array(
            "currentHandType" => 10,
            "trickColor" => 11,
            "alreadyPlayedHearts" => 12,
        ));

        $this->cards = self::getNew("module.common.deck");
        $this->cards->init("card");
	}

    protected function getGameName( )
    {
		// Used for translations and stuff. Please do not modify.
        return "heartsblueinyellow";
    }

    /*
        setupNewGame:

        This method is called only once, when a new game is launched.
        In this method, you must setup the game according to the game rules, so that
        the game is ready to be played.
    */
    protected function setupNewGame( $players, $options = array() )
    {
        // Set the colors of the players with HTML color code
        // The default below is red/green/blue/orange/brown
        // The number of colors defined here must correspond to the maximum number of players allowed for the gams
        $gameinfos = self::getGameinfos();
        $default_colors = $gameinfos['player_colors'];

        // Create players
        // Note: if you added some extra field on "player" table in the database (dbmodel.sql), you can initialize it there.
        $sql = "INSERT INTO player (player_id, player_color, player_canal, player_name, player_avatar) VALUES ";
        $values = array();
        foreach( $players as $player_id => $player )
        {
            $color = array_shift( $default_colors );
            $values[] = "('".$player_id."','$color','".$player['player_canal']."','".addslashes( $player['player_name'] )."','".addslashes( $player['player_avatar'] )."')";
        }
        $sql .= implode( ",", $values );
        self::DbQuery( $sql );
        self::reattributeColorsBasedOnPreferences( $players, $gameinfos['player_colors'] );
        self::reloadPlayersBasicInfos();

        /************ Start the game initialization *****/

        // Init global values with their initial values

        // Note: hand types: 0 = give 3 cards to player on the left
        //                   1 = give 3 cards to player on the right
        //                   2 = give 3 cards to player opposite
        //                   3 = keep cards
        self::setGameStateInitialValue('currentHandType', 0);

        // Set current trick color to zero (= no trick color)
        self::setGameStateInitialValue('trickColor', 0);

        // Mark if we already played hearts during this hand
        self::setGameStateInitialValue('alreadyPlayedHearts', 0);

        // Create cards
        $cards = array ();
        // spade, heart, diamond, club
        foreach ( $this->colors as $colorId => $color) {
            //  2, 3, 4, ... K, A
            for ($value = 2; $value <= 14; $value ++) {
                $cards [] = array ('type' => $colorId, 'type_arg' => $value, 'nbr' => 1);
            }
        }

        $this->cards->createCards($cards, 'deck');

        // Activate first player (which is in general a good idea :) )
        $this->activeNextPlayer();

        /************ End of the game initialization *****/
    }

    /*
        getAllDatas:

        Gather all informations about current game situation (visible by the current player).

        The method is called each time the game interface is displayed to a player, ie:
        _ when the game starts
        _ when a player refreshes the game page (F5)
    */
    protected function getAllDatas()
    {
        $result = array();

        $currentPlayerId = self::getCurrentPlayerId();    // !! We must only return informations visible by this player !!

        // Get information about players
        // Note: you can retrieve some extra field you added for "player" table in "dbmodel.sql" if you need it.
        $sql = "SELECT player_id id, player_score score FROM player ";
        $result['players'] = self::getCollectionFromDb( $sql );

        // TODO: Gather all information about current game situation (visible by player $current_player_id).
        // Cards in player hand
        $result['hand'] = $this->cards->getCardsInLocation('hand', $currentPlayerId);

        // Cards played on the table
        $result['cardsontable'] = $this->cards->getCardsInLocation('cardsontable');

        return $result;
    }

    /*
        getGameProgression:

        Compute and return the current game progression.
        The number returned must be an integer beween 0 (=the game just started) and
        100 (= the game is finished or almost finished).

        This method is called each time we are in a game state with the "updateGameProgression" property set to true
        (see states.inc.php)
    */
    function getGameProgression()
    {
        // TODO: compute and return the game progression

        return 0;
    }


//////////////////////////////////////////////////////////////////////////////
//////////// Utility functions
////////////

    /*
        In this space, you can put any utility methods useful for your game logic
    */



//////////////////////////////////////////////////////////////////////////////
//////////// Player actions
////////////

    /*
        Each time a player is doing some game action, one of the methods below is called.
        (note: each method below must match an input method in heartsblueinyellow.action.php)
    */

    /*

    Example:

    function playCard( $card_id )
    {
        // Check that this is the player's turn and that it is a "possible action" at this game state (see states.inc.php)
        self::checkAction( 'playCard' );

        $player_id = self::getActivePlayerId();

        // Add your game logic to play a card there
        ...

        // Notify all players about the card played
        self::notifyAllPlayers( "cardPlayed", clienttranslate( '${player_name} plays ${card_name}' ), array(
            'player_id' => $player_id,
            'player_name' => self::getActivePlayerName(),
            'card_name' => $card_name,
            'card_id' => $card_id
        ) );

    }

    */

    function playCard($cardId) {
        self::checkAction("playCard");
        $playerId = self::getActivePlayerId();
        $this->cards->moveCard($cardId, 'cardsontable', $playerId);
        // XXX check rules here
        $currentCard = $this->cards->getCard($cardId);
        $value = $currentCard ['type_arg'];
        $color = $currentCard ['type'];

        // First player of trick sets the trick suit
        $currentTrickColor = self::getGameStateValue('trickColor');
        if ($currentTrickColor == 0) {
            self::setGameStateValue('trickColor', $color);
        }

        // And notify
        self::notifyAllPlayers(
            'playCard',
            clienttranslate('${playerName} plays ${valueDisplayed} ${colorDisplayed}'),
            array (
                'i18n' => array ('colorDisplayed', 'valueDisplayed'),
                'cardId' => $cardId,
                'playerId' => $playerId,
                'playerName' => self::getActivePlayerName(),
                'value' => $value,
                'valueDisplayed' => $this->values_label [$value],
                'color' => $color,
                'colorDisplayed' => $this->colors [$color] ['name']
            )
        );
        // Next player
        $this->gamestate->nextState('playCard');
    }

//////////////////////////////////////////////////////////////////////////////
//////////// Game state arguments
////////////

    /*
        Here, you can create methods defined as "game state arguments" (see "args" property in states.inc.php).
        These methods function is to return some additional information that is specific to the current
        game state.
    */

    /*

    Example for game state "MyGameState":

    function argMyGameState()
    {
        // Get some values from the current game situation in database...

        // return values:
        return array(
            'variable1' => $value1,
            'variable2' => $value2,
            ...
        );
    }
    */

    function argGiveCards() {
        return array ();
    }

//////////////////////////////////////////////////////////////////////////////
//////////// Game state actions
////////////

    /*
        Here, you can create methods defined as "game state actions" (see "action" property in states.inc.php).
        The action method of state X is called everytime the current game state is set to X.
    */

    /*

    Example for game state "MyGameState":

    function stMyGameState()
    {
        // Do some stuff ...

        // (very often) go to another gamestate
        $this->gamestate->nextState( 'some_gamestate_transition' );
    }
    */

    function stNewHand() {
        // Take back all cards (from any location => null) to deck
        $this->cards->moveAllCardsInLocation(null, "deck");
        $this->cards->shuffle('deck');
        // Deal 13 cards to each players
        // Create deck, shuffle it and give 13 initial cards
        $players = self::loadPlayersBasicInfos();
        foreach ( $players as $playerId => $player ) {
            $cards = $this->cards->pickCards(13, 'deck', $playerId);
            // Notify player about his cards
            self::notifyPlayer($playerId, 'newHand', '', array ('cards' => $cards ));
        }
        self::setGameStateValue('alreadyPlayedHearts', 0);
        $this->gamestate->nextState("");
    }

    function stNewTrick() {
        // New trick: active the player who wins the last trick, or the player who own the club-2 card
        // Reset trick color to 0 (= no color)
        self::setGameStateInitialValue('trickColor', 0);
        $this->gamestate->nextState();
    }

    function stNextPlayer() {
        // Active next player OR end the trick and go to the next trick OR end the hand
        if ($this->cards->countCardInLocation('cardsontable') == 4) {
            // This is the end of the trick
            // Move all cards to "cardswon" of the given player
            $bestValue = 0;
            $bestValuePlayerId = null;
            $currentTrickColor = self::getGameStateValue('trickColor');
            $cardsOnTable = $this->cards->getCardsInLocation('cardsontable');

            foreach ($cardsOnTable as $card) {
                $cardColor = $card ['type'];
                $cardValue = $card ['type_arg'];
                $cardPlayerId = $card ['location_arg'];

                if ($cardColor == $currentTrickColor) {
                    if ($bestValuePlayerId === null || $cardValue > $bestValue) {
                        $bestValuePlayerId = $cardPlayerId;
                        $bestValue = $cardValue;
                    }
                }
            }

            // Trick winner starts next trick
            $this->gamestate->changeActivePlayer($bestValuePlayerId);

            $this->cards->moveAllCardsInLocation('cardsontable', 'cardswon', null, $bestValuePlayerId);

            // Notify
            // Note: we use 2 notifications here in order to pause the display during the first notification
            //  before we move all cards to the winner (during the second)

            $players = self::loadPlayersBasicInfos();
            $bestValuePlayerName = $players [$bestValuePlayerId] ['player_name'];

            self::notifyAllPlayers(
                'trickWin',
                clienttranslate('${playerName} wins the trick'),
                array (
                    'playerId' => $bestValuePlayerId,
                    'playerName' => $bestValuePlayerName
                )
            );

            self::notifyAllPlayers(
                'giveAllCardsToPlayer', '',
                array ('playerId' => $bestValuePlayerId)
            );

            if ($this->cards->countCardInLocation('hand') == 0) {
                // End of the hand
                $this->gamestate->nextState("endHand");
            } else {
                // End of the trick
                $this->gamestate->nextState("nextTrick");
            }
        } else {
            // Standard case (not the end of the trick)
            // => just active the next player
            $playerId = self::activeNextPlayer();
            self::giveExtraTime($playerId);
            $this->gamestate->nextState('nextPlayer');
        }
    }

    function stEndHand() {
        // Count and score points, then end the game or go to the next hand.
        $players = self::loadPlayersBasicInfos();

        $playerToPoints = array ();
        foreach ($players as $playerId => $player) {
            $playerToPoints [$playerId] = 0;
        }

        // Gets all "hearts" + queen of spades (TODO)
        $HEART = 2;
        $cards = $this->cards->getCardsInLocation('cardswon');
        foreach ($cards as $card) {
            $playerId = $card ['location_arg'];
            if ($card['type'] == $HEART) {
                $playerToPoints [$playerId] ++;
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
                    array (
                        'playerId' => $playerId,
                        'playerName' => $players [$playerId] ['player_name'],
                        'nbr' => $points
                    )
                );
            } else {
                // No point lost (just notify)
                self::notifyAllPlayers("points", clienttranslate('${player_name} did not get any hearts'), array (
                    'player_id' => $playerId,'player_name' => $players [$playerId] ['player_name'] ));
            }
        }

        // Publish new scores
        $selectScoresSql = "SELECT player_id, player_score FROM player";
        $newScores = self::getCollectionFromDb($selectScoresSql, true);
        self::notifyAllPlayers("newScores", '', array('newScores' => $newScores));

        // Test if this is the end of the game
        foreach ($newScores as $playerId => $score) {
            if ($score <= -100) {
                // Trigger the end of the game !
                $this->gamestate->nextState("endGame");
                return;
            }
        }

        // Continue game with new hand
        $this->gamestate->nextState("nextHand");
    }

//////////////////////////////////////////////////////////////////////////////
//////////// Zombie
////////////

    /*
        zombieTurn:

        This method is called each time it is the turn of a player who has quit the game (= "zombie" player).
        You can do whatever you want in order to make sure the turn of this player ends appropriately
        (ex: pass).

        Important: your zombie code will be called when the player leaves the game. This action is triggered
        from the main site and propagated to the gameserver from a server, not from a browser.
        As a consequence, there is no current player associated to this action. In your zombieTurn function,
        you must _never_ use getCurrentPlayerId() or getCurrentPlayerName(), otherwise it will fail with a "Not logged" error message.
    */

    function zombieTurn( $state, $active_player )
    {
    	$statename = $state['name'];

        if ($state['type'] === "activeplayer") {
            switch ($statename) {
                default:
                    $this->gamestate->nextState( "zombiePass" );
                	break;
            }

            return;
        }

        if ($state['type'] === "multipleactiveplayer") {
            // Make sure player is in a non blocking status for role turn
            $this->gamestate->setPlayerNonMultiactive( $active_player, '' );

            return;
        }

        throw new feException( "Zombie mode not supported at this game state: ".$statename );
    }

///////////////////////////////////////////////////////////////////////////////////:
////////// DB upgrade
//////////

    /*
        upgradeTableDb:

        You don't have to care about this until your game has been published on BGA.
        Once your game is on BGA, this method is called everytime the system detects a game running with your old
        Database scheme.
        In this case, if you change your Database scheme, you just have to apply the needed changes in order to
        update the game database and allow the game to continue to run with your new version.

    */

    function upgradeTableDb( $from_version )
    {
        // $from_version is the current version of this game database, in numerical form.
        // For example, if the game was running with a release of your game named "140430-1345",
        // $from_version is equal to 1404301345

        // Example:
//        if( $from_version <= 1404301345 )
//        {
//            // ! important ! Use DBPREFIX_<table_name> for all tables
//
//            $sql = "ALTER TABLE DBPREFIX_xxxxxxx ....";
//            self::applyDbUpgradeToAllDB( $sql );
//        }
//        if( $from_version <= 1405061421 )
//        {
//            // ! important ! Use DBPREFIX_<table_name> for all tables
//
//            $sql = "CREATE TABLE DBPREFIX_xxxxxxx ....";
//            self::applyDbUpgradeToAllDB( $sql );
//        }
//        // Please add your future database scheme changes here
//
//


    }
}
