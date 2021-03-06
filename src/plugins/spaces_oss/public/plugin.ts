/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import type { Plugin } from 'src/core/public';

import type { SpacesApi } from './api';
import type { SpacesOssPluginSetup, SpacesOssPluginStart } from './types';

export class SpacesOssPlugin implements Plugin<SpacesOssPluginSetup, SpacesOssPluginStart, {}, {}> {
  private api?: SpacesApi;

  constructor() {}

  public setup() {
    return {
      registerSpacesApi: (provider: SpacesApi) => {
        if (this.api) {
          throw new Error('Spaces API can only be registered once');
        }
        this.api = provider;
      },
    };
  }

  public start() {
    if (this.api) {
      return {
        isSpacesAvailable: true as true,
        ...this.api!,
      };
    } else {
      return {
        isSpacesAvailable: false as false,
      };
    }
  }
}
