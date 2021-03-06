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
  `capacity` int(11) NOT NULL DEFAULT '0',
  `resource` float NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- Listage des données de la table ddws.buffer : ~2 rows (environ)
DELETE FROM `buffer`;
/*!40000 ALTER TABLE `buffer` DISABLE KEYS */;
INSERT INTO `buffer` (`id`, `capacity`, `resource`) VALUES
	(1, 5000000, 0),
	(2, 5000, 0);
/*!40000 ALTER TABLE `buffer` ENABLE KEYS */;

-- Listage de la structure de la table ddws. coal_power_plant
CREATE TABLE IF NOT EXISTS `coal_power_plant` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `buffer_percentage` float NOT NULL DEFAULT '0',
  `running` int(1) NOT NULL DEFAULT '0',
  `buffer_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_COAL_POWER_PLANT_BUFFER` (`buffer_id`),
  CONSTRAINT `FK_COAL_POWER_PLANT_BUFFER` FOREIGN KEY (`buffer_id`) REFERENCES `buffer` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Listage des données de la table ddws.coal_power_plant : ~0 rows (environ)
DELETE FROM `coal_power_plant`;
/*!40000 ALTER TABLE `coal_power_plant` DISABLE KEYS */;
INSERT INTO `coal_power_plant` (`id`, `buffer_percentage`, `running`, `buffer_id`) VALUES
	(1, 15, 0, 1);
/*!40000 ALTER TABLE `coal_power_plant` ENABLE KEYS */;

-- Listage de la structure de la table ddws. coal_production
CREATE TABLE IF NOT EXISTS `coal_production` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `coal_power_plant_id` int(11) NOT NULL,
  `production` float NOT NULL,
  `remaining_production` float NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_COAL_PRODUCTION_COAL_POWER_PLANT` (`coal_power_plant_id`),
  CONSTRAINT `FK_COAL_PRODUCTION_COAL_POWER_PLANT` FOREIGN KEY (`coal_power_plant_id`) REFERENCES `coal_power_plant` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Listage des données de la table ddws.coal_production : ~0 rows (environ)
DELETE FROM `coal_production`;
/*!40000 ALTER TABLE `coal_production` DISABLE KEYS */;
/*!40000 ALTER TABLE `coal_production` ENABLE KEYS */;

-- Listage de la structure de la table ddws. electricity_price
CREATE TABLE IF NOT EXISTS `electricity_price` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `price` float NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Listage des données de la table ddws.electricity_price : ~0 rows (environ)
DELETE FROM `electricity_price`;
/*!40000 ALTER TABLE `electricity_price` DISABLE KEYS */;
INSERT INTO `electricity_price` (`id`, `price`, `timestamp`) VALUES
	(1, 0.0001, '2021-12-12 13:37:05');
/*!40000 ALTER TABLE `electricity_price` ENABLE KEYS */;

-- Listage de la structure de la table ddws. global_coal_power_plant_production
CREATE TABLE IF NOT EXISTS `global_coal_power_plant_production` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `coal_power_plant_id` int(11) NOT NULL,
  `average_production` float NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_GLOBAL_COAL_POWER_PLANT_PRODUCTION_COAL_POWER_PLANT` (`coal_power_plant_id`),
  CONSTRAINT `FK_GLOBAL_COAL_POWER_PLANT_PRODUCTION_COAL_POWER_PLANT` FOREIGN KEY (`coal_power_plant_id`) REFERENCES `coal_power_plant` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Listage des données de la table ddws.global_coal_power_plant_production : ~0 rows (environ)
DELETE FROM `global_coal_power_plant_production`;
/*!40000 ALTER TABLE `global_coal_power_plant_production` DISABLE KEYS */;
/*!40000 ALTER TABLE `global_coal_power_plant_production` ENABLE KEYS */;

-- Listage de la structure de la table ddws. global_house_consumption
CREATE TABLE IF NOT EXISTS `global_house_consumption` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `house_id` int(11) NOT NULL,
  `average_consumption` float NOT NULL,
  `average_second` float NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_GLOBAL_HOUSE_CONSUMPTION_HOUSE` (`house_id`),
  CONSTRAINT `FK_GLOBAL_HOUSE_CONSUMPTION_HOUSE` FOREIGN KEY (`house_id`) REFERENCES `house` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Listage des données de la table ddws.global_house_consumption : ~0 rows (environ)
DELETE FROM `global_house_consumption`;
/*!40000 ALTER TABLE `global_house_consumption` DISABLE KEYS */;
/*!40000 ALTER TABLE `global_house_consumption` ENABLE KEYS */;

-- Listage de la structure de la table ddws. global_house_production
CREATE TABLE IF NOT EXISTS `global_house_production` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `house_id` int(11) NOT NULL,
  `average_production` float NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_GLOBAL_HOUSE_PRODUCTION_HOUSE` (`house_id`),
  CONSTRAINT `FK_GLOBAL_HOUSE_PRODUCTION_HOUSE` FOREIGN KEY (`house_id`) REFERENCES `house` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Listage des données de la table ddws.global_house_production : ~0 rows (environ)
DELETE FROM `global_house_production`;
/*!40000 ALTER TABLE `global_house_production` DISABLE KEYS */;
/*!40000 ALTER TABLE `global_house_production` ENABLE KEYS */;

-- Listage de la structure de la table ddws. global_wind
CREATE TABLE IF NOT EXISTS `global_wind` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `speed` float NOT NULL,
  `day` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Listage des données de la table ddws.global_wind : ~0 rows (environ)
DELETE FROM `global_wind`;
/*!40000 ALTER TABLE `global_wind` DISABLE KEYS */;
/*!40000 ALTER TABLE `global_wind` ENABLE KEYS */;

-- Listage de la structure de la table ddws. house
CREATE TABLE IF NOT EXISTS `house` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `to_buffer_percentage` float NOT NULL DEFAULT '0',
  `from_buffer_percentage` float NOT NULL DEFAULT '0',
  `buffer_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_HOUSE_BUFFER` (`buffer_id`),
  CONSTRAINT `FK_HOUSE_BUFFER` FOREIGN KEY (`buffer_id`) REFERENCES `buffer` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Listage des données de la table ddws.house : ~0 rows (environ)
DELETE FROM `house`;
/*!40000 ALTER TABLE `house` DISABLE KEYS */;
INSERT INTO `house` (`id`, `to_buffer_percentage`, `from_buffer_percentage`, `buffer_id`) VALUES
	(1, 10, 100, 2);
/*!40000 ALTER TABLE `house` ENABLE KEYS */;

-- Listage de la structure de la table ddws. house_consumption
CREATE TABLE IF NOT EXISTS `house_consumption` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `house_id` int(11) NOT NULL,
  `consumption` float NOT NULL,
  `remaining_consumption` float NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_HOUSE_CONSUMPTION_HOUSE` (`house_id`),
  CONSTRAINT `FK_HOUSE_CONSUMPTION_HOUSE` FOREIGN KEY (`house_id`) REFERENCES `house` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Listage des données de la table ddws.house_consumption : ~0 rows (environ)
DELETE FROM `house_consumption`;
/*!40000 ALTER TABLE `house_consumption` DISABLE KEYS */;
/*!40000 ALTER TABLE `house_consumption` ENABLE KEYS */;

-- Listage de la structure de la table ddws. house_need
CREATE TABLE IF NOT EXISTS `house_need` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `house_id` int(11) NOT NULL,
  `need` float NOT NULL,
  `blackout` int(11) NOT NULL DEFAULT '0',
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Listage des données de la table ddws.house_need : ~0 rows (environ)
DELETE FROM `house_need`;
/*!40000 ALTER TABLE `house_need` DISABLE KEYS */;
/*!40000 ALTER TABLE `house_need` ENABLE KEYS */;

-- Listage de la structure de la table ddws. house_production
CREATE TABLE IF NOT EXISTS `house_production` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `house_id` int(11) NOT NULL,
  `production` float NOT NULL,
  `remaining_production` float NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_HOUSE_PRODUCTION_HOUSE` (`house_id`),
  CONSTRAINT `FK_HOUSE_PRODUCTION_HOUSE` FOREIGN KEY (`house_id`) REFERENCES `house` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Listage des données de la table ddws.house_production : ~0 rows (environ)
DELETE FROM `house_production`;
/*!40000 ALTER TABLE `house_production` DISABLE KEYS */;
/*!40000 ALTER TABLE `house_production` ENABLE KEYS */;

-- Listage de la structure de la table ddws. market_transaction
CREATE TABLE IF NOT EXISTS `market_transaction` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `house_id` int(11) NOT NULL,
  `action` enum('Buy','Sell') NOT NULL,
  `amount` float NOT NULL,
  `price` float NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_MARKET_TRANSACTION_BUFFER` (`house_id`),
  CONSTRAINT `FK_MARKET_TRANSACTION_BUFFER` FOREIGN KEY (`house_id`) REFERENCES `house` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Listage des données de la table ddws.market_transaction : ~0 rows (environ)
DELETE FROM `market_transaction`;
/*!40000 ALTER TABLE `market_transaction` DISABLE KEYS */;
/*!40000 ALTER TABLE `market_transaction` ENABLE KEYS */;

-- Listage de la structure de la table ddws. modeled_electricity_price
CREATE TABLE IF NOT EXISTS `modeled_electricity_price` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `price` float NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Listage des données de la table ddws.modeled_electricity_price : ~0 rows (environ)
DELETE FROM `modeled_electricity_price`;
/*!40000 ALTER TABLE `modeled_electricity_price` DISABLE KEYS */;
/*!40000 ALTER TABLE `modeled_electricity_price` ENABLE KEYS */;

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

-- Listage de la structure de la table ddws. total_production_consumption
CREATE TABLE IF NOT EXISTS `total_production_consumption` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `production` float NOT NULL,
  `consumption` float NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Listage des données de la table ddws.total_production_consumption : ~0 rows (environ)
DELETE FROM `total_production_consumption`;
/*!40000 ALTER TABLE `total_production_consumption` DISABLE KEYS */;
/*!40000 ALTER TABLE `total_production_consumption` ENABLE KEYS */;

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
  `house_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- Listage des données de la table ddws.user : ~2 rows (environ)
DELETE FROM `user`;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` (`id`, `type`, `name`, `forename`, `address`, `additional_address`, `city`, `zip_code`, `email`, `password`, `photo`, `house_id`) VALUES
	(1, 'admin', 'admin', 'test', NULL, NULL, NULL, NULL, 'admin@gmail.com', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', NULL, NULL),
	(2, 'prosumer', 'prosumer', 'test', NULL, NULL, NULL, NULL, 'prosumer@gmail.com', '3f274cea580be0c9220288e3c14dfc62252ca813b2254879da8b090f2be0abe4', NULL, 1);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;

-- Listage de la structure de la table ddws. wind
CREATE TABLE IF NOT EXISTS `wind` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `speed` float NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Listage des données de la table ddws.wind : ~0 rows (environ)
DELETE FROM `wind`;
/*!40000 ALTER TABLE `wind` DISABLE KEYS */;
/*!40000 ALTER TABLE `wind` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
