/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { i18n } from '@kbn/i18n';
import React from 'react';
import { tableHasFormulas } from '@kbn/data-plugin/common';
import { downloadMultipleAs, ShareContext, ShareMenuProvider } from '@kbn/share-plugin/public';
import { exporters } from '@kbn/data-plugin/public';
import { IUiSettingsClient } from '@kbn/core-ui-settings-browser';
import { ReportingAPIClient } from '@kbn/reporting-public';
import { CoreSetup, ToastsSetup } from '@kbn/core/public';
import { FormatFactory } from '../../../common/types';
import { TableInspectorAdapter } from '../../editor_frame_service/types';
import { ReportingModalContent } from './export_modal_content';

declare global {
  interface Window {
    /**
     * Debug setting to test CSV download
     */
    ELASTIC_LENS_CSV_DOWNLOAD_DEBUG?: boolean;
    ELASTIC_LENS_CSV_CONTENT?: Record<string, { content: string; type: string }>;
  }
}

async function downloadCSVs({
  activeData,
  title,
  formatFactory,
  uiSettings,
  columnsSorting,
}: {
  title: string;
  activeData: TableInspectorAdapter;
  formatFactory: FormatFactory;
  uiSettings: IUiSettingsClient;
  columnsSorting?: string[];
}) {
  if (!activeData) {
    if (window.ELASTIC_LENS_CSV_DOWNLOAD_DEBUG) {
      window.ELASTIC_LENS_CSV_CONTENT = undefined;
    }
    return;
  }
  const datatables = Object.values(activeData);
  const content = datatables.reduce<Record<string, { content: string; type: string }>>(
    (memo, datatable, i) => {
      // skip empty datatables
      if (datatable) {
        const postFix = datatables.length > 1 ? `-${i + 1}` : '';

        memo[`${title}${postFix}.csv`] = {
          content: exporters.datatableToCSV(datatable, {
            csvSeparator: uiSettings.get('csv:separator', ','),
            quoteValues: uiSettings.get('csv:quoteValues', true),
            formatFactory,
            escapeFormulaValues: false,
            columnsSorting,
          }),
          type: exporters.CSV_MIME_TYPE,
        };
      }
      return memo;
    },
    {}
  );
  if (window.ELASTIC_LENS_CSV_DOWNLOAD_DEBUG) {
    window.ELASTIC_LENS_CSV_CONTENT = content;
  }
  if (content) {
    downloadMultipleAs(content);
  }
}

function getWarnings(activeData: TableInspectorAdapter) {
  const messages = [];
  if (activeData) {
    const datatables = Object.values(activeData);
    const formulaDetected = datatables.some((datatable) => {
      return tableHasFormulas(datatable.columns, datatable.rows);
    });
    if (formulaDetected) {
      messages.push(
        i18n.translate('xpack.lens.app.downloadButtonFormulasWarning', {
          defaultMessage:
            'Your CSV contains characters that spreadsheet applications might interpret as formulas.',
        })
      );
    }
  }
  return messages;
}

interface DownloadPanelShareOpts {
  uiSettings: IUiSettingsClient;
  formatFactoryFn: () => FormatFactory;
  reportingApiClient: ReportingAPIClient;
  toasts: ToastsSetup;
  theme: CoreSetup['theme'];
  version: string;
}

export const downloadCsvShareProvider = ({
  uiSettings,
  formatFactoryFn,
  reportingApiClient,
  toasts,
  theme,
  version,
}: DownloadPanelShareOpts): ShareMenuProvider => {
  const getShareMenuItems = ({ objectType, sharingData, onClose }: ShareContext) => {
    if ('lens' !== objectType) {
      return [];
    }

    const { title, activeData, csvEnabled, columnsSorting } = sharingData as {
      title: string;
      activeData: TableInspectorAdapter;
      csvEnabled: boolean;
      columnsSorting?: string[];
    };
    const panelTitle = i18n.translate(
      'xpack.lens.reporting.shareContextMenu.csvReportsButtonLabel',
      {
        defaultMessage: 'Export',
      }
    );

    return [
      {
        shareMenuItem: {
          name: panelTitle,
          disabled: !csvEnabled,
          sortOrder: 1,
        },
        panel: {
          id: 'csvDownloadPanel',
          title: panelTitle,
          content: (
            <ReportingModalContent
              objectType={objectType}
              apiClient={reportingApiClient}
              toasts={toasts}
              uiSettings={uiSettings}
              requiresSavedState={false}
              onClose={onClose}
              isDisabled={!csvEnabled}
              warnings={getWarnings(activeData)}
              theme={theme}
              columns={columnsSorting}
              version={version}
              onClick={async () => {
                await downloadCSVs({
                  title,
                  formatFactory: formatFactoryFn(),
                  activeData,
                  uiSettings,
                  columnsSorting,
                });
                onClose?.();
              }}
            />
          ),
        },
      },
    ];
  };

  return {
    id: 'csvDownload',
    getShareMenuItems,
  };
};
