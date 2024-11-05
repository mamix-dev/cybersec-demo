CREATE DATABASE  IF NOT EXISTS `bank_database` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `bank_database`;
-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: bank_database
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `customer_info`
--

DROP TABLE IF EXISTS `customer_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_info` (
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `dollars` bigint(20) unsigned zerofill NOT NULL DEFAULT '00000000000000000000',
  `cents` tinyint(1) unsigned zerofill NOT NULL DEFAULT '0',
  `routing_num` int NOT NULL,
  PRIMARY KEY (`username`,`password`,`dollars`,`cents`,`routing_num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_info`
--

LOCK TABLES `customer_info` WRITE;
/*!40000 ALTER TABLE `customer_info` DISABLE KEYS */;
INSERT INTO `customer_info` VALUES ('brah','brap',00000000000000016681,3,896561709),('brop','frop',00000000000000000000,0,381036072),('broski','goarmy',00000000000000000000,0,185817021),('erp','erp',00000000000000000000,0,476791896),('george.patton','goarmy',00000000000000000000,0,941696119),('george.washington','america',00000000000000000010,0,470852385),('joe','joe',00000000000000013101,45,824485463);
/*!40000 ALTER TABLE `customer_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `forum_posts`
--

DROP TABLE IF EXISTS `forum_posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `forum_posts` (
  `username` varchar(255) NOT NULL,
  `content` longtext NOT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `forum_posts`
--

LOCK TABLES `forum_posts` WRITE;
/*!40000 ALTER TABLE `forum_posts` DISABLE KEYS */;
/*!40000 ALTER TABLE `forum_posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `help_pages`
--

DROP TABLE IF EXISTS `help_pages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `help_pages` (
  `title` varchar(255) NOT NULL DEFAULT 'Insert title',
  `content` longtext NOT NULL,
  PRIMARY KEY (`title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `help_pages`
--

LOCK TABLES `help_pages` WRITE;
/*!40000 ALTER TABLE `help_pages` DISABLE KEYS */;
INSERT INTO `help_pages` VALUES ('Account Overview','Learn how to navigate and understand your account summary including balances recent transactions and account history.'),('Applying for a Loan','Discover the different types of loans available including personal and auto loans and learn how to apply for each.'),('Contact Customer Support','If you need help hereâ€™s how to reach our support team by phone email or chat for any banking questions or issues.'),('Dispute a Transaction','Learn how to report and dispute transactions that may appear fraudulent or incorrect on your account.'),('Forgot Username or Password','If you\'re having trouble logging in follow these steps to recover your username or reset your password safely.'),('Fund Transfers','Get step-by-step instructions on transferring funds between your accounts or to other banks in a secure and timely manner.'),('Setting Up Alerts','Customize account alerts for low balances large transactions or other activities to stay up-to-date with your finances.'),('Setting Up Direct Deposit','Find out how to set up direct deposit so your paycheck goes directly into your bank account without any added steps.'),('Understanding Fees','Find out about fees associated with various transactions overdrafts and monthly account maintenance.'),('Updating Personal Information','Learn how to update your personal details including address phone number and email to keep your account secure.');
/*!40000 ALTER TABLE `help_pages` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-04 19:51:05
