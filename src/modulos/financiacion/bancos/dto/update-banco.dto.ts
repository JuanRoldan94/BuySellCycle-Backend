import { PartialType } from '@nestjs/mapped-types';
import { CreateBancoDto } from './create-banco.dto.js';

export class UpdateBancoDto extends PartialType(CreateBancoDto) {}
