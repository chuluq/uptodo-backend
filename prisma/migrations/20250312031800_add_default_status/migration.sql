-- AlterTable
ALTER TABLE `tasks` MODIFY `status` ENUM('Not Started', 'On Progress', 'Done') NOT NULL DEFAULT 'Not Started';
