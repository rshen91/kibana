/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EuiSpacer, EuiFlexGroup, EuiFlexItem, EuiLoadingSpinner } from '@elastic/eui';
import * as React from 'react';
import { FC, lazy, Suspense } from 'react';
import type { ReportingModalProps } from './export_modal_content';

const LazyComponent = lazy(() =>
  import('./export_modal_content').then(({ ReportingModalContent }) => ({
    default: DownloadPanelContent,
  }))
);

export const PanelSpinner: React.FC = (props) => {
  return (
    <>
      <EuiSpacer />
      <EuiFlexGroup justifyContent="spaceAround">
        <EuiFlexItem grow={false}>
          <EuiLoadingSpinner size="l" />
        </EuiFlexItem>
      </EuiFlexGroup>
      <EuiSpacer />
    </>
  );
};

export const DownloadPanelContent: FC<Omit<ReportingModalProps, 'intl'>> = (props) => {
  return (
    <Suspense fallback={<PanelSpinner />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};
