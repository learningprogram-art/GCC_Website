import pxtorem from 'postcss-pxtorem'

export default {
  plugins: [
    pxtorem({
      rootValue: 16,
      unitPrecision: 5,
      propList: ['*'],
      selectorBlackList: [/^html$/],
      replace: true,
      mediaQuery: false,
      minPixelValue: 2,
      exclude: /node_modules/i,
    }),
  ],
}

