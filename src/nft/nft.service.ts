import { Injectable } from '@nestjs/common';
import CreateNftDto from './dto/create-nft.dto';
import * as xrpl from 'xrpl';
import { NftMetadata } from './entities/nft.entity';
import { JwtService } from '@nestjs/jwt';

interface NftWithMetadata {
  NFT_ID: string;
  metadata: {
      title: string;
      description: string;
      url: string;
  };
}
@Injectable()
export class NftService {
  constructor(private jwtService: JwtService) {}

  async createNFTsForWallet(wallet: xrpl.Wallet, nftData: CreateNftDto[]): Promise<any[]> {
    const net = 'wss://s.' + process.env.NFT_ENV + '.rippletest.net:51233';
    const client = new xrpl.Client(net);
    await client.connect();
  
    let nfts = [];
    for (const data of nftData) {
      const nftMetadata: NftMetadata = {
        title: data.title,
        description: data.text,
        url: data.picture,
      };
  
      const transactionJson: xrpl.NFTokenMint = {
        TransactionType: 'NFTokenMint',
        Account: wallet.classicAddress,
        URI: xrpl.convertStringToHex(JSON.stringify(nftMetadata)),
        Flags: xrpl.NFTokenMintFlags.tfTransferable + xrpl.NFTokenMintFlags.tfBurnable,
        TransferFee: 20000,
        NFTokenTaxon: 0,
      };
  
      const tx = await client.submitAndWait(transactionJson, {
        wallet: wallet,
      });
  
      nfts.push({
        NFT_ID: tx.result.hash,
        metadata: nftMetadata
      });
    }
  
    client.disconnect();
    return nfts;
  }
  

  async marketplace() {
    const wallet1 = await getAccount();
    const wallet2 = await getAccount();
  
    const nftImages1 = [
      "https://img.freepik.com/photos-gratuite/sommet-montagne-majestueux-dans-paysage-hivernal-paisible-genere-par-ia_188544-15662.jpg",
      "https://img.freepik.com/photos-gratuite/peinture-lac-montagne-montagne-arriere-plan_188544-9126.jpg",
      "https://preview.redd.it/national-park-4k-3840x2160-by-a-i-v0-g4crddfnmt9a1.jpg?width=1080&crop=smart&auto=webp&s=4889dfb7d6b7f4bb8dfb24491b3beeeabac18695"
    ];
  
    const nftImages2 = [
      "https://img.freepik.com/photos-gratuite/sommet-montagne-enneige-sous-ia-generative-majeste-galaxie-etoilee_188544-9650.jpg",
      "https://img.freepik.com/photos-gratuite/astronomie-du-ciel-nocturne-galactique-science-ont-combine-ia-generative_188544-9656.jpg",
      "https://img.freepik.com/photos-premium/paysage-planete-fantastique-fond-clair-sombre-ai-generative_332261-2623.jpg?size=626&ext=jpg&ga=GA1.1.632798143.1712707200&semt=ais"
    ];
  
    const nftData1 = nftImages1.map((url, index) => ({
      title: `Titre NFT ${index + 1}`,
      text: `Description pour NFT ${index + 1}`,
      picture: url
    }));
  
    const nftData2 = nftImages2.map((url, index) => ({
      title: `Titre NFT ${index + 4}`,
      text: `Description pour NFT ${index + 4}`,
      picture: url
    }));
  
    const nftsWallet1 = await this.createNFTsForWallet(wallet1, nftData1);
    const nftsWallet2 = await this.createNFTsForWallet(wallet2, nftData2);
  
    return [
      {
        wallet: wallet1.classicAddress,
        seed: wallet1.seed,
        nfts: nftsWallet1
      },
      {
        wallet: wallet2.classicAddress,
        seed: wallet2.seed,
        nfts: nftsWallet2
      }
    ];
  }  
  

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

  async findAll(token: string): Promise<[NftWithMetadata]> {
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

    return results
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


  async remove(token: string, NFT_ID: string) {
    const standby_wallet = xrpl.Wallet.fromSeed(
      this.jwtService.decode(token).seed,
    );
    const net = 'wss://s.' + process.env.NFT_ENV + '.rippletest.net:51233';
    const client = new xrpl.Client(net);
    await client.connect();
  
    const transactionBlob: xrpl.NFTokenBurn = {
      "TransactionType": "NFTokenBurn",
      "Account": standby_wallet.classicAddress,
      "NFTokenID": NFT_ID
    };

    const tx = await client.submitAndWait(transactionBlob, { wallet: standby_wallet });
  
    client.disconnect();
    return tx.result;
  }

  async findAllOffers(token: string) {
    const nfts = await this.findAll(token);
    let allOffers = [];

    for (const nft of nfts) {
      const offer = await this.findOffer(token, nft.NFT_ID);
      allOffers.push({
          NFT_ID: nft,
          offer: offer ? offer : "No buy offers."
      });
    }

    return JSON.stringify(allOffers, null, 2);
  }

  async findOffer(token: string, NFT_ID: string): Promise<any> {
    const net = 'wss://s.' + process.env.NFT_ENV + '.rippletest.net:51233';
    const client = new xrpl.Client(net);
    await client.connect();
  
    try {
      const response = await client.request({
        command: "nft_buy_offers",
        nft_id: NFT_ID
      });

      if (response && response.result && response.result.offers && response.result.offers.length > 0) {
        return response.result.offers;
      }
    } catch (err) {
      console.error(``);
    } finally {
      client.disconnect();
    }

    return "No buy offers.";
  }

  async createBuyOffer(token: string, wallet_dest: string, NFT_ID: string, price: string) {
    const standby_wallet = xrpl.Wallet.fromSeed(
      this.jwtService.decode(token).seed,
    );
    const net = 'wss://s.' + process.env.NFT_ENV + '.rippletest.net:51233';
    const client = new xrpl.Client(net);
    await client.connect();

    const transactionBlob: xrpl.NFTokenCreateOffer = {
      "TransactionType": "NFTokenCreateOffer",
      "Account": standby_wallet.classicAddress,
      "Owner": wallet_dest,
      "NFTokenID": NFT_ID,
      "Amount": price,
      "Flags": undefined
    };

    const tx = await client.submitAndWait(transactionBlob, { wallet: standby_wallet });

    client.disconnect();

    return await this.findOffer('', tx.result.NFTokenID);
  }

  async acceptBuyOffer(token: string, NFT_OFFER: string) {
    const standby_wallet = xrpl.Wallet.fromSeed(
      this.jwtService.decode(token).seed,
    );
    const net = 'wss://s.' + process.env.NFT_ENV + '.rippletest.net:51233';
    const client = new xrpl.Client(net);
    await client.connect();

    const transactionBlob: xrpl.NFTokenAcceptOffer = {
      "TransactionType": "NFTokenAcceptOffer",
      "Account": standby_wallet.classicAddress,
      "NFTokenBuyOffer": NFT_OFFER
    };

    const tx = await client.submitAndWait(transactionBlob, { wallet: standby_wallet });

    const nfts = await client.request({
      command: "account_nfts",
      account: standby_wallet.classicAddress  
    });

    client.disconnect();
    return tx;
  }
}

function hexToString(hex: string): string {
  var str = '';
  for (var i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return str;
}

async function getAccount() {
  let net = 'wss://s.' + process.env.NFT_ENV + '.rippletest.net:51233';
  const client: xrpl.Client = new xrpl.Client(net);
  let faucetHost: string | undefined = undefined;
  await client.connect();
  const my_wallet: xrpl.Wallet = (await client.fundWallet(null, { faucetHost })).wallet;
  client.disconnect();
  return my_wallet;
}