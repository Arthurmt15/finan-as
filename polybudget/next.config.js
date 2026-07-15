/** PolyBudget — Next.js 14 config
 *  O pacote `three` precisa ser transpilado porque usa sintaxe ESModule
 *  que o Next.js não processa automaticamente. */
const nextConfig = {
  transpilePackages: ['three'],
}

module.exports = nextConfig
