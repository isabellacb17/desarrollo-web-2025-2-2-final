import { IsBoolean, IsInt, IsNotEmpty, IsString, Max, Min, Validate, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'finalScoreMin', async: false })
export class FinalScoreConstraint implements ValidatorConstraintInterface {
  validate(score: number, args: ValidationArguments) {
    const object = args.object as CreatePuzzleScoreDto;
    if (object.isFinal && score < 70) {
      return false;
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'La puntuación final debe ser de al menos 70';
  }
}

export class CreatePuzzleScoreDto {
  @IsString()
  @IsNotEmpty()
  sessionId!: string;

  @IsInt()
  @Min(1)
  attempt!: number;

  @IsInt()
  @Min(0)
  @Max(100)
  score!: number;

  @IsBoolean()
  isFinal!: boolean;

  @Validate(FinalScoreConstraint)
  finalScoreValidation!: number;
}
