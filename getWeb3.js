
const _getWeb3  = require( '@drizzle-utils/get-web3')
const web = require( 'web3') // Only required for custom/fallback provider option.

exports.getWeb3 = async function() {
    if (typeof window !== "undefined" && window.ethereum) {
        // Get rid of a warning about network refreshing.
        window.ethereum.autoRefreshOnNetworkChange = false
    }
    // Fallback to Ethereum mainnet.
    // Address copied from MetaMask.
    const fallbackProvider = new web.providers.HttpProvider("https://api.infura.io/v1/jsonrpc/mainnet")
    const result = await _getWeb3({ fallbackProvider, requestPermission: true })
    return result
}

// exports.getNetworkType  =  async function() {
//     if (typeof window !== "undefined" && window.ethereum) {
//         // Get rid of a warning about network refreshing.
//         window.ethereum.autoRefreshOnNetworkChange = false
//     }
//     return _getWeb3().then(web3 => {
//         return web.web3.eth.net.getNetworkType()
//     }).catch(err => {
//         console.warn("Error getting the network type.")
//         console.warn(err)
//         alert("Could not find an Ethereum wallet provider so mainnet will be used")
//         // Assume mainnet
//         return 'main'
//     })
// }
