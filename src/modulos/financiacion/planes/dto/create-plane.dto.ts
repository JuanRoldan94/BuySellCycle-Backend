import { IsInt, IsNumber, Min, IsOptional, IsString } from "class-validator";

export class CreatePlaneDto {
    @IsInt() 
    @Min(1)
    cantidadCuotas: number;

    @IsNumber()
    @Min(0)
    tasaFinanciacion: number;

    @IsInt()
    tarjetaId: number;

    @IsInt()
    bancoId: number;

    @IsOptional()
    @IsString()
    observaciones?: string;
}
