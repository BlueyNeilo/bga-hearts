CREATE TABLE IF NOT EXISTS `player` (
  `player_no` int(10) UNSIGNED NOT NULL,
  `player_id` int(10) UNSIGNED NOT NULL COMMENT 'Reference to metagame player id',
  `player_canal` varchar(32) DEFAULT NULL COMMENT 'Player comet d "secret" canal',
  `player_name` varchar(32) NOT NULL DEFAULT 'Default user',
  `player_avatar` varchar(10) NOT NULL DEFAULT '000000',
  `player_color` varchar(6) NOT NULL DEFAULT 'ff0000',
  `player_score` int(10) NOT NULL DEFAULT '0',
  `player_score_aux` int(10) NOT NULL DEFAULT '0',
  `player_zombie` tinyint(1) NOT NULL DEFAULT '0' COMMENT '1 = player is a zombie',
  `player_ai` tinyint(1) NOT NULL DEFAULT '0' COMMENT '1 = player is an AI',
  `player_eliminated` tinyint(1) NOT NULL DEFAULT '0' COMMENT '1 = player has been eliminated',
  `player_next_notif_no` int(10) UNSIGNED NOT NULL DEFAULT '1' COMMENT 'Next notification no to be sent to player',
  `player_enter_game` tinyint(1) NOT NULL DEFAULT '0' COMMENT '1 = player load game view at least once',
  `player_over_time` tinyint(1) NOT NULL DEFAULT '0',
  `player_is_multiactive` tinyint(1) NOT NULL DEFAULT '0',
  `player_start_reflexion_time` datetime DEFAULT NULL COMMENT 'Time when the player reflexion time starts. NULL if its not this player turn',
  `player_remaining_reflexion_time` int(11) DEFAULT NULL COMMENT 'Remaining reflexion time. This does not include reflexion time for current move.',
  `player_beginner` varbinary(32) DEFAULT NULL,
  `player_state` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `player`
  ADD PRIMARY KEY (`player_no`),
  ADD UNIQUE KEY `player_id` (`player_id`),
  MODIFY `player_no` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

DROP TRIGGER IF EXISTS `before_insert_player`;
-- DELIMITER $$
-- CREATE TRIGGER `before_insert_player`
--   BEFORE INSERT ON `player`
--   FOR EACH ROW
--     BEGIN
--       IF NEW.player_canal IS NULL THEN
--         SET NEW.player_canal = REPLACE(UUID(), '-', '');
--       END IF;
--     END;
-- $$
-- DELIMITER ;

-- INSERT INTO `player` (`player_no`, `player_id`, `player_name`) VALUES
-- (1, 24810371, 'TestPlayer1'),
-- (2, 24810372, 'TestPlayer2'),
-- (3, 24810373, 'TestPlayer3'),
-- (4, 24810374, 'TestPlayer4');

CREATE TABLE IF NOT EXISTS `stats` (
  `stats_id` int(10) UNSIGNED NOT NULL,
  `stats_type` smallint(5) UNSIGNED NOT NULL,
  `stats_player_id` int(10) UNSIGNED DEFAULT NULL COMMENT 'if NULL: stat global to table',
  `stats_value` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `stats`
  ADD PRIMARY KEY (`stats_id`),
  ADD UNIQUE KEY `stats_table_id` (`stats_type`,`stats_player_id`),
  ADD KEY `stats_player_id` (`stats_player_id`),
  MODIFY `stats_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
