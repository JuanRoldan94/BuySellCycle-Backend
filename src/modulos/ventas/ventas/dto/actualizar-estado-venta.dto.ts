import { IsEnum } from "class-validator";
import { EstadoVenta } from "@prisma/client";

export class ActualizarEstadoVentaDto {
    @IsEnum(EstadoVenta, {
        message: 'El estado debe ser valido (EN_PREPARACION, DISPONIBLE_PARA_RETIRAR, EN_CAMINI, ENTREGADO O CANCELADO)'
    })
    estado: EstadoVenta;
}