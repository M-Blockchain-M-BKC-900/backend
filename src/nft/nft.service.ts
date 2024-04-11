import { Injectable } from '@nestjs/common';
import CreateNftDto from './dto/create-nft.dto';
import { UpdateNftDto } from './dto/update-nft.dto';
import { Client, Wallet, convertStringToHex, NFTokenMint } from 'xrpl';
import NftMetadata from './entities/NftMetadata.entity';

@Injectable()
export class NftService {
  async create(createNftDto: CreateNftDto) {
    const net = 'wss://s.altnet.rippletest.net:51233';
    const standby_wallet = Wallet.fromSeed(createNftDto.seed);
    const client = new Client(net);
    await client.connect();

    const nftMetadata: NftMetadata = {
      title: createNftDto.title,
      description: createNftDto.text,
      url: createNftDto.picture,
    };

    const transactionJson: NFTokenMint = {
      TransactionType: 'NFTokenMint',
      Account: standby_wallet.classicAddress,
      URI: convertStringToHex(JSON.stringify(nftMetadata)),
      Flags: 8,
      TransferFee: 20000,
      NFTokenTaxon: 0,
    };

    const tx = await client.submitAndWait(transactionJson, {
      wallet: standby_wallet,
    });
    const nfts = await client.request({
      method: 'account_nfts',
      account: standby_wallet.classicAddress,
    });

    console.log('Transaction result:', tx.result);
    console.log('nfts:', nfts);
    client.disconnect();

    return 'This action adds a new nft';
  }

  findAll() {
    return `This action returns all nft`;
  }

  findOne(id: number) {
    return `This action returns a #${id} nft`;
  }

  update(id: number, updateNftDto: UpdateNftDto) {
    return `This action updates a #${id} nft`;
  }

  remove(id: number) {
    return `This action removes a #${id} nft`;
  }
}
