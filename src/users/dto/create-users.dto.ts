import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUsersDto {
  @IsString()
  @MaxLength(20)
  @IsNotEmpty()
  readonly name: string;
}
