import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class UpdateAdminDto {
  
    @IsEmail()
    email?: string;


    @IsNotEmpty()
    @MinLength(6)
    password: string;
}
