import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateErrorDto {
  @IsString()
  @IsOptional()
  tipoSistema?: string;

  @IsString()
  @IsNotEmpty()
  ruta: string;

  @IsString()
  @IsOptional()
  metodo?: string;

  @IsNumber()
  @IsOptional()
  codigoEstado?: number;

  @IsString()
  @IsNotEmpty()
  detalle: string;

  @IsString()
  @IsOptional()
  timestamp?: string;
}

