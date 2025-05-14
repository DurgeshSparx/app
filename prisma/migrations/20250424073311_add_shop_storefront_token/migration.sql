/*
  Warnings:

  - You are about to drop the `shop_Storefront_Token` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `shop_Storefront_Token`;

-- CreateTable
CREATE TABLE `Shop_Storefront_Token` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `shop` VARCHAR(191) NOT NULL,
    `storefrontAccessToken` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Shop_Storefront_Token_shop_key`(`shop`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
