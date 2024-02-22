/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { ModalProps } from '@kbn/share-modal';
import { ReactElement } from 'react';

/**
 * Props for the `ShareModal` pure component.
 */
export type ShareModalComponentProps = Partial<
  Pick<ModalProps, 'objectType' | 'modalBodyDescriptions' | 'tabs'>
> & {
  objectType: string;
  modalBodyDescription: string;
  tabs: Array<{ id: string; name: string; content: ReactElement }>;
};

export type ShareModalProps = ShareModalComponentProps;
