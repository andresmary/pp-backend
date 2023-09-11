import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUsersDto {
  @IsString()
  @MaxLength(20)
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;
}
