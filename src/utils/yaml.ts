import jsYaml, { YAMLException } from 'js-yaml';
import { TinyStacksError } from '@tinystacks/ops-core';
import { StatusCodes } from 'http-status-codes';

class Yaml {
  static handleError (e: any, message: string): never {
    const tsError = TinyStacksError.fromJson({ message, status: StatusCodes.UNPROCESSABLE_ENTITY });
    if (e.name === 'YAMLException') {
      const error = e as YAMLException;
      tsError.cause = error?.reason?.trim();
      tsError.context = error?.mark?.snippet?.split('\n')?.map(s => s.trim())?.join('\n');
    }
    throw tsError;
  }

  static parseAs<T> (yaml: string): T {
    try {
      return jsYaml.load(yaml) as T;
    } catch (e) {
      this.handleError(e, 'Failed to parse yaml!');
    }
  }

  static parse (yaml: string): any {
    try {
      return jsYaml.load(yaml) as any;
    } catch (e) {
      this.handleError(e, 'Failed to parse yaml!');
    }
  }

  static stringify (json: any): string {
    try {
      return jsYaml.dump(json);
    } catch (e) {
      this.handleError(e, 'Failed to stringify object to yaml!');
    }
  }
}

export {
  Yaml
};

export default Yaml;