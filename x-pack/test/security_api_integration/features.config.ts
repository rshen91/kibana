/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { resolve } from 'path';

import type { FtrConfigProviderContext } from '@kbn/test';

import { services } from './services';

export default async function ({ readConfigFile }: FtrConfigProviderContext) {
  const xPackAPITestsConfig = await readConfigFile(require.resolve('../api_integration/config.ts'));

  const featuresProviderPlugin = resolve(__dirname, './plugins/features_provider');

  return {
    testFiles: [require.resolve('./tests/features')],
    servers: xPackAPITestsConfig.get('servers'),
    security: { disableTestUser: true },
    services,
    junit: {
      reportName: 'X-Pack Security API Integration Tests (Features)',
    },

    esTestCluster: xPackAPITestsConfig.get('esTestCluster'),

    kbnTestServer: {
      ...xPackAPITestsConfig.get('kbnTestServer'),
      serverArgs: [
        ...xPackAPITestsConfig.get('kbnTestServer.serverArgs'),
        `--plugin-path=${featuresProviderPlugin}`,
      ],
    },
  };
}
