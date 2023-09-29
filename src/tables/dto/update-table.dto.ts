import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class ChangeUser {
  @IsString()
  @MaxLength(24)
  @IsNotEmpty()
  @ApiProperty()
  tableId: string;

  @IsString()
  @MaxLength(24)
  @IsNotEmpty()
  @ApiProperty()
  userId: string;
}

export class TableId {
  @IsString()
  @MaxLength(24)
  @IsNotEmpty()
  @ApiProperty()
  tableId: string;
}

export class ChangeVote {
  @IsString()
  @MaxLength(24)
  @IsNotEmpty()
  @ApiProperty()
  tableId: string;

  @IsString()
  @MaxLength(24)
  @IsNotEmpty()
  @ApiProperty()
  userId: string;

  @IsPositive()
  @IsNumber()
  @Min(1)
  @Max(13)
  @IsNotEmpty()
  @ApiProperty()
  value: number;
}
