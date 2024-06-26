/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const HELP_CENTER_CREATE_SLO = '/observability/create-an-slo';
const HELP_CENTER_OBS_DIAGNOSE_AND_DEBUG = '/observability/devtools/search-profiler/overview';
const HELP_CENTER_OBS_DISCOVER = '/observability/discover';
const HELP_CENTER_OBS_INDEX_MAPPING = '/observability/index-management/index-mapping';
const HELP_CENTER_OBS_KIBANA_SEARCH = '/observability/search';
const HELP_CENTER_OBS_PREPROCESS_DATA =
  '/observability/project-settings/preprocess-data-before-indexing';
const HELP_CENTER_OBS_QUERY_CLUSTER_WITH_CONSOLE =
  '/observability/devtools/console/query-cluster-with-console';
const HELP_CENTER_API_KEYS = '/serverless/api-keys';

const createItem = (name: string, hostPath?: string | RegExp) => ({
  name,
  path: name,
  hostPath,
  popup: { width: 600, height: 800 },
});

export const helpTopics = {
  [HELP_CENTER_CREATE_SLO]: createItem(HELP_CENTER_CREATE_SLO, '/observability/create-an-slo'),
  [HELP_CENTER_OBS_DIAGNOSE_AND_DEBUG]: createItem(
    HELP_CENTER_OBS_DIAGNOSE_AND_DEBUG,
    '/observability/devtools/search-profiler/overview'
  ),
  [HELP_CENTER_OBS_DISCOVER]: createItem(HELP_CENTER_OBS_DISCOVER, '/observability/discover'),
  [HELP_CENTER_OBS_INDEX_MAPPING]: createItem(
    HELP_CENTER_OBS_INDEX_MAPPING,
    '/observability/index-management/index-mapping'
  ),
  [HELP_CENTER_OBS_KIBANA_SEARCH]: createItem(
    HELP_CENTER_OBS_KIBANA_SEARCH,
    '/observability/search'
  ),
  [HELP_CENTER_OBS_PREPROCESS_DATA]: createItem(
    HELP_CENTER_OBS_PREPROCESS_DATA,
    '/observability/project-settings/preprocess-data-before-indexing'
  ),
  [HELP_CENTER_OBS_QUERY_CLUSTER_WITH_CONSOLE]: createItem(
    HELP_CENTER_OBS_QUERY_CLUSTER_WITH_CONSOLE,
    '/observability/devtools/console/query-cluster-with-console'
  ),
  [HELP_CENTER_API_KEYS]: createItem(HELP_CENTER_API_KEYS, 'serverless/api_keys'),
};
