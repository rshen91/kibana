/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { OverlayRef } from '@kbn/core-mount-utils-browser';

interface TracksOverlaysOptions {
  /**
   * If present, the panel with this ID will be focused when the overlay is opened. This can be used in tandem with a push
   * flyout to edit a panel's settings in context
   */
  focusedPanelId?: string;
}

export interface TracksOverlays {
  openOverlay: (ref: OverlayRef, options?: TracksOverlaysOptions) => void;
  clearOverlays: () => void;
}

export interface CanFocusPanels {
  setFocusedPanelId: (id?: string) => void;
}

export const apiCanFocusPanels = (root: unknown): root is CanFocusPanels => {
  return Boolean(root && (root as CanFocusPanels).setFocusedPanelId);
};

export const tracksOverlays = (root: unknown): root is TracksOverlays => {
  return Boolean(
    root && (root as TracksOverlays).openOverlay && (root as TracksOverlays).clearOverlays
  );
};
