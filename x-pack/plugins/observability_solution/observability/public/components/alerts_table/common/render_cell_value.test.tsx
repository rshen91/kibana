/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { ALERT_STATUS, ALERT_STATUS_ACTIVE, ALERT_STATUS_RECOVERED } from '@kbn/rule-data-utils';
import { render } from '../../../utils/test_helper';
import { getRenderCellValue } from './render_cell_value';

interface AlertsTableRow {
  alertStatus: typeof ALERT_STATUS_ACTIVE | typeof ALERT_STATUS_RECOVERED;
}

describe('getRenderCellValue', () => {
  describe('when column is alert status', () => {
    it('should return an active indicator when alert status is active', async () => {
      const cell = render(
        getRenderCellValue({
          columnId: ALERT_STATUS,
          data: makeAlertsTableRow({ alertStatus: ALERT_STATUS_ACTIVE }),
        })
      );

      expect(cell.getByText('Active')).toBeInTheDocument();
    });

    it('should return a recovered indicator when alert status is recovered', async () => {
      const cell = render(
        getRenderCellValue({
          columnId: ALERT_STATUS,
          data: makeAlertsTableRow({ alertStatus: ALERT_STATUS_RECOVERED }),
        })
      );

      expect(cell.getByText('Recovered')).toBeInTheDocument();
    });
  });
});

function makeAlertsTableRow({ alertStatus }: AlertsTableRow) {
  return [
    {
      field: ALERT_STATUS,
      value: [alertStatus],
    },
  ];
}
