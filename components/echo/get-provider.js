export default () => {
  // WalletConnect cannot reopen dialog, so recreate an instance each time dialog is closed.
  const getProvider = async () => {
    const { default: WalletConnectProvider } = await GetWalletConnectProvider()
    const provider = new WalletConnectProvider ({
      infuraId: "dda2473ca43f4555926534d427abc648",
      qrcode: true,
      rpc: {
        10: 'https://mainnet.optimism.io',
        137: 'https://matic-mainnet.chainstacklabs.com',
        80001: 'https://matic-mumbai.chainstacklabs.com'
      }
    });
    const web3provider =  new providers.Web3Provider(provider)

    return {
      provider,
      web3provider
    }
  }
  
  return {
    getProvider
  }
}