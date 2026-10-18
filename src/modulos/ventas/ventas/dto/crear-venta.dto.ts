import { Type } from "class-transformer";
import { IsInt, IsEnum, IsArray, ValidateNested, IsOptional, Min, IsString } from "class-validator";
import { ModoPago, ModoEntrega } from "@prisma/client";

export class DetalleVentaDto {
    @IsInt()
    @Min(1)
    productoId: number;

    @IsInt()
    @Min(1)
    cantidad: number;
}

export class CrearVentaDto {
    @IsInt() clienteId: number;
    @IsInt() sucursalId: number;
    @IsInt() planId: number;

    @IsEnum(ModoPago) modoPago: ModoPago;
    @IsEnum(ModoEntrega) modoEntrega: ModoEntrega;

    @IsOptional()
    @IsString()
    direccionEntregaTexto?: string;

    @IsArray()
    @ValidateNested( { each: true })
    @Type(() => DetalleVentaDto)
    detalles: DetalleVentaDto[]
}