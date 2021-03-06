/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { FtrProviderContext } from '../../../ftr_provider_context';

export default function ({ loadTestFile }: FtrProviderContext) {
  // FLAKY: https://github.com/elastic/kibana/issues/104042
  describe.skip('permissions', function () {
    this.tags(['skipFirefox']);

    loadTestFile(require.resolve('./full_ml_access'));
    loadTestFile(require.resolve('./read_ml_access'));
    loadTestFile(require.resolve('./no_ml_access'));
  });
}
