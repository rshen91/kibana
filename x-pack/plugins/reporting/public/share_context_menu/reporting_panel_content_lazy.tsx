/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import * as React from 'react';
import { FC, lazy, Suspense } from 'react';
import { PanelSpinner } from './panel_spinner';
import type { Props } from './reporting_panel_content';
import type { ReportingModalProps } from './image_export_modal';

const LazyComponent = lazy(() =>
  import('./reporting_panel_content').then(({ ReportingPanelContent }) => ({
    default: ReportingPanelContent,
  }))
);

const LazyModalComponent = lazy(() =>
  import('./image_export_modal').then(({ ReportingModalContent }) => ({
    default: ReportingModalContent,
  }))
);

export const ReportingPanelContent: FC<Omit<Props, 'intl'>> = (props) => {
  return (
    <Suspense fallback={<PanelSpinner />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

export const ReportingModalContent: FC<ReportingModalProps> = (props) => {
  return (
    <Suspense fallback={<PanelSpinner />}>
      <LazyModalComponent {...props} />
    </Suspense>
  );
};
