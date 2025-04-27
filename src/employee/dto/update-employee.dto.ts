import { IsEmail, IsNotEmpty } from "class-validator";

export class UpdateEmployeeDto {

        @IsNotEmpty()
        name: string;
    
        @IsNotEmpty()
        @IsEmail()
        email: string;
    
        @IsNotEmpty()
        department: string
  }
  