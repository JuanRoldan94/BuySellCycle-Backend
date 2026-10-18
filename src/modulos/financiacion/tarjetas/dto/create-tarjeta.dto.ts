import { IsString, IsNotEmpty } from "class-validator";

export class CreateTarjetaDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre de la tarjeta es obligatorio'})
    nombre: string;
}
