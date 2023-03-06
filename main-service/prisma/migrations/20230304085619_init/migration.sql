-- CreateTable
CREATE TABLE `client` (
    `id` VARCHAR(36) NOT NULL,
    `nama` VARCHAR(60) NOT NULL,
    `perusahaan` VARCHAR(191) NULL,
    `alamat` VARCHAR(191) NULL,
    `nomor_hp` VARCHAR(15) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project` (
    `id` VARCHAR(36) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `client_id` VARCHAR(36) NULL,
    `jenis_layanan` VARCHAR(191) NOT NULL,
    `keterangan` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `project` ADD CONSTRAINT `project_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
