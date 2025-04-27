import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class UpdateAdminDto {
  
    @IsNotEmpty()
    @IsEmail()
    email?: string;


    @IsNotEmpty()
    @MinLength(6)
    password: string;
}
