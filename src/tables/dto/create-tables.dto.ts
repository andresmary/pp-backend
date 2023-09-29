import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTablesDto {
  @IsString()
  @MaxLength(20)
  @IsNotEmpty()
  @ApiProperty()
  readonly table: string;
}
