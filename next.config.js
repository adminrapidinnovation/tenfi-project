const withPlugins = require('next-compose-plugins');
const optimizedImages = require('next-optimized-images');

const nextConfig = {
  sassOptions: {
    // includePaths: [path.join(__dirname, 'styles')],
    prependData: `@import "styles/vars.scss";`,
  },
};

module.exports = withPlugins([
  [optimizedImages, { optimizeImages: false }],
], nextConfig);
