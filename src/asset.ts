import TypeScriptAsset = require('parcel-bundler/src/assets/TypeScriptAsset.js');
import JSAsset = require('parcel-bundler/src/assets/JSAsset.js');
import * as path from 'path';

const IMPORT_RE = /\b(?:import(.|\n)+?|export(.|\n)+?|require.+?)\(?['"](.*)['"]\)?/g;

class TypeScriptModuledResolveAsset extends TypeScriptAsset {
  public contents: string;
  public dependencies: Map<any, any>;
  public relativeName: string;
  public name: string;
  public options: any;
  public async pretransform() {
    this.contents = await this.fixImports(this.contents);

    return super.pretransform();
  }

  public getRelativeIncludePath(
    newPath: string,
    includePath: string,
    key: string
  ) {
    const relativePath = path
      .relative(
        path.resolve(this.name, '..'),
        `${this.options.rootDir}/${newPath}`
      )
      .replace(/\\/g, '/');

    const targetFile =
      includePath.length === key.length
        ? ''
        : `/${includePath.substring(key.length)}`;

    return `./${relativePath}${targetFile}`.replace(/\/{2,}/g, '/');
  }

  public async fixImports(code: string) {
    const tsconfig = await super.getConfig(['tsconfig.json']); // Overwrite default if config is found

    const paths: { [key: string]: string[] } = tsconfig.compilerOptions.paths;
    if (typeof paths === 'undefined' || paths === null) {
      return;
    }
    const pairs = Object.keys(paths).map((key) => {
      const newKey = key.replace('/*', '/');
      return { [newKey]: paths[key][0].replace('/*', '') };
    });

    const newPaths: { [key: string]: string } = Object.assign({}, ...pairs);

    code = code.replace(IMPORT_RE, (substr: string, part1, part2, includePath: string) => {
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

          return substr;
        }
      }

      return substr;
    });

    return code;
  }
}

export = TypeScriptModuledResolveAsset;
