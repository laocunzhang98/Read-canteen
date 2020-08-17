module.exports = {
  publicPath: process.env.NUMBER_OF_PROCESSORS === '8'
    ? './'
    : '/',
  
}
