-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema life_coach
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema life_coach
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `life_coach` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `life_coach` ;

-- -----------------------------------------------------
-- Table `life_coach`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `life_coach`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 18
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `life_coach`.`chatbotsessions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `life_coach`.`chatbotsessions` (
  `sessionID` INT NOT NULL,
  `id` INT NULL,
  `start_time` DATETIME NULL,
  `end_time` DATETIME NULL,
  `users_id` INT NOT NULL,
  PRIMARY KEY (`sessionID`, `users_id`),
  INDEX `fk_chatbotsessions_users_idx` (`users_id` ASC) VISIBLE,
  CONSTRAINT `fk_chatbotsessions_users`
    FOREIGN KEY (`users_id`)
    REFERENCES `life_coach`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `life_coach`.`message`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `life_coach`.`message` (
  `messageid` INT NOT NULL,
  `sessionID` INT NULL,
  `sender` VARCHAR(45) NULL,
  `timestamp` DATETIME NULL,
  `chatbotsessions_sessionID` INT NOT NULL,
  `chatbotsessions_users_id` INT NOT NULL,
  PRIMARY KEY (`messageid`, `chatbotsessions_sessionID`, `chatbotsessions_users_id`),
  INDEX `fk_message_chatbotsessions1_idx` (`chatbotsessions_sessionID` ASC, `chatbotsessions_users_id` ASC) VISIBLE,
  CONSTRAINT `fk_message_chatbotsessions1`
    FOREIGN KEY (`chatbotsessions_sessionID` , `chatbotsessions_users_id`)
    REFERENCES `life_coach`.`chatbotsessions` (`sessionID` , `users_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `life_coach`.`testimonials`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `life_coach`.`testimonials` (
  `tID` INT NOT NULL,
  `id` INT NOT NULL,
  `content` VARCHAR(45) NOT NULL,
  `users_id` INT NOT NULL,
  PRIMARY KEY (`tID`, `users_id`),
  INDEX `fk_testimonials_users1_idx` (`users_id` ASC) VISIBLE,
  CONSTRAINT `fk_testimonials_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `life_coach`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
