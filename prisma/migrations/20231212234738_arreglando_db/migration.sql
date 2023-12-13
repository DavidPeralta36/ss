/*
  Warnings:

  - You are about to drop the column `end_date` on the `surveys` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `surveys` table. All the data in the column will be lost.
  - Made the column `password` on table `usrs` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `answers` DROP FOREIGN KEY `answers_survey_id_fk`;

-- DropForeignKey
ALTER TABLE `survey_responses` DROP FOREIGN KEY `survey_responses_ibfk_2`;

-- AlterTable
ALTER TABLE `surveys` DROP COLUMN `end_date`,
    DROP COLUMN `start_date`;

-- AlterTable
ALTER TABLE `usrs` ADD COLUMN `img` VARCHAR(255) NULL,
    ADD COLUMN `nivelAcceso` VARCHAR(255) NULL,
    ADD COLUMN `puesto` VARCHAR(255) NULL,
    MODIFY `password` VARCHAR(100) NOT NULL;

-- AddForeignKey
ALTER TABLE `answers` ADD CONSTRAINT `answers_survey_id_fk` FOREIGN KEY (`survey_id`) REFERENCES `surveys`(`survey_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `survey_responses` ADD CONSTRAINT `survey_responses_ibfk_2` FOREIGN KEY (`survey_id`) REFERENCES `surveys`(`survey_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
