-- CreateTable
CREATE TABLE `user` (
    `id` VARCHAR(36) NOT NULL,
    `nama_lengkap` VARCHAR(60) NOT NULL,
    `username` VARCHAR(30) NOT NULL,
    `password` VARCHAR(72) NOT NULL,
    `nomor_hp` VARCHAR(15) NOT NULL,
    `divisi` VARCHAR(191) NOT NULL,
    `role_id` INTEGER NULL,
    `refresh_token` VARCHAR(400) NULL,

    UNIQUE INDEX `user_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role` (
    `id` INTEGER NOT NULL,
    `nama` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `role_nama_key`(`nama`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
