<?php

if (!defined('APP_GAMEMODULE_PATH')) {
    define('APP_GAMEMODULE_PATH', '');
}

require_once(__DIR__ . '/../common/deck.game.php');
use Doctrine\DBAL\DriverManager;
use Doctrine\DBAL\Configuration;

/**
 * Collection of stub classes for testing and stubs
 */
class APP_Object
{

    function dump($v, $value)
    {
        echo "$v=";
        var_dump($value);
    }

    function info($value)
    {
        echo "$value\n";
    }

    function trace($value)
    {
        echo "$value\n";
    }

    function debug($value)
    {
        echo "$value\n";
    }

    function watch($value)
    {
        echo "$value\n";
    }

    function warn($value)
    {
        echo "$value\n";
    }

    function error($msg)
    {
        echo "$msg\n";
    }
}

class APP_DbObject extends APP_Object
{
    public $query;

    // Stubbed implementation
    private $_db_conn;

    private function db_conn()
    {
        if (!$this->_db_conn) {
            $this->_db_conn = DriverManager::getConnection(
                CONNECTION_PARAMS,
                new Configuration()
            );
        }
        return $this->_db_conn;
    }

    function DbQuery($str)
    {
        $this->query = $str;
        $this->db_conn()->prepare($str)->executeQuery();
    }

    function getUniqueValueFromDB($sql)
    {
        return $this->db_conn()->executeQuery($sql)->fetchOne();
    }

    function getCollectionFromDB($query, $single = false, $low_priority_select = false)
    {
        return $this->getNonEmptyCollectionFromDB($query);
    }

    function getNonEmptyCollectionFromDB($sql)
    {
        // Massages the return data format based on how the real library performs
        $all = $this->db_conn()->executeQuery($sql)->fetchAllAssociative();
        $collection = array();
        if ($all) {
            $first_key = array_key_first($all[0]);
            foreach ($all as $row) {
                $key = $row[$first_key];
                array_shift($row);
                if (count($row) == 1) {
                    $row = array_values($row)[0];
                }
                $collection[$key] = $row;
            }
        }
        return $collection;
    }

    function getObjectFromDB($sql)
    {
        return $this->getNonEmptyObjectFromDB($sql);
    }

    function getNonEmptyObjectFromDB($sql)
    {
        return $this->db_conn()->fetchAssociative($sql);
    }

    function getObjectListFromDB($query, $single = false)
    {
        return $this->db_conn()->fetchAllAssociative($query);
    }

    function getDoubleKeyCollectionFromDB($sql, $bSingleValue = false)
    {
        return array();
    }

    function DbGetLastId()
    {
    }

    function DbAffectedRow()
    {
    }

    function escapeStringForDB($string)
    {
    }
}

class APP_Action extends APP_DbObject
{
}

class APP_GameClass extends APP_DbObject
{

    public function __construct()
    {
    }
}

class GameState
{
    public $table_globals;

    protected $action_callback = null;
    protected $manual_action_mode = true;
    private $current_state = 1;
    private $active_player = null;
    private $states = [];
    private $private_states = [];

    function __construct($states = [], $action_callback = null, $manual_action_mode = true)
    {
        $this->states = $states;
        $this->action_callback = $action_callback;
        $this->manual_action_mode = $manual_action_mode;
    }

    function state()
    {
        if (array_key_exists($this->current_state, $this->states)) {
            $state = $this->states[$this->current_state];
            $state['id'] = $this->current_state;
            return $state;
        }
        return [];
    }

    function getStateNumberByTransition($transition = null)
    {
        $state = $this->state();
        foreach ($state['transitions'] as $pos => $next_state) {
            if ($transition == $pos || !$transition) {
                return $next_state;
            }
        }

        throw new feException("This transition ($transition) is impossible at this state ($this->current_state)");
    }

    function changeActivePlayer($player_id)
    {
        $this->active_player = $player_id;
        $this->states[$this->current_state]['active_player'] = $player_id;
    }

    function setAllPlayersMultiactive()
    {
    }

    function setPlayersMultiactive($players, $next_state, $bExclusive = false)
    {
    }

    function setPlayerNonMultiactive($player_id, $next_state)
    {
    }

    public function isMutiactiveState()
    {
        $state = $this->state();
        return ($state['type'] == 'multipleactiveplayer');
    }

    public function getPlayerActiveThisTurn()
    {
        $state = $this->state();
        return $state['active_player'] ?? $this->active_player;
    }

    public function getActivePlayerList()
    {
        $state = $this->state();

        if ($state['type'] == 'activeplayer') {
            return [$this->getPlayerActiveThisTurn()];
        } else if ($state['type'] == 'multipleactiveplayer') {
            return $state['multiactive'] ?? [];
        } else
            return [];
    }

    // Return true if specified player is active right now.
    // This method take into account game state type, ie nobody is active if game state is "game" and several
    // players can be active if game state is "multiplayer"
    public function isPlayerActive($player_id)
    {
        return $player_id == $this->getPlayerActiveThisTurn();
    }


    function updateMultiactiveOrNextState($next_state_if_none)
    {
    }

    function nextState($transition = null)
    {
        $x = $this->getStateNumberByTransition($transition);
        $this->jumpToState($x);
    }

    function jumpToState($stateNum)
    {
        $this->current_state = $stateNum;

        if (!$this->manual_action_mode) {
            $this->runStateAction();
        }
    }

    function changeManualActionMode($is_manual_mode)
    {
        $this->manual_action_mode = $is_manual_mode;
    }

    function runStateAction()
    {
        $state = $this->states[$this->current_state];
        if (isset($state['action'])) {
            call_user_func($this->action_callback, $state['action']);
        }
    }

    function checkPossibleAction($action)
    {
        $state = $this->states[$this->current_state];
        count(
            array_filter(
                $state['possibleactions'],
                fn($possible_action) => $possible_action == $action
            )
        ) > 0;
    }

    function reloadState()
    {
        return $this->state();
    }


    function getPrivateState($playerId)
    {
        return $this->private_states[$playerId] ?? null;
    }

    function nextPrivateStateForPlayers($ids, $transition)
    {
    }

    function nextPrivateStateForAllActivePlayers($transition)
    {
    }

    function nextPrivateState($playerId, $transition)
    {
        $privstate = $this->getStateNumberByTransition($transition);
        $this->setPrivateState($playerId, $privstate);
    }

    function setPrivateState($playerId, $newStateId)
    {
        $this->private_states[$playerId] = $newStateId;
    }

    function initializePrivateStateForAllActivePlayers()
    {
    }

    function initializePrivateStateForPlayers($ids)
    {
    }

    function initializePrivateState($playerId)
    {
        $state = $this->state();
        $privstate = $state['initialprivate'];
        $this->setPrivateState($playerId, $privstate);
    }

    function unsetPrivateState($playerId)
    {
        $this->private_states[$playerId] = null;
    }

    function unsetPrivateStateForPlayers($ids)
    {
    }

    function unsetPrivateStateForAllPlayers()
    {
    }
}

class BgaUserException extends feException
{
    public function __construct($message, $code = 100)
    {
        parent::__construct($message, true, true, $code);
    }
}

class BgaSystemException extends feException
{
    public function __construct($message, $code = 100)
    {
        parent::__construct($message, false, false, $code);
    }
}


class BgaVisibleSystemException extends BgaSystemException
{
    public function __construct($message, $code = 100)
    {
        parent::__construct($message, $code);
    }
}

class feException extends Exception
{
    public function __construct($message, $expected = false, $visibility = true, $code = 100, $publicMsg = '')
    {
        parent::__construct($message, $code);
    }
}

abstract class Table extends APP_GameClass
{
    protected $current_player = null;
    protected $notif_log = array();
    var $players = array();
    public $gamename;
    public $gamestate = null;
    public bool $not_a_move_notification = false;

    public function __construct()
    {
        parent::__construct();

        require('states.inc.php');
        $this->gamestate = new GameState($machinestates, fn($action) => $this->$action(), true);
        $this->players = array();
    }

    /** Report gamename for translation function */
    abstract protected function getGameName();

    function getAllTableDatas()
    {
        return [];
    }

    function getActivePlayerId()
    {
        return $this->gamestate->getPlayerActiveThisTurn();
    }

    function getActivePlayerName()
    {
        return $this->players[$this->getActivePlayerId()]['player_name'];
    }

    function getTableOptions()
    {
        return [];
    }

    function getTablePreferences()
    {
        return [];
    }

    function loadPlayersBasicInfos()
    {
        $sql = "SELECT player_no, player_id, player_color, player_name, player_zombie from player";
        $players_data = $this->getObjectListFromDB($sql);
        $players = array();

        foreach ($players_data as $player) {
            $players[$player["player_id"]] = $player;
        }
        $this->players = $players;
        return $this->players;
    }

    protected function setCurrentPlayer($player_id)
    {
        $this->current_player = $player_id;
    }

    protected function getCurrentPlayerId($bReturnNullIfNotLogged = false)
    {
        return $this->current_player;
    }

    protected function getCurrentPlayerName()
    {
        return $this->players[$this->current_player]["player_name"];
    }

    protected function getCurrentPlayerColor()
    {
        return $this->players[$this->current_player]["player_color"];
    }

    function isCurrentPlayerZombie()
    {
        return $this->players[$this->current_player]["player_zombie"];
    }

    public function getPlayerNameById($player_id)
    {
        $players = self::loadPlayersBasicInfos();
        return $players[$player_id]['player_name'];
    }
    public function getPlayerNoById($player_id)
    {
        $players = self::loadPlayersBasicInfos();
        return $players[$player_id]['player_no'];
    }
    public function getPlayerColorById($player_id)
    {
        $players = self::loadPlayersBasicInfos();
        return $players[$player_id]['player_color'];
    }
    function eliminatePlayer($player_id)
    {
    }

    /**
     * Setup correspondance "labels to id"
     * @param [] $labels - map string -> int (label of state variable -> numeric id in the database)
     */
    function initGameStateLabels($labels)
    {
        $this->gamestate->table_globals = $labels;
    }

    function setGameStateInitialValue($value_label, $value_value)
    {
        $this->setGameStateValue($value_label, $value_value);
    }

    function getGameStateValue($value_label)
    {
        return $this->gamestate->table_globals[$value_label];
    }

    function setGameStateValue($value_label, $value_value)
    {
        $this->gamestate->table_globals[$value_label] = $value_value;
    }

    function incGameStateValue($value_label, $increment)
    {
        $this->setGameStateValue(
            $value_label,
            $this->getGameStateValue($value_label) + $increment
        );
    }

    /**
     *   Make the next player active (in natural order)
     */
    protected function activeNextPlayer()
    {
        $active_player = $this->getActivePlayerId();
        $next_player = array_keys($this->players)[0];
        if (isset($active_player)) {
            $next_player = $this->getPlayerAfter($active_player);
        }

        $this->gamestate->changeActivePlayer($next_player);
        return $next_player;
    }

    /**
     *   Make the previous player active  (in natural order)
     */
    protected function activePrevPlayer()
    {
        $active_player = $this->getActivePlayerId();
        $prev_player = array_keys($this->players)[0];
        if (isset($active_player)) {
            $prev_player = $this->getPlayerBefore($active_player);
        }

        $this->gamestate->changeActivePlayer($prev_player);
        return $prev_player;
    }

    /**
     * Check if action is valid regarding current game state (exception if fails)
     * if "bThrowException" is set to "false", the function return false in case of failure instead of throwing and exception
     * @param string $actionName
     * @param boolean $bThrowException
     */
    function checkAction($actionName, $bThrowException = true)
    {
        return $this->gamestate->checkPossibleAction($actionName);
    }

    function getNextPlayerTable()
    {
        return 0;
    }

    function getPrevPlayerTable()
    {
        return 0;
    }

    function getPlayerAfter($player_id)
    {
        $player_no = $this->getPlayerNoById($player_id);

        $next_player_id = array_values(
            array_filter(
                $this->players,
                fn($player) => $player['player_no'] == $player_no - count($this->players) + 1 || $player['player_no'] == $player_no + 1,
            )
        )[0]['player_id'];

        return $next_player_id;
    }

    function getPlayerBefore($player_id)
    {
        $player_no = $this->getPlayerNoById($player_id);

        $prev_player_id = array_values(
            array_filter(
                $this->players,
                fn($player) => $player['player_no'] == $player_no + count($this->players) - 1 || $player['player_no'] == $player_no - 1,
            )
        )[0]['player_id'];

        return $prev_player_id;
    }

    function createNextPlayerTable($players, $bLoop = true)
    {
        return array();
    }

    function createPrevPlayerTable($players, $bLoop = true)
    {
        return array();
    }

    function notifyAllPlayers($type, $message, $args)
    {
        $this->notif_log[] = array(
            'players' => array_map(fn($player) => $player['player_id'], $this->players),
            'type' => $type,
            'message' => $message,
            'args' => $args,
        );
    }

    function notifyPlayer($player_id, $notification_type, $notification_log, $notification_args)
    {
        $this->notif_log[] = array(
            'players' => array($player_id),
            'type' => $notification_type,
            'message' => $notification_log,
            'args' => $notification_args,
        );
    }

    function getStatTypes()
    {
        return [
            'player' => [],
            'table' => [],
        ];
    }

    function initStat($table_or_player, $name, $value, $player_id = null)
    {
    }

    function setStat($value, $name, $player_id = null, $bDoNotLoop = false)
    {
        echo "stat: $name=$value\n";
    }

    function incStat($delta, $name, $player_id = null)
    {
    }

    function getStat($name, $player_id = null)
    {
        return 0;
    }

    function _($s)
    {
        return $s;
    }

    function getPlayersNumber()
    {
        return 2;
    }

    function reattributeColorsBasedOnPreferences($players, $colors)
    {
    }

    function reloadPlayersBasicInfos()
    {
        $this->loadPlayersBasicInfos();
    }

    function getNew($deck_definition): object
    {
        return new Deck();
    }

    // Give standard extra time to this player
    // (standard extra time is a game option)
    function giveExtraTime($player_id, $specific_time = null)
    {
    }

    function getStandardGameResultObject(): array
    {
        return array();
    }

    function applyDbChangeToAllDB($sql)
    {
    }

    /**
     *
     * @deprecated
     */
    function applyDbUpgradeToAllDB($sql)
    {
    }


    /**
     * @suppress PHP0419
     */
    function getGameinfos(): array
    {
        unset($gameinfos);
        require('gameinfos.inc.php');
        if (isset($gameinfos)) {
            return $gameinfos;
        }
        throw new feException("gameinfos.inp.php suppose to define \$gameinfos variable");
    }

    /* Method to override to set up each game */
    abstract protected function setupNewGame($players, $options = array());

    public function stMakeEveryoneActive()
    {
        $this->gamestate->setAllPlayersMultiactive();
    }

    /* save undo state after all transations are done */
    function undoSavepoint()
    {
    }

    /* restored db to saved state */
    function undoRestorePoint()
    {
    }

    function getBgaEnvironment()
    {
        return "studio";
    }

    function say($text)
    {
        return;
    }
}

class Page
{
    public $blocks = array();

    public function begin_block($template, $block)
    {
        $this->blocks[$block] = array();
    }

    public function insert_block($block, $args)
    {
        $this->blocks[$block][] = $args;
    }
}

class GUser
{

    public function get_id()
    {
        return 1;
    }
}


// Arg types
define('AT_int', 0);        //  an integer
define('AT_posint', 1);     //  a positive integer
define('AT_float', 2);      //  a float
define('AT_email', 3);      //  an email
define('AT_url', 4);        //  a URL
define('AT_bool', 5);       //  1/0/true/false
define('AT_enum', 6);       //  argTypeDetails list the possible values
define('AT_alphanum', 7);   //  only 0-9a-zA-Z_ and space
define('AT_username', 8);   //  TEL username policy: alphanum caracters + accents
define('AT_login', 9);      //  AT_username | AT_email
define('AT_numberlist', 13);   //  exemple: 1,4;2,3;-1,2
define('AT_uuid', 17);         // an UUID under the forme 0123-4567-89ab-cdef
define('AT_version', 18);         // A tournoi site version (ex: 100516-1243)
define('AT_cityname', 20);         // City name: 0-9a-zA-Z_ , space, accents, ' and -
define('AT_filename', 21);         // File name: 0-9a-zA-Z_ , and "."
define('AT_groupname', 22);   //  4-50 alphanum caracters + accents + :
define('AT_timezone', 23);   //  alphanum caracters + /
define('AT_mediawikipage', 24);   // Mediawiki valid page name
define('AT_html_id', 26);   // HTML identifier: 0-9a-zA-Z_-
define('AT_alphanum_dash', 27);   //  only 0-9a-zA-Z_ and space + dash
define('AT_date', 28);   //  0-9 + "/" + "-"
define('AT_num', 29);   //  0-9
define('AT_alpha_strict', 30);   //  only a-zA-Z
define('AT_namewithaccent', 31);         // Like City name: 0-9a-zA-Z_ , space, accents, ' and -
define('AT_json', 32);         // JSON string
define('AT_base64', 33);         // Base64 string

define("FEX_bad_input_argument", 300);

class APP_GameAction extends APP_Action
{
    protected $game;
    protected $view;
    protected $viewArgs;
    function getArg($name, $type, $mandatory = true, $default = null)
    {
        return '';
    }
    protected function setAjaxMode($bCheckCsrf = true)
    {
    }
    protected function ajaxResponse($data = '')
    {
    }
    protected function isArg($argName)
    {
        return true;
    }
}

function totranslate($text)
{
    return $text;
}

function clienttranslate($x)
{
    return $x;
}

function mysql_fetch_assoc($res)
{
    return array();
}

function bga_rand($min, $max)
{
    return 0;
}

function getKeysWithMaximum($array, $bWithMaximum = true)
{
    return array();
}

function getKeyWithMaximum($array)
{
    return '';
}
