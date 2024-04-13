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
  @Get('marketplace')
  marketplace() {
    return this.nftService.marketplace();
  }

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('create')
  create(@Headers() headers: any, @Body() createNftDto: CreateNftDto) {
    const token = headers.authorization?.split(' ')[1];
    return this.nftService.create(createNftDto, token);
  }

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('findAll')
  findAll(@Headers() headers: any) {
    const token = headers.authorization?.split(' ')[1];
    return this.nftService.findAll(token);
  }

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('findOne')
  findOne(@Headers() headers: any, @Body() body: { id: string }) {
    const token = headers.authorization?.split(' ')[1];
    return this.nftService.findOne(token, body.id);
  }

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete('delete')
  remove(@Headers() headers: any, @Body() body: { id: string }) {
    const token = headers.authorization?.split(' ')[1];
    return this.nftService.remove(token, body.id);
  }
}
