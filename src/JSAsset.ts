export = parseInt(process.versions.node, 10) < 8
  ? require('parcel-bundler/lib/assets/JSAsset.js')
  : require('parcel-bundler/src/assets/JSAsset.js');
