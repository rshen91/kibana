/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { ByteSizeValue } from '@kbn/config-schema';
import type { SerializedSearchSourceFields } from '@kbn/data-plugin/public';
import { TaskRunMetrics } from '@kbn/reporting-common';

export interface JobParams {
  searchSource: SerializedSearchSourceFields;
  columns?: string[];
  browserTimezone?: string;
}

export interface CsvConfig {
  checkForFormulas: boolean;
  escapeFormulaValues: boolean;
  maxSizeBytes: number | ByteSizeValue;
  useByteOrderMarkEncoding: boolean;
  scroll: {
    duration: string;
    size: number;
  };
}

export interface TaskRunResult {
  content_type: string | null;
  csv_contains_formulas?: boolean;
  max_size_reached?: boolean;
  warnings?: string[];
  metrics?: TaskRunMetrics;
  /**
   * When running a report task we may finish with warnings that were triggered
   * by an error. We can pass the error code via the task run result to the
   * task runner so that it can be recorded for telemetry.
   *
   * Alternatively, this field can be populated in the event that the task does
   * not complete in the task runner's error handler.
   */
  error_code?: string;
}

export const byteSizeValueToNumber = (value: number | ByteSizeValue) => {
  if (typeof value === 'number') {
    return value;
  }

  return value.getValueInBytes();
};
