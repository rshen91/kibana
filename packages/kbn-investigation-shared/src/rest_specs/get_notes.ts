/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { z } from '@kbn/zod';
import { investigationNoteResponseSchema } from './investigation_note';

const getInvestigationNotesParamsSchema = z.object({
  path: z.object({
    investigationId: z.string(),
  }),
});

const getInvestigationNotesResponseSchema = z.array(investigationNoteResponseSchema);

type GetInvestigationNotesResponse = z.output<typeof getInvestigationNotesResponseSchema>;

export { getInvestigationNotesParamsSchema, getInvestigationNotesResponseSchema };
export type { GetInvestigationNotesResponse };
