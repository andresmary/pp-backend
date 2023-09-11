import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class Votes {
  @IsNumber() vote: number;
  @IsString() userId: string;
}
export class CreateTablesDto {
  @IsString()
  @MaxLength(20)
  @IsNotEmpty()
  @ApiProperty()
  readonly table: string;

  @IsArray()
  @ApiProperty()
  @ValidateNested({ each: true })
  votes: Votes[];
}
