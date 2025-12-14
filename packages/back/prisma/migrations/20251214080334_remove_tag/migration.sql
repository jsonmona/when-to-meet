/*
  Warnings:

  - The primary key for the `appointment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `nonce` on the `appointment` table. The data in that column could be lost. The data in that column will be cast from `UnsignedTinyInt` to `SmallInt`.
  - The primary key for the `participant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `participantmark` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `tag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `tagsonappointments` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nameSearch` to the `Tag` table without a default value. This is not possible if the table is not empty.
    - Truncating the `Tag` table to resolve this issue.

*/
-- DropForeignKey
ALTER TABLE `participant` DROP FOREIGN KEY `Participant_appointmentId_fkey`;

-- DropForeignKey
ALTER TABLE `participantmark` DROP FOREIGN KEY `ParticipantMark_participantId_fkey`;

-- DropForeignKey
ALTER TABLE `participantmark` DROP FOREIGN KEY `ParticipantMark_tagId_fkey`;

-- DropForeignKey
ALTER TABLE `tagsonappointments` DROP FOREIGN KEY `TagsOnAppointments_appointmentId_fkey`;

-- DropForeignKey
ALTER TABLE `tagsonappointments` DROP FOREIGN KEY `TagsOnAppointments_tagId_fkey`;

-- DropIndex
DROP INDEX `Participant_appointmentId_fkey` ON `participant`;

-- DropIndex
DROP INDEX `ParticipantMark_tagId_fkey` ON `participantmark`;

-- AlterTable
ALTER TABLE `appointment` DROP PRIMARY KEY,
    MODIFY `id` BIGINT NOT NULL AUTO_INCREMENT,
    MODIFY `nonce` SMALLINT NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `participant` DROP PRIMARY KEY,
    MODIFY `id` BIGINT NOT NULL AUTO_INCREMENT,
    MODIFY `appointmentId` BIGINT NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `participantmark` DROP PRIMARY KEY,
    MODIFY `participantId` BIGINT NOT NULL,
    MODIFY `tagId` BIGINT NOT NULL,
    ADD PRIMARY KEY (`participantId`, `tagId`, `calendarDate`);

-- TruncateTable
DELETE FROM `tag`;

-- AlterTable
ALTER TABLE `tag` DROP PRIMARY KEY,
    ADD COLUMN `nameSearch` VARCHAR(90) NOT NULL,
    MODIFY `id` BIGINT NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `tagsonappointments`;

-- CreateTable
CREATE TABLE `DefaultTag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tagId` BIGINT NOT NULL,

    UNIQUE INDEX `DefaultTag_tagId_key`(`tagId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_AppointmentToTag` (
    `A` BIGINT NOT NULL,
    `B` BIGINT NOT NULL,

    UNIQUE INDEX `_AppointmentToTag_AB_unique`(`A`, `B`),
    INDEX `_AppointmentToTag_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Tag_name_key` ON `Tag`(`name`);

-- AddForeignKey
ALTER TABLE `DefaultTag` ADD CONSTRAINT `DefaultTag_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `Tag`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Participant` ADD CONSTRAINT `Participant_appointmentId_fkey` FOREIGN KEY (`appointmentId`) REFERENCES `Appointment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ParticipantMark` ADD CONSTRAINT `ParticipantMark_participantId_fkey` FOREIGN KEY (`participantId`) REFERENCES `Participant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ParticipantMark` ADD CONSTRAINT `ParticipantMark_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `Tag`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AppointmentToTag` ADD CONSTRAINT `_AppointmentToTag_A_fkey` FOREIGN KEY (`A`) REFERENCES `Appointment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AppointmentToTag` ADD CONSTRAINT `_AppointmentToTag_B_fkey` FOREIGN KEY (`B`) REFERENCES `Tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
