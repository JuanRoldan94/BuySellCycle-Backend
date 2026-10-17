/*
  Warnings:

  - You are about to drop the column `fecha_actualizacion` on the `categorianivel1` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_creacion` on the `categorianivel1` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_actualizacion` on the `categorianivel2` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_creacion` on the `categorianivel2` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_actualizacion` on the `cliente` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_creacion` on the `cliente` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_actualizacion` on the `deposito` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_creacion` on the `deposito` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_actualizacion` on the `localidad` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_creacion` on the `localidad` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_actualizacion` on the `marca` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_creacion` on the `marca` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_actualizacion` on the `producto` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_creacion` on the `producto` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_actualizacion` on the `proveedor` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_creacion` on the `proveedor` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_actualizacion` on the `provincia` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_creacion` on the `provincia` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_actualizacion` on the `stockproductodeposito` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_creacion` on the `stockproductodeposito` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_actualizacion` on the `sucursal` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_creacion` on the `sucursal` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_actualizacion` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_creacion` on the `usuario` table. All the data in the column will be lost.
  - Added the required column `fechaActualizacion` to the `CategoriaNivel1` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaActualizacion` to the `CategoriaNivel2` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaActualizacion` to the `Cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaActualizacion` to the `Deposito` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaActualizacion` to the `Localidad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaActualizacion` to the `Marca` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaActualizacion` to the `Producto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaActualizacion` to the `Proveedor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaActualizacion` to the `Provincia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaActualizacion` to the `StockProductoDeposito` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaActualizacion` to the `Sucursal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaActualizacion` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `categorianivel1` DROP COLUMN `fecha_actualizacion`,
    DROP COLUMN `fecha_creacion`,
    ADD COLUMN `fechaActualizacion` DATETIME(3) NOT NULL,
    ADD COLUMN `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `categorianivel2` DROP COLUMN `fecha_actualizacion`,
    DROP COLUMN `fecha_creacion`,
    ADD COLUMN `fechaActualizacion` DATETIME(3) NOT NULL,
    ADD COLUMN `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `cliente` DROP COLUMN `fecha_actualizacion`,
    DROP COLUMN `fecha_creacion`,
    ADD COLUMN `fechaActualizacion` DATETIME(3) NOT NULL,
    ADD COLUMN `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `deposito` DROP COLUMN `fecha_actualizacion`,
    DROP COLUMN `fecha_creacion`,
    ADD COLUMN `fechaActualizacion` DATETIME(3) NOT NULL,
    ADD COLUMN `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `localidad` DROP COLUMN `fecha_actualizacion`,
    DROP COLUMN `fecha_creacion`,
    ADD COLUMN `fechaActualizacion` DATETIME(3) NOT NULL,
    ADD COLUMN `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `marca` DROP COLUMN `fecha_actualizacion`,
    DROP COLUMN `fecha_creacion`,
    ADD COLUMN `fechaActualizacion` DATETIME(3) NOT NULL,
    ADD COLUMN `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `producto` DROP COLUMN `fecha_actualizacion`,
    DROP COLUMN `fecha_creacion`,
    ADD COLUMN `fechaActualizacion` DATETIME(3) NOT NULL,
    ADD COLUMN `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `proveedor` DROP COLUMN `fecha_actualizacion`,
    DROP COLUMN `fecha_creacion`,
    ADD COLUMN `fechaActualizacion` DATETIME(3) NOT NULL,
    ADD COLUMN `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `provincia` DROP COLUMN `fecha_actualizacion`,
    DROP COLUMN `fecha_creacion`,
    ADD COLUMN `fechaActualizacion` DATETIME(3) NOT NULL,
    ADD COLUMN `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `stockproductodeposito` DROP COLUMN `fecha_actualizacion`,
    DROP COLUMN `fecha_creacion`,
    ADD COLUMN `fechaActualizacion` DATETIME(3) NOT NULL,
    ADD COLUMN `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `sucursal` DROP COLUMN `fecha_actualizacion`,
    DROP COLUMN `fecha_creacion`,
    ADD COLUMN `fechaActualizacion` DATETIME(3) NOT NULL,
    ADD COLUMN `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `usuario` DROP COLUMN `fecha_actualizacion`,
    DROP COLUMN `fecha_creacion`,
    ADD COLUMN `fechaActualizacion` DATETIME(3) NOT NULL,
    ADD COLUMN `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `DireccionEntrega` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `direccion` VARCHAR(191) NOT NULL,
    `principal` BOOLEAN NOT NULL DEFAULT false,
    `clienteId` INTEGER NOT NULL,
    `archivado` BOOLEAN NOT NULL DEFAULT false,
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fechaActualizacion` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tarjeta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `tipo` ENUM('CREDITO', 'DEBITO') NOT NULL,
    `rutaImagenStorage` VARCHAR(191) NULL,
    `archivado` BOOLEAN NOT NULL DEFAULT false,
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fechaActualizacion` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Banco` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `archivado` BOOLEAN NOT NULL DEFAULT false,
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fechaActualizacion` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Plan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cantidadCuotas` INTEGER NOT NULL,
    `tasaFinanciacion` DECIMAL(5, 2) NOT NULL,
    `observaciones` TEXT NULL,
    `tarjetaId` INTEGER NOT NULL,
    `bancoId` INTEGER NOT NULL,
    `archivado` BOOLEAN NOT NULL DEFAULT false,
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fechaActualizacion` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Plan_tarjetaId_bancoId_cantidadCuotas_key`(`tarjetaId`, `bancoId`, `cantidadCuotas`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Venta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `modoPago` ENUM('CONTADO', 'PLAN') NOT NULL,
    `modoEntrega` ENUM('RETIRO_SUCURSAL', 'ENTREGA_DOMICILIO') NOT NULL,
    `estado` ENUM('EN_PREPARACION', 'DISPONIBLE_PARA_RETIRAR', 'EN_CAMINO', 'ENTREGADO', 'CANCELADO') NOT NULL DEFAULT 'EN_PREPARACION',
    `motivoCancelacion` TEXT NULL,
    `direccionEntregaTexto` TEXT NULL,
    `montoTotal` DECIMAL(12, 2) NOT NULL,
    `clienteId` INTEGER NOT NULL,
    `sucursalId` INTEGER NOT NULL,
    `planId` INTEGER NOT NULL,
    `archivado` BOOLEAN NOT NULL DEFAULT false,
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fechaActualizacion` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DetalleVenta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cantidad` INTEGER NOT NULL,
    `precioUnitario` DECIMAL(10, 2) NOT NULL,
    `subtotal` DECIMAL(12, 2) NOT NULL,
    `ventaId` INTEGER NOT NULL,
    `productoId` INTEGER NOT NULL,
    `archivado` BOOLEAN NOT NULL DEFAULT false,
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fechaActualizacion` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DireccionEntrega` ADD CONSTRAINT `DireccionEntrega_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `Cliente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Plan` ADD CONSTRAINT `Plan_tarjetaId_fkey` FOREIGN KEY (`tarjetaId`) REFERENCES `Tarjeta`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Plan` ADD CONSTRAINT `Plan_bancoId_fkey` FOREIGN KEY (`bancoId`) REFERENCES `Banco`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Venta` ADD CONSTRAINT `Venta_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `Cliente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Venta` ADD CONSTRAINT `Venta_sucursalId_fkey` FOREIGN KEY (`sucursalId`) REFERENCES `Sucursal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Venta` ADD CONSTRAINT `Venta_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `Plan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetalleVenta` ADD CONSTRAINT `DetalleVenta_ventaId_fkey` FOREIGN KEY (`ventaId`) REFERENCES `Venta`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetalleVenta` ADD CONSTRAINT `DetalleVenta_productoId_fkey` FOREIGN KEY (`productoId`) REFERENCES `Producto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
