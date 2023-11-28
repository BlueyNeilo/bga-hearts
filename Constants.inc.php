<?php

abstract class GlobalIds
{
    const CURRENT_HAND_TYPE = 10;
    const TRICK_COLOR = 11;
    const ALREADY_PLAYED_HEARTS = 12;
    const POINTS_TO_LOSE = 13;
}

abstract class StateIds {
    const GAME_SETUP = 1;
    const NEW_HAND = 20;
    const GIVE_CARDS = 21;
    const TAKE_CARDS = 22;
    const NEW_TRICK = 30;
    const PLAYER_TURN = 31;
    const NEXT_PLAYER = 32;
    const END_HAND = 40;
    const GAME_END = 99;
}

abstract class StatIds
{
    const TABLE_TURNS_NUMBER = 10;
    const PLAYER_TURNS_NUMBER = 10;

}

abstract class CardSuits
{
    const UNDEFINED = 0;
    const SPADE = 1;
    const HEART = 2;
    const CLUB = 3;
    const DIAMOND = 4;
}

abstract class CardValues
{
    const TWO = 2;
    const THREE = 3;
    const FOUR = 4;
    const FIVE = 5;
    const SIX = 6;
    const SEVEN = 7;
    const EIGHT = 8;
    const NINE = 9;
    const TEN = 10;
    const JACK = 11;
    const QUEEN = 12;
    const KING = 13;
    const ACE = 14;
}