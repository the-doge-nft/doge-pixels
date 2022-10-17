import {
  IsDate,
  IsDefined,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
  ValidateNested,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Type } from 'class-transformer';

@ValidatorConstraint({ name: 'string-or-number', async: false })
class IsNumberOrString implements ValidatorConstraintInterface {
  validate(text: any, args: ValidationArguments) {
    return typeof text === 'string' || typeof text === 'number';
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return '($value) must be a number or string';
  }
}

const sortDirections = ['asc', 'desc'];

class Filter {
  @IsOptional()
  @IsString()
  from: string;

  @IsOptional()
  @IsString()
  to: string;

  @IsOptional()
  @IsNumber()
  tokenId: number;

  @IsOptional()
  @IsNumber()
  fromBlockNumber: number;

  @IsOptional()
  @IsNumber()
  toBlockNumber: number;
}

class Sort {
  @IsOptional()
  @IsIn(sortDirections)
  from: string;

  @IsOptional()
  @IsIn(sortDirections)
  to: string;

  @IsOptional()
  @IsIn(sortDirections)
  tokenId: string;

  @IsOptional()
  @IsIn(sortDirections)
  blockNumber: string;
}

export class PostTransfersDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => Filter)
  filter: Filter;

  @IsOptional()
  @ValidateNested()
  @Type(() => Sort)
  sort: Sort;
}
