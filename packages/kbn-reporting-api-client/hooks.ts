/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { IlmPolicyStatusResponse } from '@kbn/reporting-common/types';
import { INTERNAL_ROUTES } from '@kbn/reporting-plugin/common/constants';
import { useRequest } from '@kbn/es-ui-shared-plugin/public';
import type { UseRequestResponse } from '@kbn/es-ui-shared-plugin/public';
import { useKibana } from '.';

export const useCheckIlmPolicyStatus = (): UseRequestResponse<IlmPolicyStatusResponse> => {
  const {
    services: { http },
  } = useKibana();

  return useRequest(http, { path: INTERNAL_ROUTES.MIGRATE.GET_ILM_POLICY_STATUS, method: 'get' });
};
