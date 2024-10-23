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
 *   title: Create Rule API endpoint
 *   version: 2023-10-31
 */

import type { z } from '@kbn/zod';

import { RuleCreateProps, RuleResponse } from '../../../model/rule_schema/rule_schemas.gen';

export type CreateRuleRequestBody = z.infer<typeof CreateRuleRequestBody>;
export const CreateRuleRequestBody = RuleCreateProps;
export type CreateRuleRequestBodyInput = z.input<typeof CreateRuleRequestBody>;

export type CreateRuleResponse = z.infer<typeof CreateRuleResponse>;
export const CreateRuleResponse = RuleResponse;
