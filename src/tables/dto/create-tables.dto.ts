import {
  IsArray,
  IsNotEmpty,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class CreateTablesDto {
  @IsString()
  @MaxLength(20)
  @IsNotEmpty()
  readonly table: string;

  @IsArray()
  @ValidateNested({ each: true })
  votes: Array<{
    vote: number;
    userId: string;
  }>;
}
