/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
import React, { useEffect, FC, PropsWithChildren } from 'react';

import { useFlyoutPanelContext } from './flyout_panel';

export const PanelContent: FC<PropsWithChildren> = (props) => {
  const { registerContent } = useFlyoutPanelContext();

  useEffect(() => {
    registerContent();
  }, [registerContent]);

  return <div className="fieldEditor__flyoutPanel__content" {...props} />;
};
