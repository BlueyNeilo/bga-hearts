<?php

declare(strict_types=1);


define('PROJECT_PATH', __DIR__ . "/../../../../..");
define('APP_GAMEMODULE_PATH', __DIR__ . '/../Stubs/');

use PHPUnit\Framework\TestCase;
use Doctrine\DBAL\DriverManager;
use Doctrine\DBAL\Configuration;

require_once PROJECT_PATH . "/heartsblueinyellow.game.php";
require_once(__DIR__ . '/Util/Constants.php');

class GameSetup extends HeartsBlueInYellow {
    function __construct() {
        parent::__construct();
        include PROJECT_PATH . "/material.inc.php";
    }
    // override/stub methods here that access db and stuff
}

final class E2ETest extends TestCase {
    private $db_conn;

    function __construct() {
        parent::__construct();
        $this->db_conn = DriverManager::getConnection(
            CONNECTION_PARAMS,
            new Configuration()
        );
    }

    protected function setUp(): void {
        $rollback_schema = @file_get_contents(__DIR__ . '/Util/RollbackDb.sql');
        $this->db_conn->executeUpdate($rollback_schema);

        $stub_schema = @file_get_contents(__DIR__ . '/Util/StubDb.sql');
        $this->db_conn->executeUpdate($stub_schema);

        $main_schema = @file_get_contents(PROJECT_PATH .'/dbmodel.sql');
        $this->db_conn->executeUpdate($main_schema);
    }

    protected function queryValue($query) {
        return $this->db_conn
            ->executeQuery($query)
            ->fetchColumn();
    }

    public function testGameProgression() {
        $m = new GameSetup();
        $this->assertEquals(0, $m->getGameProgression());
    }

    public function testPlayersLoadedInDb() {
        $this->assertEquals(4, $this->queryValue('select count(*) from player'));
    }
}
