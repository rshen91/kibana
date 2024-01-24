/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { i18n } from '@kbn/i18n';
import React from 'react';

import { CSV_JOB_TYPE, CSV_JOB_TYPE_V2 } from '@kbn/reporting-export-types-csv-common';

import type { SearchSourceFields } from '@kbn/data-plugin/common';
import { ShareContext, ShareMenuProvider } from '@kbn/share-plugin/public';
import { toMountPoint } from '@kbn/react-kibana-mount';
import { checkLicense } from '../lib/license_check';
import { ExportModalShareOpts } from '.';
import { CsvModalContent } from './csv_export_modal';

export const reportingCsvShareProvider = ({
  apiClient,
  toasts,
  uiSettings,
  application,
  license,
  usesUiCapabilities,
  theme,
  overlays,
  i18nStart,
}: ExportModalShareOpts): ShareMenuProvider => {
  const getShareMenuItems = ({ objectType, objectId, sharingData, onClose }: ShareContext) => {
    if ('search' !== objectType) {
      return [];
    }

    // only csv v2 supports esql (isTextBased) reports
    // TODO: whole csv reporting should move to v2 https://github.com/elastic/kibana/issues/151190
    const reportType = sharingData.isTextBased ? CSV_JOB_TYPE_V2 : CSV_JOB_TYPE;

    const getSearchSource = sharingData.getSearchSource as ({
      addGlobalTimeFilter,
      absoluteTime,
    }: {
      addGlobalTimeFilter?: boolean;
      absoluteTime?: boolean;
    }) => SearchSourceFields;

    const jobParams = {
      title: sharingData.title as string,
      objectType,
    };

    const getJobParams = (forShareUrl?: boolean) => {
      if (reportType === CSV_JOB_TYPE_V2) {
        // csv v2 uses locator params
        return {
          ...jobParams,
          locatorParams: sharingData.locatorParams as [Record<string, unknown>],
        };
      }

      // csv v1 uses search source and columns
      return {
        ...jobParams,
        columns: sharingData.columns as string[] | undefined,
        searchSource: getSearchSource({
          addGlobalTimeFilter: true,
          absoluteTime: !forShareUrl,
        }),
      };
    };

    const shareActions = [];

    const licenseCheck = checkLicense(license.check('reporting', 'basic'));
    const licenseToolTipContent = licenseCheck.message;
    const licenseHasCsvReporting = licenseCheck.showLinks;
    const licenseDisabled = !licenseCheck.enableLinks;

    const openCsvModal = () => {
      const session = overlays.openModal(
        toMountPoint(
          <CsvModalContent
            onClose={() => {
              session.close();
              onClose();
            }}
            requiresSavedState={false}
            apiClient={apiClient}
            toasts={toasts}
            uiSettings={uiSettings}
            reportType={CSV_JOB_TYPE}
            objectId={objectId}
            getJobParams={getJobParams}
            theme={theme}
            objectType={objectType}
          />,
          { theme, i18n: i18nStart }
        ),
        {
          maxWidth: 500,
          'data-test-subj': 'export-csv-modal',
        }
      );
    };
    let capabilityHasCsvReporting = false;
    if (usesUiCapabilities) {
      capabilityHasCsvReporting = application.capabilities.discover?.generateCsv === true;
    } else {
      capabilityHasCsvReporting = true; // deprecated
    }

    if (licenseHasCsvReporting && capabilityHasCsvReporting) {
      const panelTitle = i18n.translate('xpack.reporting.shareContextMenu.csvReportsButtonLabel', {
        defaultMessage: 'Download CSV',
      });

      shareActions.push({
        shareMenuItem: {
          name: panelTitle,
          icon: 'document',
          toolTipContent: licenseToolTipContent,
          disabled: licenseDisabled,
          ['data-test-subj']: 'CSVDownload',
          sortOrder: 1,
          onClick: openCsvModal,
        },
        panel: {
          id: 'csvReportingPanel',
          title: panelTitle,
          content: openCsvModal,
        },
      });
    }

    return shareActions;
  };

  return {
    id: 'csvReports',
    getShareMenuItems,
  };
};
