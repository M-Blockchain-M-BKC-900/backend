import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { NftService } from './nft.service';
import CreateNftDto from './dto/create-nft.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('nft')
export class NftController {
  constructor(private readonly nftService: NftService) {}

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  create(@Headers() headers: any, @Body() createNftDto: CreateNftDto) {
    const token = headers.authorization?.split(' ')[1];
    return this.nftService.create(createNftDto, token);
  }

  @Get(':id')
  findAll(@Param('id') seed: string) {
    return this.nftService.findAll(seed);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nftService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nftService.remove(+id);
  }
}
