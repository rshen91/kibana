/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { i18n } from '@kbn/i18n';
import type { FunctionComponent } from 'react';
import React from 'react';
import { FormattedMessage } from '@kbn/i18n-react';
import { EuiCallOut, EuiText, EuiSpacer } from '@elastic/eui';

const i18nTexts = {
  title: i18n.translate('share.panelContent.unsavedStateErrorTitle', {
    defaultMessage: 'Unsaved work',
  }),
};

export const ErrorUnsavedWorkPanel: FunctionComponent = () => {
  return (
    <EuiCallOut
      size="s"
      title={i18nTexts.title}
      iconType="warning"
      color="danger"
      data-test-subj="shareReportingUnsavedState"
    >
      <EuiText size="s">
        <p>
          <FormattedMessage
            id="share.panelContent.unsavedStateErrorText"
            defaultMessage="Save your work before copying this URL."
          />
        </p>
      </EuiText>
      <EuiSpacer size="s" />
    </EuiCallOut>
  );
};
