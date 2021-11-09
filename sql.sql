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

-- Listage des données de la table ddws.daily_wind : ~0 rows (environ)
DELETE FROM `daily_wind`;
/*!40000 ALTER TABLE `daily_wind` DISABLE KEYS */;
/*!40000 ALTER TABLE `daily_wind` ENABLE KEYS */;

-- Listage des données de la table ddws.electricity_consumption : ~0 rows (environ)
DELETE FROM `electricity_consumption`;
/*!40000 ALTER TABLE `electricity_consumption` DISABLE KEYS */;
/*!40000 ALTER TABLE `electricity_consumption` ENABLE KEYS */;

-- Listage des données de la table ddws.house : ~0 rows (environ)
DELETE FROM `house`;
/*!40000 ALTER TABLE `house` DISABLE KEYS */;
INSERT INTO `house` (`id`, `prosumer_id`) VALUES
	(1, 1);
/*!40000 ALTER TABLE `house` ENABLE KEYS */;

-- Listage des données de la table ddws.prosumer : ~0 rows (environ)
DELETE FROM `prosumer`;
/*!40000 ALTER TABLE `prosumer` DISABLE KEYS */;
INSERT INTO `prosumer` (`id`) VALUES
	(1);
/*!40000 ALTER TABLE `prosumer` ENABLE KEYS */;

-- Listage des données de la table ddws.realtime_wind : ~0 rows (environ)
DELETE FROM `realtime_wind`;
/*!40000 ALTER TABLE `realtime_wind` DISABLE KEYS */;
/*!40000 ALTER TABLE `realtime_wind` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
