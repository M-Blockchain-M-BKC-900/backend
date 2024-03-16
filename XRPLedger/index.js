const xrpl = require('xrpl');

async function main() {
  const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233") // Testnet => Voir quel testnet utiliser
  await client.connect();
  
  // Interagir avec le XRP Ledger, par exemple, créer un wallet, envoyer une transaction, etc.
  
  await client.disconnect();
}

main().catch(console.error);