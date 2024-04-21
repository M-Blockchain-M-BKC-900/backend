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
  Query,
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
  async findAll(@Headers() headers: any) {
    const token = headers.authorization?.split(' ')[1];

    return JSON.stringify(await this.nftService.findAll(token));
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

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('findOffer')
  findOffer(@Headers() headers: any, @Body() body: { NFT_ID: string }) {
    const token = headers.authorization?.split(' ')[1];
    return this.nftService.findOffer(token, body.NFT_ID);
  }

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('findAllOffers')
  findAllOffers(@Headers() headers: any) {
    const token = headers.authorization?.split(' ')[1];
    return this.nftService.findAllOffers(token);
  }

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('createBuyOffer')
  createBuyOffer(
    @Headers() headers: any,
    @Query('wallet_dest') wallet_dest: string,
    @Query('NFT_ID') NFT_ID: string,
    @Query('price') price: string
  ) {
    const token = headers.authorization?.split(' ')[1];
    return this.nftService.createBuyOffer(token, wallet_dest, NFT_ID, price);
  }

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('acceptBuyOffer')
  acceptBuyOffer(@Headers() headers: any,     @Query('NFT_OFFER') NFT_OFFER: string) {
    const token = headers.authorization?.split(' ')[1];
    return this.nftService.acceptBuyOffer(token, NFT_OFFER);
  }
}
