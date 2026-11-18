import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
//Datos que se envían para iniciar sesión
export class CreateAuthDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}
