/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

export { InternalApiClientProvider, useInternalApiClient } from './context';
export { useCheckIlmPolicyStatus } from './hooks';
export { ReportingAPIClient } from './reporting_api_client';
export type { DiagnoseResponse } from './reporting_api_client';

import type { CoreSetup, CoreStart } from '@kbn/core/public';
import type { DataPublicPluginStart } from '@kbn/data-plugin/public';
import { useKibana as _useKibana } from '@kbn/kibana-react-plugin/public';
import type { SharePluginStart } from '@kbn/share-plugin/public';

/* Services received through useKibana context
 * @internal
 */
export interface KibanaContext {
  http: CoreSetup['http'];
  application: CoreStart['application'];
  uiSettings: CoreStart['uiSettings'];
  docLinks: CoreStart['docLinks'];
  data: DataPublicPluginStart;
  share: SharePluginStart;
}

export const useKibana = () => _useKibana<KibanaContext>();
