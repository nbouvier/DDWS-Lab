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

-- Listage de la structure de la table ddws. daily_wind
DROP TABLE IF EXISTS `daily_wind`;
CREATE TABLE IF NOT EXISTS `daily_wind` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `speed` float NOT NULL,
  `day` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Listage des données de la table ddws.daily_wind : ~0 rows (environ)
DELETE FROM `daily_wind`;
/*!40000 ALTER TABLE `daily_wind` DISABLE KEYS */;
/*!40000 ALTER TABLE `daily_wind` ENABLE KEYS */;

-- Listage de la structure de la table ddws. electricity_consumption
DROP TABLE IF EXISTS `electricity_consumption`;
CREATE TABLE IF NOT EXISTS `electricity_consumption` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `house_id` int(11) NOT NULL,
  `consumption` float NOT NULL,
  `timestamps` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_ELECTRICITY_CONSUMPTION_HOUSE` (`house_id`),
  CONSTRAINT `FK_ELECTRICITY_CONSUMPTION_HOUSE` FOREIGN KEY (`house_id`) REFERENCES `house` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Listage des données de la table ddws.electricity_consumption : ~0 rows (environ)
DELETE FROM `electricity_consumption`;
/*!40000 ALTER TABLE `electricity_consumption` DISABLE KEYS */;
/*!40000 ALTER TABLE `electricity_consumption` ENABLE KEYS */;

-- Listage de la structure de la table ddws. house
DROP TABLE IF EXISTS `house`;
CREATE TABLE IF NOT EXISTS `house` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `prosumer_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_HOUSE_PROSUMER` (`prosumer_id`),
  CONSTRAINT `FK_HOUSE_PROSUMER` FOREIGN KEY (`prosumer_id`) REFERENCES `prosumer` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Listage des données de la table ddws.house : ~1 rows (environ)
DELETE FROM `house`;
/*!40000 ALTER TABLE `house` DISABLE KEYS */;
INSERT INTO `house` (`id`, `prosumer_id`) VALUES
	(1, 1);
/*!40000 ALTER TABLE `house` ENABLE KEYS */;

-- Listage de la structure de la table ddws. prosumer
DROP TABLE IF EXISTS `prosumer`;
CREATE TABLE IF NOT EXISTS `prosumer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Listage des données de la table ddws.prosumer : ~1 rows (environ)
DELETE FROM `prosumer`;
/*!40000 ALTER TABLE `prosumer` DISABLE KEYS */;
INSERT INTO `prosumer` (`id`) VALUES
	(1);
/*!40000 ALTER TABLE `prosumer` ENABLE KEYS */;

-- Listage de la structure de la table ddws. realtime_wind
DROP TABLE IF EXISTS `realtime_wind`;
CREATE TABLE IF NOT EXISTS `realtime_wind` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `speed` float NOT NULL,
  `timestamps` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Listage des données de la table ddws.realtime_wind : ~0 rows (environ)
DELETE FROM `realtime_wind`;
/*!40000 ALTER TABLE `realtime_wind` DISABLE KEYS */;
/*!40000 ALTER TABLE `realtime_wind` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
