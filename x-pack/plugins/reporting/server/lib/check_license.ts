/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { ILicense } from '@kbn/licensing-plugin/server';
import { PdfExportType } from '../export_types/printable_pdf_v2/types';
import { ExportTypeDefinition } from '../types';
import { ExportTypesRegistry } from './export_types_registry';

export interface LicenseCheckResult {
  showLinks: boolean;
  enableLinks: boolean;
  message?: string;
  jobTypes?: string[];
}

const messages = {
  getUnavailable: () => {
    return 'You cannot use Reporting because license information is not available at this time.';
  },
  getExpired: (license: ILicense) => {
    return `You cannot use Reporting because your ${license.type} license has expired.`;
  },
};

const makeManagementFeature = (exportTypes: ExportTypeDefinition[]) => {
  return {
    id: 'management',
    checkLicense: (license?: ILicense) => {
      if (!license || !license.type) {
        return {
          showLinks: true,
          enableLinks: false,
          message: messages.getUnavailable(),
        };
      }

      if (!license.isActive) {
        return {
          showLinks: true,
          enableLinks: false,
          message: messages.getExpired(license),
        };
      }

      const validJobTypes = exportTypes
        .filter((exportType) => exportType.validLicenses.includes(license.type || ''))
        .map((exportType) => exportType.jobType);

      return {
        showLinks: validJobTypes.length > 0,
        enableLinks: validJobTypes.length > 0,
        jobTypes: validJobTypes,
      };
    },
  };
};

const makeManagementFeaturePdf = (exportTypes: PdfExportType[]) => {
  return {
    id: 'management',
    checkLicense: (license?: ILicense) => {
      if (!license || !license.type) {
        return {
          showLinks: true,
          enableLinks: false,
          message: messages.getUnavailable(),
        };
      }

      if (!license.isActive) {
        return {
          showLinks: true,
          enableLinks: false,
          message: messages.getExpired(license),
        };
      }

      return {
        showLinks: true,
        enableLinks: true,
        jobTypes: ['printable_pdf_v2'],
      };
    },
  };
};

const makeExportTypeFeaturePdf = (exportType: PdfExportType) => {
  return {
    id: exportType.id,
    checkLicense: (license?: ILicense) => {
      if (!license || !license.type) {
        return {
          showLinks: true,
          enableLinks: false,
          message: messages.getUnavailable(),
        };
      }

      if (!exportType.validLicenses.includes(license.type)) {
        return {
          showLinks: false,
          enableLinks: false,
          message: `Your ${license.type} license does not support ${exportType.id} Reporting. Please upgrade your license.`,
        };
      }

      if (!license.isActive) {
        return {
          showLinks: true,
          enableLinks: false,
          message: messages.getExpired(license),
        };
      }

      return {
        showLinks: true,
        enableLinks: true,
      };
    },
  };
};

const makeExportTypeFeature = (exportType: ExportTypeDefinition) => {
  return {
    id: exportType.id,
    checkLicense: (license?: ILicense) => {
      if (!license || !license.type) {
        return {
          showLinks: true,
          enableLinks: false,
          message: messages.getUnavailable(),
        };
      }

      if (!exportType.validLicenses.includes(license.type)) {
        return {
          showLinks: false,
          enableLinks: false,
          message: `Your ${license.type} license does not support ${exportType.id} Reporting. Please upgrade your license.`,
        };
      }

      if (!license.isActive) {
        return {
          showLinks: true,
          enableLinks: false,
          message: messages.getExpired(license),
        };
      }

      return {
        showLinks: true,
        enableLinks: true,
      };
    },
  };
};

export function checkLicense(
  exportTypesRegistry: ExportTypesRegistry | PdfExportType,
  license: ILicense | undefined
) {
  // @ts-ignore don't need to conform to PdfExportType
  const exportTypes = Array.from(exportTypesRegistry.getAll());
  const reportingFeatures = [
    // @ts-ignore don't need to conform to PdfExportType
    ...exportTypes.map(makeExportTypeFeature),
    // @ts-ignore don't need to conform to PdfExportType
    makeManagementFeature(exportTypes),
  ];

  return reportingFeatures.reduce((result, feature) => {
    result[feature.id] = feature.checkLicense(license);
    return result;
  }, {} as Record<string, LicenseCheckResult>);
}

export function checkLicenseExportType(exportTypeRegistry: PdfExportType[], license?: ILicense) {
  const reportingFeatures = [
    ...exportTypeRegistry.map(makeExportTypeFeaturePdf),
    makeManagementFeaturePdf(exportTypeRegistry),
  ];

  return reportingFeatures.reduce((result, feature) => {
    result[feature.id] = feature.checkLicense(license);
    return result;
  }, {} as Record<string, LicenseCheckResult>);
}
