import { IsNumber, IsInt, Min, IsPositive } from "class-validator";

export class SimularFinanciacionDto {
    @IsNumber()
    @Min(1, { message: 'El monto a financiar debe ser mayor a 0' })
    montoBase: number;

    @IsInt()
    @IsPositive ({ message: 'El ID del plan es obligatorio' })
    planId: number;
}