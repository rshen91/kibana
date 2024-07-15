/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/*
 * NOTICE: Do not edit this file manually.
 * This file is automatically generated by the OpenAPI Generator, @kbn/openapi-generator.
 *
 * info:
 *   title: Delete exception list item API endpoint
 *   version: 2023-10-31
 */

import { z } from 'zod';

import {
  ExceptionListItemId,
  ExceptionListItemHumanId,
  ExceptionNamespaceType,
  ExceptionListItem,
} from '../model/exception_list_common.gen';

export type DeleteExceptionListItemRequestQuery = z.infer<
  typeof DeleteExceptionListItemRequestQuery
>;
export const DeleteExceptionListItemRequestQuery = z.object({
  /**
   * Either `id` or `item_id` must be specified
   */
  id: ExceptionListItemId.optional(),
  /**
   * Either `id` or `item_id` must be specified
   */
  item_id: ExceptionListItemHumanId.optional(),
  namespace_type: ExceptionNamespaceType.optional().default('single'),
});
export type DeleteExceptionListItemRequestQueryInput = z.input<
  typeof DeleteExceptionListItemRequestQuery
>;

export type DeleteExceptionListItemResponse = z.infer<typeof DeleteExceptionListItemResponse>;
export const DeleteExceptionListItemResponse = ExceptionListItem;
