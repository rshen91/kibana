/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { PatternRollup } from '../../types';

/**
 * This `PatternRollup` containing the following indices:
 * ```
 * .ds-packetbeat-8.5.3-2023.02.04-000001
 * .ds-packetbeat-8.6.1-2023.02.04-000001
 *
 * ```
 * has no `results`, because the indices were NOT checked
 */
export const packetbeatNoResults: PatternRollup = {
  docsCount: 3258632,
  error: null,
  ilmExplain: {
    '.ds-packetbeat-8.6.1-2023.02.04-000001': {
      index: '.ds-packetbeat-8.6.1-2023.02.04-000001',
      managed: true,
      policy: 'packetbeat',
      phase: 'hot',
    },
    '.ds-packetbeat-8.5.3-2023.02.04-000001': {
      index: '.ds-packetbeat-8.5.3-2023.02.04-000001',
      managed: true,
      policy: 'packetbeat',
      phase: 'hot',
    },
  },
  ilmExplainPhaseCounts: {
    hot: 2,
    warm: 0,
    cold: 0,
    frozen: 0,
    unmanaged: 0,
  },
  indices: 2,
  pattern: 'packetbeat-*',
  results: undefined,
  sizeInBytes: 1096520898,
  stats: {
    '.ds-packetbeat-8.6.1-2023.02.04-000001': {
      uuid: 'x5Uuw4j4QM2YidHLNixCwg',
      health: 'yellow',
      primaries: {
        store: {
          size_in_bytes: 512194751,
          reserved_in_bytes: 0,
        },
      },
      status: 'open',
      total: {
        docs: {
          count: 1628343,
          deleted: 0,
        },
      },
    },
    '.ds-packetbeat-8.5.3-2023.02.04-000001': {
      uuid: 'we0vNWm2Q6iz6uHubyHS6Q',
      health: 'yellow',
      primaries: {
        store: {
          size_in_bytes: 584326147,
          reserved_in_bytes: 0,
        },
      },
      status: 'open',
      total: {
        docs: {
          count: 1630289,
          deleted: 0,
        },
      },
    },
  },
};

/**
 * This `PatternRollup` containing the following indices:
 * ```
 * .ds-packetbeat-8.5.3-2023.02.04-000001
 * .ds-packetbeat-8.6.1-2023.02.04-000001
 *
 * ```
 * has partial `results`, because:
 * 1) Errors occurred while checking the `.ds-packetbeat-8.5.3-2023.02.04-000001` index
 * 2) The `.ds-packetbeat-8.6.1-2023.02.04-000001` passed the check
 */
export const packetbeatWithSomeErrors: PatternRollup = {
  docsCount: 3258632,
  error: null,
  ilmExplain: {
    '.ds-packetbeat-8.6.1-2023.02.04-000001': {
      index: '.ds-packetbeat-8.6.1-2023.02.04-000001',
      managed: true,
      policy: 'packetbeat',
      phase: 'hot',
    },
    '.ds-packetbeat-8.5.3-2023.02.04-000001': {
      index: '.ds-packetbeat-8.5.3-2023.02.04-000001',
      managed: true,
      policy: 'packetbeat',
      phase: 'hot',
    },
  },
  ilmExplainPhaseCounts: {
    hot: 2,
    warm: 0,
    cold: 0,
    frozen: 0,
    unmanaged: 0,
  },
  indices: 2,
  pattern: 'packetbeat-*',
  results: {
    '.ds-packetbeat-8.5.3-2023.02.04-000001': {
      docsCount: 1630289,
      error:
        'Error loading mappings for .ds-packetbeat-8.5.3-2023.02.04-000001: Error: simulated error fetching index .ds-packetbeat-8.5.3-2023.02.04-000001',
      ilmPhase: 'hot',
      incompatible: undefined,
      indexName: '.ds-packetbeat-8.5.3-2023.02.04-000001',
      markdownComments: ['foo', 'bar', 'baz'],
      pattern: 'packetbeat-*',
    },
    '.ds-packetbeat-8.6.1-2023.02.04-000001': {
      docsCount: 1628343,
      error: null,
      ilmPhase: 'hot',
      incompatible: 0,
      indexName: '.ds-packetbeat-8.6.1-2023.02.04-000001',
      markdownComments: ['foo', 'bar', 'baz'],
      pattern: 'packetbeat-*',
    },
  },
  sizeInBytes: 1096520898,
  stats: {
    '.ds-packetbeat-8.6.1-2023.02.04-000001': {
      uuid: 'x5Uuw4j4QM2YidHLNixCwg',
      health: 'yellow',
      primaries: {
        store: {
          size_in_bytes: 512194751,
          reserved_in_bytes: 0,
        },
      },
      status: 'open',
      total: {
        docs: {
          count: 1628343,
          deleted: 0,
        },
      },
    },
    '.ds-packetbeat-8.5.3-2023.02.04-000001': {
      uuid: 'we0vNWm2Q6iz6uHubyHS6Q',
      health: 'yellow',
      primaries: {
        store: {
          size_in_bytes: 584326147,
          reserved_in_bytes: 0,
        },
      },
      status: 'open',
      total: {
        docs: {
          count: 1630289,
          deleted: 0,
        },
      },
    },
  },
};

export const mockPacketbeatPatternRollup: PatternRollup = {
  docsCount: 3258632,
  error: null,
  ilmExplain: {
    '.ds-packetbeat-8.6.1-2023.02.04-000001': {
      index: '.ds-packetbeat-8.6.1-2023.02.04-000001',
      managed: true,
      policy: 'packetbeat',
      index_creation_date_millis: 1675536751379,
      time_since_index_creation: '25.26d',
      lifecycle_date_millis: 1675536751379,
      age: '25.26d',
      phase: 'hot',
      phase_time_millis: 1675536751809,
      action: 'rollover',
      action_time_millis: 1675536751809,
      step: 'check-rollover-ready',
      step_time_millis: 1675536751809,
      phase_execution: {
        policy: 'packetbeat',
        version: 1,
        modified_date_in_millis: 1675536751205,
      },
    },
    '.ds-packetbeat-8.5.3-2023.02.04-000001': {
      index: '.ds-packetbeat-8.5.3-2023.02.04-000001',
      managed: true,
      policy: 'packetbeat',
      index_creation_date_millis: 1675536774084,
      time_since_index_creation: '25.26d',
      lifecycle_date_millis: 1675536774084,
      age: '25.26d',
      phase: 'hot',
      phase_time_millis: 1675536774416,
      action: 'rollover',
      action_time_millis: 1675536774416,
      step: 'check-rollover-ready',
      step_time_millis: 1675536774416,
      phase_execution: {
        policy: 'packetbeat',
        version: 1,
        modified_date_in_millis: 1675536751205,
      },
    },
  },
  ilmExplainPhaseCounts: {
    hot: 2,
    warm: 0,
    cold: 0,
    frozen: 0,
    unmanaged: 0,
  },
  indices: 2,
  pattern: 'packetbeat-*',
  results: undefined,
  sizeInBytes: 1464758182,
  stats: {
    '.ds-packetbeat-8.6.1-2023.02.04-000001': {
      uuid: 'x5Uuw4j4QM2YidHLNixCwg',
      health: 'yellow',
      status: 'open',
      primaries: {
        docs: {
          count: 1628343,
          deleted: 0,
        },
        shard_stats: {
          total_count: 1,
        },
        store: {
          size_in_bytes: 731583142,
          total_data_set_size_in_bytes: 731583142,
          reserved_in_bytes: 0,
        },
        indexing: {
          index_total: 0,
          index_time_in_millis: 0,
          index_current: 0,
          index_failed: 0,
          delete_total: 0,
          delete_time_in_millis: 0,
          delete_current: 0,
          noop_update_total: 0,
          is_throttled: false,
          throttle_time_in_millis: 0,
        },
        get: {
          total: 0,
          time_in_millis: 0,
          exists_total: 0,
          exists_time_in_millis: 0,
          missing_total: 0,
          missing_time_in_millis: 0,
          current: 0,
        },
        search: {
          open_contexts: 0,
          query_total: 120726,
          query_time_in_millis: 234865,
          query_current: 0,
          fetch_total: 109324,
          fetch_time_in_millis: 500584,
          fetch_current: 0,
          scroll_total: 10432,
          scroll_time_in_millis: 3874632,
          scroll_current: 0,
          suggest_total: 0,
          suggest_time_in_millis: 0,
          suggest_current: 0,
        },
        merges: {
          current: 0,
          current_docs: 0,
          current_size_in_bytes: 0,
          total: 0,
          total_time_in_millis: 0,
          total_docs: 0,
          total_size_in_bytes: 0,
          total_stopped_time_in_millis: 0,
          total_throttled_time_in_millis: 0,
          total_auto_throttle_in_bytes: 20971520,
        },
        refresh: {
          total: 2,
          total_time_in_millis: 0,
          external_total: 2,
          external_total_time_in_millis: 1,
          listeners: 0,
        },
        flush: {
          total: 1,
          periodic: 1,
          total_time_in_millis: 0,
        },
        warmer: {
          current: 0,
          total: 1,
          total_time_in_millis: 1,
        },
        query_cache: {
          memory_size_in_bytes: 8316098,
          total_count: 34248343,
          hit_count: 3138879,
          miss_count: 31109464,
          cache_size: 4585,
          cache_count: 4585,
          evictions: 0,
        },
        fielddata: {
          memory_size_in_bytes: 12424,
          evictions: 0,
        },
        completion: {
          size_in_bytes: 0,
        },
        segments: {
          count: 19,
          memory_in_bytes: 0,
          terms_memory_in_bytes: 0,
          stored_fields_memory_in_bytes: 0,
          term_vectors_memory_in_bytes: 0,
          norms_memory_in_bytes: 0,
          points_memory_in_bytes: 0,
          doc_values_memory_in_bytes: 0,
          index_writer_memory_in_bytes: 0,
          version_map_memory_in_bytes: 0,
          fixed_bit_set_memory_in_bytes: 304,
          max_unsafe_auto_id_timestamp: -1,
          file_sizes: {},
        },
        translog: {
          operations: 0,
          size_in_bytes: 55,
          uncommitted_operations: 0,
          uncommitted_size_in_bytes: 55,
          earliest_last_modified_age: 606298841,
        },
        request_cache: {
          memory_size_in_bytes: 89216,
          evictions: 0,
          hit_count: 704,
          miss_count: 38,
        },
        recovery: {
          current_as_source: 0,
          current_as_target: 0,
          throttle_time_in_millis: 0,
        },
        bulk: {
          total_operations: 0,
          total_time_in_millis: 0,
          total_size_in_bytes: 0,
          avg_time_in_millis: 0,
          avg_size_in_bytes: 0,
        },
      },
      total: {
        docs: {
          count: 1628343,
          deleted: 0,
        },
        shard_stats: {
          total_count: 1,
        },
        store: {
          size_in_bytes: 731583142,
          total_data_set_size_in_bytes: 731583142,
          reserved_in_bytes: 0,
        },
        indexing: {
          index_total: 0,
          index_time_in_millis: 0,
          index_current: 0,
          index_failed: 0,
          delete_total: 0,
          delete_time_in_millis: 0,
          delete_current: 0,
          noop_update_total: 0,
          is_throttled: false,
          throttle_time_in_millis: 0,
        },
        get: {
          total: 0,
          time_in_millis: 0,
          exists_total: 0,
          exists_time_in_millis: 0,
          missing_total: 0,
          missing_time_in_millis: 0,
          current: 0,
        },
        search: {
          open_contexts: 0,
          query_total: 120726,
          query_time_in_millis: 234865,
          query_current: 0,
          fetch_total: 109324,
          fetch_time_in_millis: 500584,
          fetch_current: 0,
          scroll_total: 10432,
          scroll_time_in_millis: 3874632,
          scroll_current: 0,
          suggest_total: 0,
          suggest_time_in_millis: 0,
          suggest_current: 0,
        },
        merges: {
          current: 0,
          current_docs: 0,
          current_size_in_bytes: 0,
          total: 0,
          total_time_in_millis: 0,
          total_docs: 0,
          total_size_in_bytes: 0,
          total_stopped_time_in_millis: 0,
          total_throttled_time_in_millis: 0,
          total_auto_throttle_in_bytes: 20971520,
        },
        refresh: {
          total: 2,
          total_time_in_millis: 0,
          external_total: 2,
          external_total_time_in_millis: 1,
          listeners: 0,
        },
        flush: {
          total: 1,
          periodic: 1,
          total_time_in_millis: 0,
        },
        warmer: {
          current: 0,
          total: 1,
          total_time_in_millis: 1,
        },
        query_cache: {
          memory_size_in_bytes: 8316098,
          total_count: 34248343,
          hit_count: 3138879,
          miss_count: 31109464,
          cache_size: 4585,
          cache_count: 4585,
          evictions: 0,
        },
        fielddata: {
          memory_size_in_bytes: 12424,
          evictions: 0,
        },
        completion: {
          size_in_bytes: 0,
        },
        segments: {
          count: 19,
          memory_in_bytes: 0,
          terms_memory_in_bytes: 0,
          stored_fields_memory_in_bytes: 0,
          term_vectors_memory_in_bytes: 0,
          norms_memory_in_bytes: 0,
          points_memory_in_bytes: 0,
          doc_values_memory_in_bytes: 0,
          index_writer_memory_in_bytes: 0,
          version_map_memory_in_bytes: 0,
          fixed_bit_set_memory_in_bytes: 304,
          max_unsafe_auto_id_timestamp: -1,
          file_sizes: {},
        },
        translog: {
          operations: 0,
          size_in_bytes: 55,
          uncommitted_operations: 0,
          uncommitted_size_in_bytes: 55,
          earliest_last_modified_age: 606298841,
        },
        request_cache: {
          memory_size_in_bytes: 89216,
          evictions: 0,
          hit_count: 704,
          miss_count: 38,
        },
        recovery: {
          current_as_source: 0,
          current_as_target: 0,
          throttle_time_in_millis: 0,
        },
        bulk: {
          total_operations: 0,
          total_time_in_millis: 0,
          total_size_in_bytes: 0,
          avg_time_in_millis: 0,
          avg_size_in_bytes: 0,
        },
      },
    },
    '.ds-packetbeat-8.5.3-2023.02.04-000001': {
      uuid: 'we0vNWm2Q6iz6uHubyHS6Q',
      health: 'yellow',
      status: 'open',
      primaries: {
        docs: {
          count: 1630289,
          deleted: 0,
        },
        shard_stats: {
          total_count: 1,
        },
        store: {
          size_in_bytes: 733175040,
          total_data_set_size_in_bytes: 733175040,
          reserved_in_bytes: 0,
        },
        indexing: {
          index_total: 0,
          index_time_in_millis: 0,
          index_current: 0,
          index_failed: 0,
          delete_total: 0,
          delete_time_in_millis: 0,
          delete_current: 0,
          noop_update_total: 0,
          is_throttled: false,
          throttle_time_in_millis: 0,
        },
        get: {
          total: 0,
          time_in_millis: 0,
          exists_total: 0,
          exists_time_in_millis: 0,
          missing_total: 0,
          missing_time_in_millis: 0,
          current: 0,
        },
        search: {
          open_contexts: 0,
          query_total: 120726,
          query_time_in_millis: 248138,
          query_current: 0,
          fetch_total: 109484,
          fetch_time_in_millis: 500514,
          fetch_current: 0,
          scroll_total: 10432,
          scroll_time_in_millis: 3871379,
          scroll_current: 0,
          suggest_total: 0,
          suggest_time_in_millis: 0,
          suggest_current: 0,
        },
        merges: {
          current: 0,
          current_docs: 0,
          current_size_in_bytes: 0,
          total: 0,
          total_time_in_millis: 0,
          total_docs: 0,
          total_size_in_bytes: 0,
          total_stopped_time_in_millis: 0,
          total_throttled_time_in_millis: 0,
          total_auto_throttle_in_bytes: 20971520,
        },
        refresh: {
          total: 2,
          total_time_in_millis: 0,
          external_total: 2,
          external_total_time_in_millis: 2,
          listeners: 0,
        },
        flush: {
          total: 1,
          periodic: 1,
          total_time_in_millis: 0,
        },
        warmer: {
          current: 0,
          total: 1,
          total_time_in_millis: 1,
        },
        query_cache: {
          memory_size_in_bytes: 5387543,
          total_count: 24212135,
          hit_count: 2223357,
          miss_count: 21988778,
          cache_size: 3275,
          cache_count: 3275,
          evictions: 0,
        },
        fielddata: {
          memory_size_in_bytes: 12336,
          evictions: 0,
        },
        completion: {
          size_in_bytes: 0,
        },
        segments: {
          count: 20,
          memory_in_bytes: 0,
          terms_memory_in_bytes: 0,
          stored_fields_memory_in_bytes: 0,
          term_vectors_memory_in_bytes: 0,
          norms_memory_in_bytes: 0,
          points_memory_in_bytes: 0,
          doc_values_memory_in_bytes: 0,
          index_writer_memory_in_bytes: 0,
          version_map_memory_in_bytes: 0,
          fixed_bit_set_memory_in_bytes: 320,
          max_unsafe_auto_id_timestamp: -1,
          file_sizes: {},
        },
        translog: {
          operations: 0,
          size_in_bytes: 55,
          uncommitted_operations: 0,
          uncommitted_size_in_bytes: 55,
          earliest_last_modified_age: 606298805,
        },
        request_cache: {
          memory_size_in_bytes: 89320,
          evictions: 0,
          hit_count: 704,
          miss_count: 38,
        },
        recovery: {
          current_as_source: 0,
          current_as_target: 0,
          throttle_time_in_millis: 0,
        },
        bulk: {
          total_operations: 0,
          total_time_in_millis: 0,
          total_size_in_bytes: 0,
          avg_time_in_millis: 0,
          avg_size_in_bytes: 0,
        },
      },
      total: {
        docs: {
          count: 1630289,
          deleted: 0,
        },
        shard_stats: {
          total_count: 1,
        },
        store: {
          size_in_bytes: 733175040,
          total_data_set_size_in_bytes: 733175040,
          reserved_in_bytes: 0,
        },
        indexing: {
          index_total: 0,
          index_time_in_millis: 0,
          index_current: 0,
          index_failed: 0,
          delete_total: 0,
          delete_time_in_millis: 0,
          delete_current: 0,
          noop_update_total: 0,
          is_throttled: false,
          throttle_time_in_millis: 0,
        },
        get: {
          total: 0,
          time_in_millis: 0,
          exists_total: 0,
          exists_time_in_millis: 0,
          missing_total: 0,
          missing_time_in_millis: 0,
          current: 0,
        },
        search: {
          open_contexts: 0,
          query_total: 120726,
          query_time_in_millis: 248138,
          query_current: 0,
          fetch_total: 109484,
          fetch_time_in_millis: 500514,
          fetch_current: 0,
          scroll_total: 10432,
          scroll_time_in_millis: 3871379,
          scroll_current: 0,
          suggest_total: 0,
          suggest_time_in_millis: 0,
          suggest_current: 0,
        },
        merges: {
          current: 0,
          current_docs: 0,
          current_size_in_bytes: 0,
          total: 0,
          total_time_in_millis: 0,
          total_docs: 0,
          total_size_in_bytes: 0,
          total_stopped_time_in_millis: 0,
          total_throttled_time_in_millis: 0,
          total_auto_throttle_in_bytes: 20971520,
        },
        refresh: {
          total: 2,
          total_time_in_millis: 0,
          external_total: 2,
          external_total_time_in_millis: 2,
          listeners: 0,
        },
        flush: {
          total: 1,
          periodic: 1,
          total_time_in_millis: 0,
        },
        warmer: {
          current: 0,
          total: 1,
          total_time_in_millis: 1,
        },
        query_cache: {
          memory_size_in_bytes: 5387543,
          total_count: 24212135,
          hit_count: 2223357,
          miss_count: 21988778,
          cache_size: 3275,
          cache_count: 3275,
          evictions: 0,
        },
        fielddata: {
          memory_size_in_bytes: 12336,
          evictions: 0,
        },
        completion: {
          size_in_bytes: 0,
        },
        segments: {
          count: 20,
          memory_in_bytes: 0,
          terms_memory_in_bytes: 0,
          stored_fields_memory_in_bytes: 0,
          term_vectors_memory_in_bytes: 0,
          norms_memory_in_bytes: 0,
          points_memory_in_bytes: 0,
          doc_values_memory_in_bytes: 0,
          index_writer_memory_in_bytes: 0,
          version_map_memory_in_bytes: 0,
          fixed_bit_set_memory_in_bytes: 320,
          max_unsafe_auto_id_timestamp: -1,
          file_sizes: {},
        },
        translog: {
          operations: 0,
          size_in_bytes: 55,
          uncommitted_operations: 0,
          uncommitted_size_in_bytes: 55,
          earliest_last_modified_age: 606298805,
        },
        request_cache: {
          memory_size_in_bytes: 89320,
          evictions: 0,
          hit_count: 704,
          miss_count: 38,
        },
        recovery: {
          current_as_source: 0,
          current_as_target: 0,
          throttle_time_in_millis: 0,
        },
        bulk: {
          total_operations: 0,
          total_time_in_millis: 0,
          total_size_in_bytes: 0,
          avg_time_in_millis: 0,
          avg_size_in_bytes: 0,
        },
      },
    },
  },
};
