import TypeScriptAsset from './TypeScriptAsset';
import JSAsset from './JSAsset';

const IMPORT_RE = /\b(?:import.+?|export.+?|require.+?)\(?['"](.*)['"]\)?/g;

class TypeScriptModuledResolveAsset extends TypeScriptAsset {
  contents: string;
  async pretransform() {
    this.contents = this.fixImports(this.contents);
    return super.pretransform();
  }

  fixImports(code: string): string {
    let tsconfig = this.getConfig(['tsconfig.json']); // Overwrite default if config is found
    return code;
  }
}

class JSModuleResolveAsset extends JSAsset {
  contents: string;
  async pretransform() {
    this.contents = this.fixImports(this.contents);

    return super.pretransform();
  }

  fixImports(code: string) {
    let tsconfig = this.getConfig(['tsconfig.json']); // Overwrite default if config is found
    const newPaths = {} as { [key: string]: string };
    for (const key in tsconfig.compilerOptions.paths) {
      newPaths[key] = tsconfig.compilerOptions.paths[key][0].replace('/*', '');
    }

    code = code.replace(IMPORT_RE, (substr: string, includePath: string) => {
      for (const key in newPaths) {
        if (includePath.startsWith(key)) {
          return newPaths[key].concat(substr.substr(key.length));
        }
      }

      return substr;
    });

    return code;
  }
}

export = TypeScriptModuledResolveAsset;
