import { IsString, IsNotEmpty, IsEnum } from "class-validator";
import { TipoTarjeta } from "@prisma/client";

export class CreateTarjetaDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre de la tarjeta es obligatorio'})
    nombre: string;

    @IsEnum(TipoTarjeta)
    @IsNotEmpty({ message: 'El tipo de tarjeta es obligatorio' })
    tipo: TipoTarjeta;
}