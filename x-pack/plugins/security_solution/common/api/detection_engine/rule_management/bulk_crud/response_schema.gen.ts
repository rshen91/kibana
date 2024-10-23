/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * NOTICE: Do not edit this file manually.
 * This file is automatically generated by the OpenAPI Generator, @kbn/openapi-generator.
 *
 * info:
 *   title: Bulk Response Schema
 *   version: 8.9.0
 */

import { z } from '@kbn/zod';

import { RuleResponse } from '../../model/rule_schema/rule_schemas.gen';
import { ErrorSchema } from '../../model/error_schema.gen';

export type BulkCrudRulesResponse = z.infer<typeof BulkCrudRulesResponse>;
export const BulkCrudRulesResponse = z.array(z.union([RuleResponse, ErrorSchema]));
