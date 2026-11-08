import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDireccionEntregaDto {
    @IsString()
    @IsNotEmpty({ message: 'La dirección es obligatoria' })
    direccion: string;

    @IsBoolean()
    @IsOptional()
    principal?: boolean;
}

