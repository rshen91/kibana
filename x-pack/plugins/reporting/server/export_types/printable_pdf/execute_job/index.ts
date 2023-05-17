/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { TaskRunResult } from '@kbn/reporting-common';
import apm from 'elastic-apm-node';
import * as Rx from 'rxjs';
import { catchError, map, mergeMap, takeUntil, tap } from 'rxjs/operators';
import { REPORTING_TRANSACTION_TYPE } from '../../../../common/constants';
import { RunTaskFn } from '../../../types';
import { decryptJobHeaders, getCustomLogo, getFullUrls } from '../../common';
import { LogoCore } from '../../common/types';
import { generatePdfObservable } from '../lib/generate_pdf';
import { RunTaskFnFactory, TaskPayloadPDF } from '../types';

export const runTaskFnFactory: RunTaskFnFactory<RunTaskFn<TaskPayloadPDF>> =
  function executeJobFactoryFn(reporting, parentLogger) {
    const { encryptionKey } = reporting.getConfig();

    return async function runTask(jobId, job, cancellationToken, stream) {
      const jobLogger = parentLogger.get(`execute-job:${jobId}`);
      const apmTrans = apm.startTransaction('execute-job-pdf', REPORTING_TRANSACTION_TYPE);
      const apmGetAssets = apmTrans?.startSpan('get-assets', 'setup');
      let apmGeneratePdf: { end: () => void } | null | undefined;

      const reportingLogo = reporting as unknown as LogoCore;

      const process$: Rx.Observable<TaskRunResult> = Rx.of(1).pipe(
        mergeMap(() => decryptJobHeaders(encryptionKey, job.headers, jobLogger)),
        mergeMap((headers) => getCustomLogo(reportingLogo, headers, job.spaceId, jobLogger)),
        mergeMap(({ headers, logo }) => {
          const urls = getFullUrls(reporting, job);

          const { browserTimezone, layout, title } = job;
          apmGetAssets?.end();

          apmGeneratePdf = apmTrans?.startSpan('generate-pdf-pipeline', 'execute');
          return generatePdfObservable(reporting, {
            format: 'pdf',
            title,
            logo,
            urls,
            browserTimezone,
            headers,
            layout,
          });
        }),
        tap(({ buffer }) => {
          apmGeneratePdf?.end();
          if (buffer) {
            stream.write(buffer);
          }
        }),
        map(({ metrics, warnings }) => ({
          content_type: 'application/pdf',
          metrics: { pdf: metrics },
          warnings,
        })),
        catchError((err) => {
          jobLogger.error(err);
          return Rx.throwError(err);
        })
      );

      const stop$ = Rx.fromEventPattern(cancellationToken.on);

      apmTrans?.end();
      return Rx.lastValueFrom(process$.pipe(takeUntil(stop$)));
    };
  };
