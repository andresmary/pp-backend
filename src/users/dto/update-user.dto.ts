import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UserId {
  @IsString()
  @MaxLength(24)
  @IsNotEmpty()
  @ApiProperty()
  userId: string;
}
