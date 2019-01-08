import TypeScriptAsset = require('parcel-bundler/src/assets/TypeScriptAsset.js');
import JSAsset = require('parcel-bundler/src/assets/JSAsset.js');
import * as path from 'path';

const IMPORT_RE = /\b(?:import.+?|export.+?|require.+?)\(?['"](.*)['"]\)?/g;

class TypeScriptModuledResolveAsset extends TypeScriptAsset {
  contents: string;
  dependencies: Map<any, any>;
  relativeName: string;
  name: string;
  options: any;
  async pretransform() {
    this.contents = await this.fixImports(this.contents);

    return super.pretransform();
  }

  getRelativeIncludePath(newPath: string, includePath: string, key: string) {
    const relativePath = path
      .relative(
        path.resolve(this.name, '..'),
        `${this.options.rootDir}/${newPath}`
      )
      .replace('\\', '/');

    const targetFile =
      includePath.length === key.length
        ? ''
        : `/${includePath.substring(key.length)}`;

    return `./${relativePath}${targetFile}`.replace(/\/{2,}/g, '/');
  }

  async fixImports(code: string) {
    let tsconfig = await super.getConfig(['tsconfig.json']); // Overwrite default if config is found

    const newPaths = {} as { [key: string]: string };
    for (const key in tsconfig.compilerOptions.paths) {
      newPaths[key.replace('/*', '/')] = tsconfig.compilerOptions.paths[
        key
      ][0].replace('/*', '');
    }

    code = code.replace(IMPORT_RE, (substr: string, includePath: string) => {
      for (const key in newPaths) {
        if (
          includePath.startsWith(key) &&
          includePath.indexOf('/') > 0 ===
            (key.substring(key.length - 1) === '/')
        ) {
          substr = substr.replace(
            includePath,
            this.getRelativeIncludePath(newPaths[key], includePath, key)
          );
          console.log(substr);
          return substr;
        }
      }

      return substr;
    });

    return code;
  }
}

export = TypeScriptModuledResolveAsset;
