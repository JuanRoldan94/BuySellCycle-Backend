import { PartialType } from '@nestjs/mapped-types';
import { CreateTarjetaDto } from './create-tarjeta.dto.js';

export class UpdateTarjetaDto extends PartialType(CreateTarjetaDto) {}
