/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { ErrorEmbeddable } from '..';

export function isErrorEmbeddable<TEmbeddable extends object>(
  embeddable: TEmbeddable | ErrorEmbeddable
): embeddable is ErrorEmbeddable {
  return Boolean(
    (embeddable as ErrorEmbeddable).fatalError ||
      (embeddable as ErrorEmbeddable).error !== undefined
  );
}
