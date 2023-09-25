import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  Validate,
  ValidateNested,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

@ValidatorConstraint({ name: 'customText', async: false })
export class CustomNumberLength implements ValidatorConstraintInterface {
  validate(value: number): boolean {
    return value < 13;
  }
}

class Votes {
  // @Type(() => Number)
  // @IsNumber()
  // @Max(3)
  // @Min(2)
  // @IsInt()
  // @Min(0)
  // @Max(10)
  @Validate(CustomNumberLength, {
    message: 'Title is too short or long!',
  })
  vote: number;
  @IsString() userId: string;
  @IsString() userName: string;
}
export class CreateTablesDto {
  @IsString()
  @MaxLength(20)
  @IsNotEmpty()
  @ApiProperty()
  readonly table: string;

  @IsArray()
  @ApiProperty()
  @IsOptional()
  @ValidateNested({ each: true })
  votes: Votes[];
}
