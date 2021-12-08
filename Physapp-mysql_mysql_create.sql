CREATE TABLE `admins` (
	`id` int NOT NULL AUTO_INCREMENT UNIQUE,
	`username` varchar(255) NOT NULL UNIQUE,
	`password` varchar(100) NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE `clients` (
	`id` int NOT NULL AUTO_INCREMENT UNIQUE,
	`username` varchar(255) NOT NULL UNIQUE,
	`password` varchar(100) NOT NULL,
	`name` varchar(255) NOT NULL,
	`surname` varchar(255) NOT NULL,
	`note_start` mediumtext,
	`note_end` mediumtext,
	`register_date` DATETIME NOT NULL DEFAULT NOW(),
	`lastlogin` DATETIME NOT NULL DEFAULT NOW(),
	`sickness` TEXT,
	`disabled` bool NOT NULL DEFAULT FALSE,
	PRIMARY KEY (`id`)
);

CREATE TABLE `user_exercises` (
	`id` int NOT NULL AUTO_INCREMENT UNIQUE,
	`client` int NOT NULL,
	`exercise` int NOT NULL,
	`done` bool NOT NULL DEFAULT FALSE,
	`assign_time` DATETIME NOT NULL DEFAULT NOW(),
	`expiration_time` DATETIME NOT NULL,
	`disabled` bool NOT NULL DEFAULT FALSE,
	PRIMARY KEY (`id`)
);

CREATE TABLE `exercises` (
	`id` int NOT NULL AUTO_INCREMENT UNIQUE,
	`video` int NOT NULL,
	`description` TEXT,
	PRIMARY KEY (`id`)
);

CREATE TABLE `videos` (
	`id` int NOT NULL AUTO_INCREMENT,
	`name` varchar(255) NOT NULL,
	PRIMARY KEY (`id`)
);

ALTER TABLE `user_exercises` ADD CONSTRAINT `user_exercises_fk0` FOREIGN KEY (`client`) REFERENCES `clients`(`id`);

ALTER TABLE `user_exercises` ADD CONSTRAINT `user_exercises_fk1` FOREIGN KEY (`exercise`) REFERENCES `exercises`(`id`);

ALTER TABLE `exercises` ADD CONSTRAINT `exercises_fk0` FOREIGN KEY (`video`) REFERENCES `videos`(`id`);






