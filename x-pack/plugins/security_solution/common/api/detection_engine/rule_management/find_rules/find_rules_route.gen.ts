/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { z } from 'zod';
import { ArrayFromString } from '@kbn/zod-helpers';

/*
 * NOTICE: Do not edit this file manually.
 * This file is automatically generated by the OpenAPI Generator, @kbn/openapi-generator.
 */

import { SortOrder } from '../../model/sorting.gen';
import { RuleResponse } from '../../model/rule_schema/rule_schemas.gen';

export type FindRulesSortField = z.infer<typeof FindRulesSortField>;
export const FindRulesSortField = z.enum([
  'created_at',
  'createdAt',
  'enabled',
  'execution_summary.last_execution.date',
  'execution_summary.last_execution.metrics.execution_gap_duration_s',
  'execution_summary.last_execution.metrics.total_indexing_duration_ms',
  'execution_summary.last_execution.metrics.total_search_duration_ms',
  'execution_summary.last_execution.status',
  'name',
  'risk_score',
  'riskScore',
  'severity',
  'updated_at',
  'updatedAt',
]);
export type FindRulesSortFieldEnum = typeof FindRulesSortField.enum;
export const FindRulesSortFieldEnum = FindRulesSortField.enum;

export type FindRulesRequestQuery = z.infer<typeof FindRulesRequestQuery>;
export const FindRulesRequestQuery = z.object({
  fields: ArrayFromString(z.string()).optional(),
  /**
   * Search query
   */
  filter: z.string().optional(),
  /**
   * Field to sort by
   */
  sort_field: FindRulesSortField.optional(),
  /**
   * Sort order
   */
  sort_order: SortOrder.optional(),
  /**
   * Page number
   */
  page: z.coerce.number().int().min(1).optional().default(1),
  /**
   * Rules per page
   */
  per_page: z.coerce.number().int().min(0).optional().default(20),
});
export type FindRulesRequestQueryInput = z.input<typeof FindRulesRequestQuery>;

export type FindRulesResponse = z.infer<typeof FindRulesResponse>;
export const FindRulesResponse = z.object({
  page: z.number().int(),
  perPage: z.number().int(),
  total: z.number().int(),
  data: z.array(RuleResponse),
});
