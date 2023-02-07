import Widget from './widget';
import { GenericWidgetType, Json, YamlWidget } from '../types';
import Parseable from './parseable';

class GenericWidget extends Widget implements GenericWidgetType, Parseable {
  [key: string]: any;
  constructor (object: GenericWidgetType) {
    const {
      id,
      displayName,
      type,
      providerId,
      showDisplayName,
      description,
      showDescription
    } = object;
    super(
      id,
      displayName,
      type,
      providerId,
      showDisplayName,
      description,
      showDescription
    );
    for (const [key, value] of Object.entries(object)) {
      this[key] = value;
    }
    // this.myPrivateProp = 'abc';
  }

  static fromJson (object: GenericWidgetType): GenericWidget {
    return new GenericWidget(object);
  }

  toJson (): GenericWidgetType {
    const anonymous: Json = { ...this };
    delete anonymous.getData;
    const {
      id,
      displayName,
      type,
      providerId,
      showDisplayName,
      description,
      showDescription
    } = anonymous;
    return {
      ...anonymous,
      id,
      displayName,
      type,
      providerId,
      showDisplayName,
      description,
      showDescription
    };
  }

  static fromYaml (yamlJson: YamlWidget, id?: string): GenericWidget {
    return new GenericWidget({
      ...yamlJson,
      id
    });
  }
  
  toYaml (): YamlWidget {
    return this;
  }

  getData (): void { return; }
}

export default GenericWidget;