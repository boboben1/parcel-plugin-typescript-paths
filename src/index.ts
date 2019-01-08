export = function(bundler) {
  bundler.addAssetType('.ts', require.resolve('./asset.js'));
};
