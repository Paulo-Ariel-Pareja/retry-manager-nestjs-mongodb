import { IsInt, IsObject, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  to: string;

  @IsString()
  method: string;

  @IsObject()
  headers: object;

  @IsInt()
  frequency: number;

  @IsObject()
  data: object;

  created_at: string;

  updated_at: string;
}
