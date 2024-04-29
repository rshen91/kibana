/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import { kibanaResponseFactory } from '@kbn/core/server';
import type { RequestHandler } from '@kbn/core/server';
import type { CustomRequestHandlerMock, ScopedClusterClientMock } from '@kbn/core/server/mocks';
import { coreMock, httpServerMock } from '@kbn/core/server/mocks';
import { licensingMock } from '@kbn/licensing-plugin/server/mocks';
import type { DeeplyMockedKeys } from '@kbn/utility-types-jest';

import { defineValidPermissionRoutes } from './check_permissions';
import type { InternalAuthenticationServiceStart } from '../../authentication';
import { authenticationServiceMock } from '../../authentication/authentication_service.mock';
import { routeDefinitionParamsMock } from '../index.mock';
describe('Valid API Keys route', () => {
  let routeHandler: RequestHandler<any, any, any, any>;
  let authc: DeeplyMockedKeys<InternalAuthenticationServiceStart>;
  let esClientMock: ScopedClusterClientMock;
  let mockContext: CustomRequestHandlerMock<unknown>;

  beforeEach(async () => {
    const mockRouteDefinitionParams = routeDefinitionParamsMock.create();
    authc = authenticationServiceMock.createStart();
    mockRouteDefinitionParams.getAuthenticationService.mockReturnValue(authc);
    defineValidPermissionRoutes(mockRouteDefinitionParams);
    [[, routeHandler]] = mockRouteDefinitionParams.router.get.mock.calls;
    mockContext = coreMock.createCustomRequestHandlerContext({
      core: coreMock.createRequestHandlerContext(),
      licensing: licensingMock.createRequestHandlerContext(),
    });

    esClientMock = (await mockContext.core).elasticsearch.client;

    authc.apiKeys.areAPIKeysEnabled.mockResolvedValue(true);
    authc.apiKeys.areCrossClusterAPIKeysEnabled.mockResolvedValue(true);
  });

  it('should show valid keys with own api key permission', async () => {
    esClientMock.asCurrentUser.security.hasPrivileges.mockResponse({
      cluster: {
        manage_own_api_key: true,
      },
    } as any);

    esClientMock.asCurrentUser.security.getApiKey.mockResponse({
      api_keys: [{ id: '123' }],
    } as any);

    const response = await routeHandler(
      mockContext,
      httpServerMock.createKibanaRequest(),
      kibanaResponseFactory
    );
    expect(response.status).toBe(200);
    expect(response.payload.apiKeys).toContainEqual({ id: '123', name: '123' });
  });

  it('should not show valid keys without own api key permission', async () => {
    esClientMock.asCurrentUser.security.hasPrivileges.mockResponse({
      cluster: {
        manage_own_api_key: false,
      },
    } as any);

    esClientMock.asCurrentUser.security.getApiKey.mockResponse({
      api_keys: [{ id: '123' }],
    } as any);

    const response = await routeHandler(
      mockContext,
      httpServerMock.createKibanaRequest(),
      kibanaResponseFactory
    );
    expect(response.status).toBe(200);
    expect(response.payload.apiKeys).toContainEqual(undefined);
  });
  it('should return response from cache', async () => {
    esClientMock.asCurrentUser.security.hasPrivileges.mockResponse({
      cluster: {
        manage_own_api_key: true,
      },
    } as any);

    esClientMock.asCurrentUser.security.getApiKey.mockResponse({
      api_keys: [{ id: '456' }],
    } as any);

    const response = await routeHandler(
      mockContext,
      httpServerMock.createKibanaRequest({
        headers: {
          foo: 'bar',
        },
      }),
      kibanaResponseFactory
    );

    // Do the request once
    expect(response.status).toBe(200);
    expect(response.payload.apiKeys).toContainEqual({ id: '456', name: '456' });

    esClientMock.asCurrentUser.security.hasPrivileges.mockResponse({
      cluster: {
        manage_own_api_key: true,
      },
    } as any);

    esClientMock.asCurrentUser.security.getApiKey.mockResponse({
      api_keys: [{ id: '456' }],
    } as any);

    const response1 = await routeHandler(
      mockContext,
      httpServerMock.createKibanaRequest({
        headers: {
          foo: 'bar',
        },
      }),
      kibanaResponseFactory
    );

    // same headers expect the same keys
    expect(response1.payload.apiKeys).toContainEqual({ id: '456', name: '456' });
  });
});
