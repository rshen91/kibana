/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { generateShortId } from '@kbn/apm-synthtrace-client';
import { ELASTIC_AGENT_NAMES } from '@kbn/elastic-agent-utils';
import { faker } from '@faker-js/faker';
import { randomInt } from 'crypto';
import moment from 'moment';
import { getAtIndexOrRandom } from './get_at_index_or_random';

const {
  internet: { ipv4, userAgent, httpMethod, httpStatusCode },
  word: { noun, verb },
} = faker;

// Arrays for data
const LOG_LEVELS: string[] = ['FATAL', 'ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE'];

const JAVA_LOG_MESSAGES = [
  '[main] com.example1.core.ApplicationCore - Critical failure: NullPointerException encountered during startup',
  '[main] com.example.service.UserService - User registration completed for userId: 12345',
  '[main] com.example3.util.JsonParser - Parsing JSON response from external API',
  '[main] com.example4.security.AuthManager - Unauthorized access attempt detected for userId: 67890',
  '[main] com.example5.dao.UserDao - Database query failed: java.sql.SQLException: Timeout expired',
];

const IP_ADDRESSES = [
  '223.72.43.22',
  '20.24.184.101',
  '178.173.228.103',
  '147.161.184.179',
  '34.136.92.88',
];

const GEO_COORDINATES = [
  [116.3861, 39.9143],
  [103.8554, 1.3036],
  [139.7425, 35.6164],
  [2.4075, 48.8323],
  [-95.8517, 41.2591],
];

const CLOUD_PROVIDERS = ['gcp', 'aws', 'azure'];
const CLOUD_REGION = ['eu-central-1', 'us-east-1', 'area-51'];

const CLUSTER = [
  { clusterId: generateShortId(), clusterName: 'synth-cluster-1', namespace: 'default' },
  { clusterId: generateShortId(), clusterName: 'synth-cluster-2', namespace: 'production' },
  { clusterId: generateShortId(), clusterName: 'synth-cluster-3', namespace: 'kube' },
];

const SERVICE_NAMES = Array(3)
  .fill(null)
  .map((_, idx) => `synth-service-${idx}`);

export const MORE_THAN_1024_CHARS =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?';

// Functions to get random elements
export const getCluster = (index?: number) => getAtIndexOrRandom(CLUSTER, index);
export const getIpAddress = (index?: number) => getAtIndexOrRandom(IP_ADDRESSES, index);
export const getGeoCoordinate = (index?: number) => getAtIndexOrRandom(GEO_COORDINATES, index);
export const getCloudProvider = (index?: number) => getAtIndexOrRandom(CLOUD_PROVIDERS, index);
export const getCloudRegion = (index?: number) => getAtIndexOrRandom(CLOUD_REGION, index);
export const getServiceName = (index?: number) => getAtIndexOrRandom(SERVICE_NAMES, index);
export const getAgentName = (index?: number) => getAtIndexOrRandom(ELASTIC_AGENT_NAMES, index);

export const getJavaLog = () =>
  `${moment().format('YYYY-MM-DD HH:mm:ss,SSS')} ${getAtIndexOrRandom(
    LOG_LEVELS
  )} ${getAtIndexOrRandom(JAVA_LOG_MESSAGES)}`;

export const getWebLog = () => {
  const path = `/api/${noun()}/${verb()}`;
  const bytes = randomInt(100, 4000);

  return `${ipv4()} - - [${moment().toISOString()}] "${httpMethod()} ${path} HTTP/1.1" ${httpStatusCode()} ${bytes} "-" "${userAgent()}"`;
};
