-- --------------------------------------------------------
-- Hôte :                        localhost
-- Version du serveur:           5.7.24 - MySQL Community Server (GPL)
-- SE du serveur:                Win64
-- HeidiSQL Version:             10.2.0.5599
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Listage de la structure de la base pour ddws
DROP DATABASE IF EXISTS `ddws`;
CREATE DATABASE IF NOT EXISTS `ddws` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `ddws`;

-- Listage de la structure de la table ddws. block_user
CREATE TABLE IF NOT EXISTS `block_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `begin` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `end` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_BLOCK_USER_USER` (`user_id`),
  CONSTRAINT `FK_BLOCK_USER_USER` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Listage des données de la table ddws.block_user : ~0 rows (environ)
DELETE FROM `block_user`;
/*!40000 ALTER TABLE `block_user` DISABLE KEYS */;
/*!40000 ALTER TABLE `block_user` ENABLE KEYS */;

-- Listage de la structure de la table ddws. buffer
CREATE TABLE IF NOT EXISTS `buffer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `house_id` int(11) DEFAULT NULL,
  `coalPowerPlant_id` int(11) DEFAULT NULL,
  `capacity` float NOT NULL,
  `ressource` float NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `FK_BUFFER_HOUSE` (`house_id`),
  KEY `FK_BUFFER_COAL_POWER_PLANT` (`coalPowerPlant_id`),
  CONSTRAINT `FK_BUFFER_COAL_POWER_PLANT` FOREIGN KEY (`coalPowerPlant_id`) REFERENCES `coal_power_plant` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_BUFFER_HOUSE` FOREIGN KEY (`house_id`) REFERENCES `house` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Listage des données de la table ddws.buffer : ~0 rows (environ)
DELETE FROM `buffer`;
/*!40000 ALTER TABLE `buffer` DISABLE KEYS */;
INSERT INTO `buffer` (`id`, `house_id`, `coalPowerPlant_id`, `capacity`, `ressource`) VALUES
	(1, NULL, 1, 500000, 0);
/*!40000 ALTER TABLE `buffer` ENABLE KEYS */;

-- Listage de la structure de la table ddws. coal_power_plant
CREATE TABLE IF NOT EXISTS `coal_power_plant` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Listage des données de la table ddws.coal_power_plant : ~1 rows (environ)
DELETE FROM `coal_power_plant`;
/*!40000 ALTER TABLE `coal_power_plant` DISABLE KEYS */;
INSERT INTO `coal_power_plant` (`id`) VALUES
	(1);
/*!40000 ALTER TABLE `coal_power_plant` ENABLE KEYS */;

-- Listage de la structure de la table ddws. coal_production
CREATE TABLE IF NOT EXISTS `coal_production` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `coal_power_plant_id` int(11) NOT NULL,
  `production` float NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_COAL_PRODUCTION_COAL_POWER_PLANT` (`coal_power_plant_id`),
  CONSTRAINT `FK_COAL_PRODUCTION_COAL_POWER_PLANT` FOREIGN KEY (`coal_power_plant_id`) REFERENCES `coal_power_plant` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Listage des données de la table ddws.coal_production : ~0 rows (environ)
DELETE FROM `coal_production`;
/*!40000 ALTER TABLE `coal_production` DISABLE KEYS */;
/*!40000 ALTER TABLE `coal_production` ENABLE KEYS */;

-- Listage de la structure de la table ddws. daily_wind
CREATE TABLE IF NOT EXISTS `daily_wind` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `speed` float NOT NULL,
  `day` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Listage des données de la table ddws.daily_wind : ~1 rows (environ)
DELETE FROM `daily_wind`;
/*!40000 ALTER TABLE `daily_wind` DISABLE KEYS */;
INSERT INTO `daily_wind` (`id`, `speed`, `day`) VALUES
	(1, 55.0217, '2021-11-29 19:39:00');
/*!40000 ALTER TABLE `daily_wind` ENABLE KEYS */;

-- Listage de la structure de la table ddws. global_house_consumption
CREATE TABLE IF NOT EXISTS `global_house_consumption` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `house_id` int(11) NOT NULL,
  `average_consumption` float NOT NULL,
  `average_second` float NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_HOUSE_CONSUMPTION_HOUSE` (`house_id`),
  CONSTRAINT `FK_HOUSE_CONSUMPTION_HOUSE` FOREIGN KEY (`house_id`) REFERENCES `house` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Listage des données de la table ddws.global_house_consumption : ~0 rows (environ)
DELETE FROM `global_house_consumption`;
/*!40000 ALTER TABLE `global_house_consumption` DISABLE KEYS */;
/*!40000 ALTER TABLE `global_house_consumption` ENABLE KEYS */;

-- Listage de la structure de la table ddws. house
CREATE TABLE IF NOT EXISTS `house` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_HOUSE_USER` (`user_id`),
  CONSTRAINT `FK_HOUSE_USER` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Listage des données de la table ddws.house : ~0 rows (environ)
DELETE FROM `house`;
/*!40000 ALTER TABLE `house` DISABLE KEYS */;
/*!40000 ALTER TABLE `house` ENABLE KEYS */;

-- Listage de la structure de la table ddws. house_consumption
CREATE TABLE IF NOT EXISTS `house_consumption` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `house_id` int(11) NOT NULL,
  `consumption` float NOT NULL,
  `timestamps` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_ELECTRICITY_CONSUMPTION_HOUSE` (`house_id`),
  CONSTRAINT `FK_ELECTRICITY_CONSUMPTION_HOUSE` FOREIGN KEY (`house_id`) REFERENCES `house` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Listage des données de la table ddws.house_consumption : ~0 rows (environ)
DELETE FROM `house_consumption`;
/*!40000 ALTER TABLE `house_consumption` DISABLE KEYS */;
/*!40000 ALTER TABLE `house_consumption` ENABLE KEYS */;

-- Listage de la structure de la table ddws. realtime_wind
CREATE TABLE IF NOT EXISTS `realtime_wind` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `speed` float NOT NULL,
  `timestamps` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

-- Listage des données de la table ddws.realtime_wind : ~7 rows (environ)
DELETE FROM `realtime_wind`;
/*!40000 ALTER TABLE `realtime_wind` DISABLE KEYS */;
INSERT INTO `realtime_wind` (`id`, `speed`, `timestamps`) VALUES
	(1, 59.121, '2021-11-29 19:39:10'),
	(2, 62.9927, '2021-11-29 19:40:30'),
	(3, 64.8102, '2021-11-29 19:40:40'),
	(4, 65.0599, '2021-11-29 19:40:50'),
	(5, 66.4731, '2021-11-29 19:41:00'),
	(6, 66.1491, '2021-11-29 19:43:30'),
	(7, 65.1058, '2021-11-29 19:43:40');
/*!40000 ALTER TABLE `realtime_wind` ENABLE KEYS */;

-- Listage de la structure de la table ddws. registration
CREATE TABLE IF NOT EXISTS `registration` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `hash` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_REGISTRATION_USER` (`user_id`),
  CONSTRAINT `FK_REGISTRATION_USER` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Listage des données de la table ddws.registration : ~0 rows (environ)
DELETE FROM `registration`;
/*!40000 ALTER TABLE `registration` DISABLE KEYS */;
/*!40000 ALTER TABLE `registration` ENABLE KEYS */;

-- Listage de la structure de la table ddws. reset_password
CREATE TABLE IF NOT EXISTS `reset_password` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `hash` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Listage des données de la table ddws.reset_password : ~2 rows (environ)
DELETE FROM `reset_password`;
/*!40000 ALTER TABLE `reset_password` DISABLE KEYS */;
/*!40000 ALTER TABLE `reset_password` ENABLE KEYS */;

-- Listage de la structure de la table ddws. user
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` enum('admin','prosumer') NOT NULL,
  `name` varchar(50) NOT NULL,
  `forename` varchar(50) NOT NULL,
  `address` varchar(50) DEFAULT NULL,
  `additional_address` varchar(50) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `zip_code` varchar(50) DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `password` char(64) NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Listage des données de la table ddws.user : ~2 rows (environ)
DELETE FROM `user`;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` (`id`, `type`, `name`, `forename`, `address`, `additional_address`, `city`, `zip_code`, `email`, `password`, `photo`) VALUES
	(1, 'admin', 'admin', 'test', NULL, NULL, NULL, NULL, 'admin@gmail.com', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
