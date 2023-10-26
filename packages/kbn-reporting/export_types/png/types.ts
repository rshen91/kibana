/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import type { BaseParams, BasePayload } from '@kbn/reporting-common-export-types-helpers';
import type { LocatorParams } from '@kbn/reporting-common/url';
import type { LayoutParams } from '@kbn/screenshotting-plugin/common';

// Job params: structure of incoming user request data
export interface JobParamsPNGV2 extends BaseParams {
  layout: LayoutParams;
  /**
   * This value is used to re-create the same visual state as when the report was requested as well as navigate to the correct page.
   */
  locatorParams: LocatorParams;
}

// Job payload: structure of stored job data provided by create_job
export interface TaskPayloadPNGV2 extends BasePayload {
  layout: LayoutParams;
  forceNow: string;
  /**
   * Even though we only ever handle one locator for a PNG, we store it as an array for consistency with how PDFs are stored
   */
  locatorParams: LocatorParams[];
}
