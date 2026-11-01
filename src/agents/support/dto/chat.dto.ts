import { IsString, MaxLength, MinLength } from 'class-validator';

export class ChatDto {
  @IsString()
  @MinLength(3)
  @MaxLength(2000)
  message: string;
}
