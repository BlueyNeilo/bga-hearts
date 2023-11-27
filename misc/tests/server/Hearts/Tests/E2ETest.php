<?php

declare(strict_types=1);


define('PROJECT_PATH', __DIR__ . "/../../../../..");
define('APP_GAMEMODULE_PATH', __DIR__ . '/../Stubs/');

use PHPUnit\Framework\TestCase;
use Doctrine\DBAL\DriverManager;
use Doctrine\DBAL\Configuration;
use Ramsey\Uuid\Uuid;

require_once "heartsblueinyellow.game.php";
require_once(__DIR__ . '/Util/Constants.php');
require PROJECT_PATH . '/vendor/autoload.php';

class GameSetup extends HeartsBlueInYellow
{
    function __construct()
    {
        parent::__construct();
        include PROJECT_PATH . "/material.inc.php";
    }
    function setupNewGame($players, $options = array())
    {
        parent::setupNewGame($players, $options);
    }

    function getCards()
    {
        return $this->cards;
    }

    function setupPlayers($player_count): array
    {
        $player_ids = array_slice(
            array(PLAYER1, PLAYER2, PLAYER3, PLAYER4),
            0,
            $player_count
        );
        $players = array();
        foreach ($player_ids as $player_no => $player_id) {
            $players[$player_id] = array(
                'player_id' => $player_id,
                'player_color' => 'ff0000',
                'player_canal' => Uuid::uuid4()->getHex()->toString(),
                'player_name' => 'TestPlayer' . ($player_no + 1),
                'player_avatar' => '',
                'player_no' => $player_no + 1,
            );
        }

        return $players;
    }

    function activeNextPlayer()
    {
        parent::activeNextPlayer();
    }

    function setCurrentPlayer($player_id)
    {
        parent::setCurrentPlayer($player_id);
    }

    function getAllDatas()
    {
        return parent::getAllDatas();
    }
}

final class E2ETest extends TestCase
{
    private $db_conn;

    function __construct()
    {
        parent::__construct();
        $this->db_conn = DriverManager::getConnection(
            CONNECTION_PARAMS,
            new Configuration()
        );
    }

    protected function setUp(): void
    {
        $rollback_schema = @file_get_contents(__DIR__ . '/Util/RollbackDb.sql');
        $this->db_conn->executeStatement($rollback_schema);

        $stub_schema = @file_get_contents(__DIR__ . '/Util/StubDb.sql');
        $this->db_conn->executeStatement($stub_schema);

        $main_schema = @file_get_contents(PROJECT_PATH . '/dbmodel.sql');
        $this->db_conn->executeStatement($main_schema);
    }

    protected function queryValue($query)
    {
        return $this->db_conn
            ->executeQuery($query)
            ->fetchOne();
    }

    public function testGameProgression()
    {
        $m = new GameSetup();
        $this->assertEquals(0, $m->getGameProgression());
    }

    public function testSetupNewGame()
    {
        $m = new GameSetup();
        $m->setupNewGame($m->setupPlayers(4));
        $this->assertEquals(4, $this->queryValue('select count(*) from player'));

        $this->assertEquals(0, $m->getGameStateValue('currentHandType'));
        $this->assertEquals(0, $m->getGameStateValue('trickColor'));
        $this->assertEquals(0, $m->getGameStateValue('alreadyPlayedHearts'));

        $this->assertEquals(52, count($m->getCards()->getCardsInLocation('deck')));
        $this->assertEquals(PLAYER1, $m->getActivePlayerId());
        $this->assertEquals(1, $m->gamestate->state()['id']);
    }

    public function testCycleActivePlayers()
    {
        $m = new GameSetup();
        $m->setupNewGame($m->setupPlayers(4));
        $m->activeNextPlayer();
        $this->assertEquals(PLAYER2, $m->getActivePlayerId());

        $m->activeNextPlayer();
        $this->assertEquals(PLAYER3, $m->getActivePlayerId());

        $m->activeNextPlayer();
        $this->assertEquals(PLAYER4, $m->getActivePlayerId());

        $m->activeNextPlayer();
        $this->assertEquals(PLAYER1, $m->getActivePlayerId());
    }

    public function testCurrentPlayerInitData()
    {
        $m = new GameSetup();
        $m->setupNewGame($m->setupPlayers(4));
        $m->setCurrentPlayer(PLAYER2);

        $gameData = $m->getAllDatas();
        $this->assertEquals(4, count($gameData['players']));
        $this->assertEquals(0, count($gameData['hand']));
        $this->assertEquals(0, count($gameData['cardsontable']));
    }

    public function testStateManualActionExecution()
    {
        $m = new GameSetup();
        $m->setupNewGame($m->setupPlayers(4));
        $this->assertEquals(1, $m->gamestate->state()['id']);
        $m->gamestate->nextState();
        $this->assertEquals(20, $m->gamestate->state()['id']);
        $m->gamestate->runStateAction();
        $this->assertEquals(30, $m->gamestate->state()['id']);
    }

    public function testStateAutoActionExecutionToPlayHand()
    {
        $m = new GameSetup();
        $m->setupNewGame($m->setupPlayers(4));
        $m->gamestate->changeManualActionMode(false);
        $m->gamestate->nextState();
        $this->assertEquals(31, $m->gamestate->state()['id']);

        $m->setCurrentPlayer(PLAYER3);
        $gamedata = $m->getAllDatas();
        $this->assertEquals(13, count($gamedata['hand']));
    }

    public function testPlayCardFromHand()
    {
        $m = new GameSetup();
        $m->setupNewGame($m->setupPlayers(4));
        $m->gamestate->changeManualActionMode(false);
        $m->gamestate->nextState();

        // TODO: Replace logic with zombie turn from player
        $m->setCurrentPlayer(PLAYER1);
        $gamedata_player1 = $m->getAllDatas();
        $m->playCard(array_values($gamedata_player1['hand'])[0]['id']);

        // First player should have less cards in hand
        $gamedata_player1 = $m->getAllDatas();
        $this->assertEquals(12, count($gamedata_player1['hand']));
        $this->assertEquals(1, count($gamedata_player1['cardsontable']));

        // Other players should see cards on table
        $m->setCurrentPlayer(PLAYER3);
        $gamedata_player3 = $m->getAllDatas();
        $this->assertEquals(13, count($gamedata_player3['hand']));
        $this->assertEquals(1, count($gamedata_player3['cardsontable']));

        // Transitions to next player
        $this->assertEquals(PLAYER2, $m->getActivePlayerId());
    }

    public function testSetupThreePlayerNewGame()
    {
        $m = new GameSetup();
        $m->setupNewGame($m->setupPlayers(3));
        $this->assertEquals(3, $this->queryValue('select count(*) from player'));
    }
}
