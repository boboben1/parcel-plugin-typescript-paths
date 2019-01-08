const assertBundleTree = require('parcel-assert-bundle-tree');
const path = require('path');
const typeScriptPathsPlugin = require('../dist/index');
const Bundler = require('parcel-bundler');

describe('test program', function() {
  it('Should compile the test program and run it without errors', async () => {
    const bundler = new Bundler(path.join(__dirname, 'testapp/src/index.ts'), {
      outDir: path.join(__dirname, 'dist'),
      watch: false,
      cache: false,
      logLevel: 1,
    });

    await typeScriptPathsPlugin(bundler);
    const bundle = await bundler.bundle();
  });
});
