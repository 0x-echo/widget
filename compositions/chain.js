import ethLogo from '~~/assets/chains/ethereum.png'
import polygonLogo from '~~/assets/chains/polygon.png'
import optimismLogo from '~~/assets/chains/optimism.svg'
import moonbeamLogo from '~~/assets/chains/moonbeam.png'
import arbitrumLogo from '~~/assets/chains/arbitrum.png'
import defaultLogo from '~~/assets/chains/unknown-chain.svg'

const logoMap = {
  'EVM/1': ethLogo,
  'EVM/137': polygonLogo,
  'EVM/10': optimismLogo,
  'EVM/1284': moonbeamLogo
}

export default () => {
  return {
    logos: logoMap,
    defaultLogo
  }
}
