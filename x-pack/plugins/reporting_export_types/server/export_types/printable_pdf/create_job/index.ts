/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { JobParamsPDFDeprecated } from '@kbn/reporting-plugin/server/routes/lib';
import { TaskPayloadPDF } from '@kbn/reporting-plugin/server/routes/lib/request_handler';
import type { CreateJobFn, CreateJobFnFactory } from '@kbn/reporting-plugin/server/types';
import { validateUrls } from '../../common';

export const createJobFnFactory: CreateJobFnFactory<
  CreateJobFn<JobParamsPDFDeprecated, TaskPayloadPDF>
> = function createJobFactoryFn() {
  return async function createJobFn(
    { relativeUrls, ...jobParams }: JobParamsPDFDeprecated // relativeUrls does not belong in the payload of PDFV1
  ) {
    validateUrls(relativeUrls);

    // return the payload
    return {
      ...jobParams,
      isDeprecated: true,
      forceNow: new Date().toISOString(),
      objects: relativeUrls.map((u: any) => ({ relativeUrl: u })),
    };
  };
};
