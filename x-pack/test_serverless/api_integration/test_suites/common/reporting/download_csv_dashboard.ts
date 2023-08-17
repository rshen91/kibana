/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import expect from '@kbn/expect';
import { JobParamsDownloadCSV } from '@kbn/reporting-plugin/server/export_types/csv_searchsource_immediate/types';
import { FtrProviderContext } from '../../../ftr_provider_context';

const getMockJobParams = (obj: object) => {
  return {
    title: `Mock CSV Title`,
    ...obj,
  } as JobParamsDownloadCSV;
};

// eslint-disable-next-line import/no-default-export
export default function ({ getService }: FtrProviderContext) {
  const kibanaServer = getService('kibanaServer');
  const supertestSvc = getService('supertest');
  const reportingAPI = getService('svlReportingAPI');

  const generateAPI = {
    getCSVFromSearchSource: async (job: JobParamsDownloadCSV) => {
      return await supertestSvc
        .post(`/internal/reporting/generate/immediate/csv_searchsource`)
        .set('kbn-xsrf', 'xxx')
        .send(job);
    },
  };

  const fromTime = '2019-06-20T00:00:00.000Z';
  const toTime = '2019-06-25T00:00:00.000Z';

  describe('CSV Generation from SearchSource', () => {
    before(async () => {
      await reportingAPI.initEcommerce();
      await reportingAPI.initLogs();
      await kibanaServer.uiSettings.update({
        'csv:quoteValues': true,
        'dateFormat:tz': 'UTC',
      });
    });

    after(async () => {
      await reportingAPI.deleteAllReports();
    });

    describe('unquoted values', () => {
      before(async () => {
        await kibanaServer.uiSettings.update({ 'csv:quoteValues': false });
      });

      after(async () => {
        await kibanaServer.uiSettings.update({ 'csv:quoteValues': true });
      });


      it('Exports CSV with all fields when using defaults', async () => {
        const {
          status: resStatus,
          text: resText,
          type: resType,
        } = await generateAPI.getCSVFromSearchSource(
          getMockJobParams({
            searchSource: {
              query: { query: '', language: 'kuery' },
              index: '5193f870-d861-11e9-a311-0fa548c5f953',
              sort: [{ order_date: 'desc' }],
              fields: ['*'],
              filter: [],
              parent: {
                query: { language: 'kuery', query: '' },
                filter: [],
                parent: {
                  filter: [
                    {
                      meta: { index: '5193f870-d861-11e9-a311-0fa548c5f953', params: {} },
                      range: {
                        order_date: {
                          gte: fromTime,
                          lte: toTime,
                          format: 'strict_date_optional_time',
                        },
                      },
                    },
                  ],
                },
              },
            },
            browserTimezone: 'UTC',
            title: 'testfooyu78yt90-',
          })
        );
        expect(resStatus).to.eql(200);
        expect(resType).to.eql('text/csv');
        expectSnapshot(resText).toMatch();
      });
    });
  });
}
