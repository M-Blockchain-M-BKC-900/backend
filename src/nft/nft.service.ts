import { Injectable } from '@nestjs/common';
import CreateNftDto from './dto/create-nft.dto';
import * as xrpl from 'xrpl';
import { NftMetadata } from './entities/nft.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class NftService {
  constructor(private jwtService: JwtService) {}
  async create(createNftDto: CreateNftDto, token: string) {
    const net = 'wss://s.altnet.rippletest.net:51233';
    const standby_wallet = xrpl.Wallet.fromSeed(
      this.jwtService.decode(token).seed,
    );
    const client = new xrpl.Client(net);
    await client.connect();

    const nftMetadata: NftMetadata = {
      title: createNftDto.title,
      description: createNftDto.text,
      url: createNftDto.picture,
    };

    const transactionJson: xrpl.NFTokenMint = {
      TransactionType: 'NFTokenMint',
      Account: standby_wallet.classicAddress,
      URI: xrpl.convertStringToHex(JSON.stringify(nftMetadata)),
      Flags: 8,
      TransferFee: 20000,
      NFTokenTaxon: 0,
    };

    const tx = await client.submitAndWait(transactionJson, {
      wallet: standby_wallet,
    });

    client.disconnect();

    return tx.result;
  }

  async findAll(seed: string) {
    const standby_wallet = xrpl.Wallet.fromSeed(seed);
    const net = 'wss://s.altnet.rippletest.net:51233';
    const client = new xrpl.Client(net);
    await client.connect();

    const nfts: xrpl.AccountNFTsResponse = await client.request({
      command: 'account_nfts',
      account: standby_wallet.classicAddress,
    });

    let results = '';

    nfts.result.account_nfts.forEach((nft) => {
      const metadataJson: string = JSON.stringify(nft.URI);
      try {
        const metadata: any = JSON.parse(metadataJson);
        results += `\nNFT ID: ${nft.NFTokenID}, metadata: ${JSON.stringify(metadata, null, 2)}`;
      } catch (e) {
        results += `\nNFT ID: ${nft.NFTokenID}, Error parsing metadata: ${e.message}`;
      }
    });

    console.log('NFTs:', results);

    client.disconnect();
  }

  findOne(id: number) {
    return `This action returns a #${id} nft`;
  }

  remove(id: number) {
    return `This action removes a #${id} nft`;
  }
}
