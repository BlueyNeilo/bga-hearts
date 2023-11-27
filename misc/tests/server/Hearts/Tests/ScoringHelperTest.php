<?php

declare(strict_types=1);

namespace Hearts\Tests;

use PHPUnit\Framework\TestCase;
use Hearts\ScoringHelper;

require_once(__DIR__ . '/Util/Constants.php');

final class ScoringHelperTest extends TestCase
{
    public function testSameColorHigherValueWins(): void
    {
        $current_trick_color = 1;

        $playedCards = array(
            array(
                'type' => $current_trick_color,
                'type_arg' => 2,
                'location_arg' => PLAYER1
            ),
            array(
                'type' => $current_trick_color,
                'type_arg' => 4,
                'location_arg' => PLAYER2
            ),
            array(
                'type' => $current_trick_color,
                'type_arg' => 7,
                'location_arg' => PLAYER3
            ),
            array(
                'type' => $current_trick_color,
                'type_arg' => 3,
                'location_arg' => PLAYER4
            )
        );

        $this->assertSame(
            PLAYER3,
            ScoringHelper::calculateTrickWinner(
                $playedCards,
                $current_trick_color
            )
        );
    }

    public function testMixedSuitsHigherCurrentTrickWins(): void
    {
        $current_trick_color = 3;

        $playedCards = array(
            array(
                'type' => $current_trick_color,
                'type_arg' => 5,
                'location_arg' => PLAYER1
            ),
            array(
                'type' => 2,
                'type_arg' => 10,
                'location_arg' => PLAYER2
            ),
            array(
                'type' => $current_trick_color,
                'type_arg' => 3,
                'location_arg' => PLAYER3
            ),
            array(
                'type' => 4,
                'type_arg' => 3,
                'location_arg' => PLAYER4
            )
        );

        $this->assertSame(
            PLAYER1,
            ScoringHelper::calculateTrickWinner(
                $playedCards,
                $current_trick_color
            )
        );
    }

    // Should not happen in real game, first player sets the trick
    /**
     * @expectedException TypeError
     */
    public function testNoMatchingCurrentTrick(): void
    {
        $current_trick_color = 5;

        $playedCards = array(
            array(
                'type' => 1,
                'type_arg' => 5,
                'location_arg' => PLAYER1
            ),
            array(
                'type' => 2,
                'type_arg' => 10,
                'location_arg' => PLAYER2
            ),
            array(
                'type' => 3,
                'type_arg' => 3,
                'location_arg' => PLAYER3
            ),
            array(
                'type' => 4,
                'type_arg' => 3,
                'location_arg' => PLAYER4
            )
        );

        // Returns null unsuccessfully
        $this->expectException(\TypeError::class);
        ScoringHelper::calculateTrickWinner(
            $playedCards,
            $current_trick_color
        );
    }
}
