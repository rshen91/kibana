/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const HELP_CENTER_ES_HOME = 'elasticsearch/what-is-elasticsearch-serverless';
const HELP_CENTER_CONSOLE = 'devtools/run-api-requests-in-the-console';
const HELP_CENTER_SEARCH_PROFILER = 'devtools/profile-queries-and-aggregations';
const HELP_CENTER_GROK = 'devtools/debug-grok-expressions';
const HELP_CENTER_CONNECTORS = 'elasticsearch/ingest-data-through-integrations-connector-client';
const HELP_CENTER_CONNECTOR_CLIENT = '/elasticsearch/setup-connector-client';
const HELP_CENTER_ES_DIAGNOSE_AND_DEBUG = '/elasticsearch/devtools/search-profiler/overview';
const HELP_CENTER_ES_DISCOVER = '/elasticsearch/discover';
const HELP_CENTER_ES_INDEX_MAPPING = '/elasticsearch/index-management/index-mapping';
const HELP_CENTER_ES_KIBANA_SEARCH = '/elasticsearch/search';
const HELP_CENTER_ES_PREPROCESS_DATA =
  '/elasticsearch/project-settings/preprocess-data-before-indexing';
const HELP_CENTER_QUERY_CLUSTER_WITH_CONSOLE =
  '/elasticsearch/devtools/console/query-cluster-with-console';
// const HELP_CENTER_FIND_APPS_AND_OBJECTS = '';
// const HELP_CENTER_INDEX_MAPPING = '';

// Observability specific
const HELP_CENTER_CREATE_SLO = '/observability/create-an-slo';
const HELP_CENTER_OBS_DIAGNOSE_AND_DEBUG = '/observability/devtools/search-profiler/overview';
const HELP_CENTER_OBS_DISCOVER = '/observability/discover';
const HELP_CENTER_OBS_INDEX_MAPPING = '/observability/index-management/index-mapping';
const HELP_CENTER_OBS_KIBANA_SEARCH = '/observability/search';
const HELP_CENTER_OBS_PREPROCESS_DATA =
  '/observability/project-settings/preprocess-data-before-indexing';
const HELP_CENTER_OBS_QUERY_CLUSTER_WITH_CONSOLE =
  '/observability/devtools/console/query-cluster-with-console';
// const HELP_CENTER_PREPROCESS_DATA = '';
// const HELP_CENTER_SEARCH_PROFILER_BASICS = '';

// Security specific
const HELP_CENTER_SEC_DIAGNOSE_AND_DEBUG = '/security/devtools/search-profiler/overview';
const HELP_CENTER_SEC_DISCOVER = '/security/discover';
const HELP_CENTER_SEC_INDEX_MAPPING = '/security/index-management/index-mapping';
const HELP_CENTER_SEC_KIBANA_SEARCH = '/security/search';
const HELP_CENTER_SEC_NAV_AND_INTERACT_WITH_SECURITY = '/security/interact-with-ui';
const HELP_CENTER_SEC_PREPROCESS_DATA =
  '/security/project-settings/preprocess-data-before-indexing';
const HELP_CENTER_SEC_QUERY_CLUSTER_WITH_CONSOLE =
  '/security/devtools/console/query-cluster-with-console';
// const HELP_CENTER_ = '';
const HELP_CENTER_API_KEYS = '/serverless/api-keys';

const createItem = (name: string, hostPath?: string | RegExp) => ({
  name,
  path: name,
  hostPath,
  popup: { width: 600, height: 800 },
});

export const helpTopics = {
  [HELP_CENTER_ES_HOME]: createItem(HELP_CENTER_ES_HOME),
  [HELP_CENTER_CONSOLE]: createItem(HELP_CENTER_CONSOLE, '/console'),
  [HELP_CENTER_SEARCH_PROFILER]: createItem(HELP_CENTER_SEARCH_PROFILER, '/searchprofiler'),
  [HELP_CENTER_GROK]: createItem(HELP_CENTER_GROK, '/grokdebugger'),
  [HELP_CENTER_CONNECTORS]: createItem(HELP_CENTER_CONNECTORS, '/connectors'),
  [HELP_CENTER_CONNECTOR_CLIENT]: createItem(
    HELP_CENTER_CONNECTOR_CLIENT,
    '/elasticsearch/setup-connector-client'
  ),
  [HELP_CENTER_CREATE_SLO]: createItem(HELP_CENTER_CREATE_SLO, '/observability/create-an-slo'),
  [HELP_CENTER_ES_DIAGNOSE_AND_DEBUG]: createItem(
    HELP_CENTER_ES_DIAGNOSE_AND_DEBUG,
    '/elasticsearch/devtools/search-profiler/overview'
  ),
  [HELP_CENTER_ES_DISCOVER]: createItem(HELP_CENTER_ES_DISCOVER, '/elasticsearch/discover'),
  [HELP_CENTER_ES_INDEX_MAPPING]: createItem(
    HELP_CENTER_ES_INDEX_MAPPING,
    '/elasticsearch/index-management/index-mapping'
  ),
  [HELP_CENTER_ES_KIBANA_SEARCH]: createItem(HELP_CENTER_ES_KIBANA_SEARCH, '/elasticsearch/search'),
  [HELP_CENTER_ES_PREPROCESS_DATA]: createItem(
    HELP_CENTER_ES_PREPROCESS_DATA,
    '/elasticsearch/project-settings/preprocess-data-before-indexing'
  ),
  [HELP_CENTER_QUERY_CLUSTER_WITH_CONSOLE]: createItem(
    HELP_CENTER_QUERY_CLUSTER_WITH_CONSOLE,
    '/elasticsearch/devtools/console/query-cluster-with-console'
  ),
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
  [HELP_CENTER_SEC_DIAGNOSE_AND_DEBUG]: createItem(
    HELP_CENTER_SEC_DIAGNOSE_AND_DEBUG,
    '/security/devtools/search-profiler/overview'
  ),
  [HELP_CENTER_SEC_DISCOVER]: createItem(HELP_CENTER_SEC_DISCOVER, '/security/discover'),
  [HELP_CENTER_SEC_INDEX_MAPPING]: createItem(
    HELP_CENTER_SEC_INDEX_MAPPING,
    '/security/index-management/index-mapping'
  ),
  [HELP_CENTER_SEC_KIBANA_SEARCH]: createItem(HELP_CENTER_SEC_KIBANA_SEARCH, '/security/search'),
  [HELP_CENTER_SEC_NAV_AND_INTERACT_WITH_SECURITY]: createItem(
    HELP_CENTER_SEC_NAV_AND_INTERACT_WITH_SECURITY,
    '/security/interact-with-ui'
  ),
  [HELP_CENTER_SEC_PREPROCESS_DATA]: createItem(
    HELP_CENTER_SEC_PREPROCESS_DATA,
    '/security/project-settings/preprocess-data-before-indexing'
  ),
  [HELP_CENTER_SEC_QUERY_CLUSTER_WITH_CONSOLE]: createItem(
    HELP_CENTER_SEC_QUERY_CLUSTER_WITH_CONSOLE,
    '/security/devtools/console/query-cluster-with-console'
  ),
  [HELP_CENTER_API_KEYS]: createItem(HELP_CENTER_API_KEYS, 'serverless/api_keys'),
};
