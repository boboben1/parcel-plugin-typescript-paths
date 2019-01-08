export = function(bundler) {
  bundler.addAssetType('.ts', require.resolve('./asset.ts'));
  bundler.addAssetType('.js', require.resolve('./asset.ts'));
};
