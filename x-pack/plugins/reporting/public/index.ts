/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { PluginInitializerContext } from '@kbn/core/public';
import { ReportingPublicPlugin } from './plugin';

/**
 * Setup contract for the Reporting plugin.
 */
export interface ReportingSetup {
  /**
   * Used to inform plugins if Reporting config is compatible with UI Capabilities / Application Sub-Feature Controls
   *
   * @returns boolean
   */
  usesUiCapabilities: () => boolean;
  export_types: {
    pdf: {
      enabled: boolean;
    };
    png: {
      enabled: boolean;
    };
    csv: {
      enabled: boolean;
    };
  };
}

/**
 * Start contract for the Reporting plugin.
 */
export type ReportingStart = ReportingSetup;

/**
 * @internal
 *
 * @param {PluginInitializerContext} initializerContext
 * @returns {ReportingPublicPlugin}
 */
export function plugin(initializerContext: PluginInitializerContext): ReportingPublicPlugin {
  return new ReportingPublicPlugin(initializerContext);
}
