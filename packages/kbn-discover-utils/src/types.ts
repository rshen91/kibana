/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import type { SearchHit } from '@elastic/elasticsearch/lib/api/typesWithBodyKey';

export type { IgnoredReason, ShouldShowFieldInTableHandler } from './utils';

export interface EsHitRecord extends Omit<SearchHit, '_source'> {
  _source?: Record<string, unknown>;
}

/**
 * This is the record/row of data provided to our Data Table
 */
export interface DataTableRecord {
  /**
   * A unique id generated by index, id and routing of a record
   */
  id: string;
  /**
   * The document returned by Elasticsearch for search queries
   */
  raw: EsHitRecord;
  /**
   * A flattened version of the ES doc or data provided by SQL, aggregations ...
   */
  flattened: Record<string, unknown>;
  /**
   * Determines that the given doc is the anchor doc when rendering view surrounding docs
   */
  isAnchor?: boolean;
}

type FormattedHitPair = readonly [
  fieldDisplayName: string,
  formattedValue: string,
  fieldName: string | null // `null` is when number of fields is limited and there is an extra pair about it
];

/**
 * Pairs array for each field in the hit
 */
export type FormattedHit = FormattedHitPair[];
