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
import { ILicense } from '@kbn/licensing-plugin/public';
import { FormatFactory } from '../../../common/types';
import { DownloadPanelContent } from './csv_download_panel_content_lazy';
import { TableInspectorAdapter } from '../../editor_frame_service/types';

declare global {
  interface Window {
    /**
     * Debug setting to test CSV download
     */
    ELASTIC_LENS_CSV_DOWNLOAD_DEBUG?: boolean;
    ELASTIC_LENS_CSV_CONTENT?: Record<string, { content: string; type: string }>;
  }
}

export const downloadCSVs = async ({
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
}) => {
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
};

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
  license: ILicense;
}

export const downloadCsvShareProvider = ({
  uiSettings,
  formatFactoryFn,
  license,
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
        defaultMessage: 'CSV Download',
      }
    );

    const atLeastGold = license.hasAtLeast('gold');

    return [
      atLeastGold
        ? {
            shareMenuItem: {
              name: panelTitle,
              icon: 'document',
              disabled: !csvEnabled,
              sortOrder: 1,
            },
            panel: {
              id: 'csvDownloadPanel',
              title: panelTitle,
              content: (
                <DownloadPanelContent
                  isDisabled={!csvEnabled}
                  warnings={getWarnings(activeData)}
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
          }
        : null,
    ];
  };

  return {
    id: 'csvDownload',
    getShareMenuItems,
  };
};
