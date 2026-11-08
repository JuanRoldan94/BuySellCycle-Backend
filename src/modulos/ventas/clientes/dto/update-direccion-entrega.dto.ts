import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateDireccionEntregaDto {
    @IsString()
    @IsOptional()
    direccion?: string;

    @IsBoolean()
    @IsOptional()
    principal?: boolean;
}

