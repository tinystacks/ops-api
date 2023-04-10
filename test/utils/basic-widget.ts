import { BaseWidget } from '@tinystacks/ops-core';
import { Widget } from '@tinystacks/ops-model';
import React from 'react';

export class BasicWidget extends BaseWidget {
  static fromJson (object: Widget) {
    return new BasicWidget(object);
  }
  getData () {}
  render () { return React.createElement('div'); }
}