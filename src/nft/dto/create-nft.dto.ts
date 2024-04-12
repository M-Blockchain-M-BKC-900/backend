import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from '@nestjs/class-validator';

export default class CreateNftDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  text: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  picture: string;
}
