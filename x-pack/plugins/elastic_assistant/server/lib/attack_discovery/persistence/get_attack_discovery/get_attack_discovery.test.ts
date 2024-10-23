/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { elasticsearchServiceMock } from '@kbn/core-elasticsearch-server-mocks';
import { loggerMock } from '@kbn/logging-mocks';
import { getAttackDiscovery } from './get_attack_discovery';
import { getAttackDiscoverySearchEsMock } from '../../../../__mocks__/attack_discovery_schema.mock';
import { AuthenticatedUser } from '@kbn/core-security-common';

const mockEsClient = elasticsearchServiceMock.createElasticsearchClient();
const mockLogger = loggerMock.create();

const mockResponse = getAttackDiscoverySearchEsMock();

const user = {
  username: 'test_user',
  profile_uid: '1234',
  authentication_realm: {
    type: 'my_realm_type',
    name: 'my_realm_name',
  },
} as AuthenticatedUser;
const mockRequest = {
  esClient: mockEsClient,
  attackDiscoveryIndex: 'attack-discovery-index',
  id: 'discovery-id',
  user,
  logger: mockLogger,
};
describe('getAttackDiscovery', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get attack discovery by id successfully', async () => {
    mockEsClient.search.mockResolvedValueOnce(mockResponse);

    const response = await getAttackDiscovery(mockRequest);

    expect(response).not.toBeNull();
    expect(mockEsClient.search).toHaveBeenCalledTimes(1);
    expect(mockLogger.error).not.toHaveBeenCalled();
  });

  it('should return null if no attack discovery found', async () => {
    mockEsClient.search.mockResolvedValueOnce({ ...mockResponse, hits: { hits: [] } });

    const response = await getAttackDiscovery(mockRequest);

    expect(response).toBeNull();
    expect(mockEsClient.search).toHaveBeenCalledTimes(1);
    expect(mockLogger.error).not.toHaveBeenCalled();
  });

  it('should throw error on elasticsearch search failure', async () => {
    mockEsClient.search.mockRejectedValueOnce(new Error('Elasticsearch error'));

    await expect(getAttackDiscovery(mockRequest)).rejects.toThrowError('Elasticsearch error');

    expect(mockEsClient.search).toHaveBeenCalledTimes(1);
    expect(mockLogger.error).toHaveBeenCalledTimes(1);
  });
});
