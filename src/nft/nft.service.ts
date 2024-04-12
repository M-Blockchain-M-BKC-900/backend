import { Injectable } from '@nestjs/common';
import CreateNftDto from './dto/create-nft.dto';
import * as xrpl from 'xrpl';
import { NftMetadata } from './entities/nft.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class NftService {
  constructor(private jwtService: JwtService) {}
  async create(createNftDto: CreateNftDto, token: string) {
    const net = 'wss://s.' + process.env.NFT_ENV + '.rippletest.net:51233';
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

  async findAll(token: string) {
    const standby_wallet = xrpl.Wallet.fromSeed(
      this.jwtService.decode(token).seed,
    );
    const net = 'wss://s.' + process.env.NFT_ENV + '.rippletest.net:51233';
    const client = new xrpl.Client(net);
    await client.connect();

    const nfts: xrpl.AccountNFTsResponse = await client.request({
      command: 'account_nfts',
      account: standby_wallet.classicAddress,
    });

    let results: any = [];
    console.log("nfts: ", nfts.result);

    nfts.result.account_nfts.forEach((nft) => {
      const metadataJson: string = hexToString(nft.URI || '');

      try {
        const metadata: any = JSON.parse(metadataJson);
        results.push({
          NFT_ID: nft.NFTokenID,
          metadata: metadata
        });
      } catch (e) {
        results.push({
          NFT_ID: nft.NFTokenID,
          error: `Error parsing metadata: ${e.message}`
        });
      }
    });

    client.disconnect();

    return JSON.stringify(results, null, 2);
  }


  async findOne(token: string, NFT_ID: string) {
    const standby_wallet = xrpl.Wallet.fromSeed(
      this.jwtService.decode(token).seed,
    );
    const net = 'wss://s.' + process.env.NFT_ENV + '.rippletest.net:51233';
    const client = new xrpl.Client(net);
    await client.connect();

    const nfts: xrpl.AccountNFTsResponse = await client.request({
      command: 'account_nfts',
      account: standby_wallet.classicAddress,
    });

    console.log("nfts: ", nfts.result);

    for (let nft of nfts.result.account_nfts) {
      if (nft.NFTokenID === NFT_ID) {
        try {
          const metadataJson: string = hexToString(nft.URI || '');
          const metadata = JSON.parse(metadataJson);
          client.disconnect();
          return JSON.stringify({
            NFT_ID: nft.NFTokenID,
            metadata: metadata
          }, null, 2);
        } catch (e) {
          client.disconnect();
          return JSON.stringify({
            NFT_ID: nft.NFTokenID,
            error: `Error parsing metadata: ${e.message}`
          }, null, 2);
        }
      }
    }

    client.disconnect();

    return JSON.stringify({ error: "NFT not found with the provided ID." }, null, 2);
  }


  remove(id: number) {
    return `This action removes a #${id} nft`;
  }
}

function hexToString(hex: string): string {
  var str = '';
  for (var i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return str;
}