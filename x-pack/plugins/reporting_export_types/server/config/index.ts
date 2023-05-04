/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import { PluginConfigDescriptor } from '@kbn/core-plugins-server';
import { ConfigSchema, ReportingExportTypesConfigType } from './schema';

export type { ReportingExportTypesConfigType };
export { ConfigSchema };

export const config: PluginConfigDescriptor<ReportingExportTypesConfigType> = {
  schema: ConfigSchema,
};
