import { IsString, IsNotEmpty } from 'class-validator';

export class CreateBancoDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre del banco es obligatorio'})
    nombre: string;
}
