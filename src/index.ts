export = function (bundler) {
  const assetTypes = ['.ts', '.tsx'];
  assetTypes.forEach((_) => bundler.addAssetType(_, require.resolve('./asset.js')));
};
