<?php

declare(strict_types=1);


define('PROJECT_PATH', __DIR__ . "/../../../../..");
define('APP_GAMEMODULE_PATH', __DIR__ . '/../Stubs/');

use PHPUnit\Framework\TestCase;
use Doctrine\DBAL\DriverManager;
use Doctrine\DBAL\Configuration;
use Ramsey\Uuid\Uuid;

require_once PROJECT_PATH . "/heartsblueinyellow.game.php";
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
            array_push(
                $players,
                array(
                    'player_id' => $player_id,
                    'player_color' => 'ff0000',
                    'player_canal' => Uuid::uuid4()->getHex()->toString(),
                    'player_name' => 'TestPlayer' . $player_no,
                    'player_avatar' => '',
                )
            );
        }

        return $players;
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
    }

    public function testSetupThreePlayerNewGame()
    {
        $m = new GameSetup();
        $m->setupNewGame($m->setupPlayers(3));
        $this->assertEquals(3, $this->queryValue('select count(*) from player'));
    }
}
