/*
  Warnings:

  - You are about to drop the column `createdAt` on the `tag` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `tag` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `appointment` ADD COLUMN `createdBy` BIGINT NULL,
    ADD COLUMN `updatedBy` BIGINT NULL;

-- AlterTable
ALTER TABLE `tag` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`;

-- CreateTable
CREATE TABLE `user` (
    `userId` BIGINT NOT NULL AUTO_INCREMENT,
    `privilege` SMALLINT NOT NULL,

    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `login_provider_code` (
    `userId` BIGINT NOT NULL,
    `code` BIGINT NOT NULL,

    UNIQUE INDEX `login_provider_code_code_key`(`code`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `appointment` ADD CONSTRAINT `appointment_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `user`(`userId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `appointment` ADD CONSTRAINT `appointment_updatedBy_fkey` FOREIGN KEY (`updatedBy`) REFERENCES `user`(`userId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `login_provider_code` ADD CONSTRAINT `login_provider_code_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;
