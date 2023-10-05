/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { i18n } from '@kbn/i18n';
import { cloneDeep, uniq } from 'lodash';
import { IconChartBarHorizontal, IconChartBarStacked, IconChartMixedXy } from '@kbn/chart-icons';
import type { LayerType as XYLayerType } from '@kbn/expression-xy-plugin/common';
import { DatasourceLayers, OperationMetadata, VisualizationType } from '../../types';
import {
  State,
  visualizationTypes,
  XYState,
  XYAnnotationLayerConfig,
  XYLayerConfig,
  XYDataLayerConfig,
  XYReferenceLineLayerConfig,
  SeriesType,
  XYByReferenceAnnotationLayerConfig,
  XYPersistedAnnotationLayerConfig,
  XYPersistedByReferenceAnnotationLayerConfig,
  XYPersistedLinkedByValueAnnotationLayerConfig,
  XYPersistedLayerConfig,
  XYPersistedByValueAnnotationLayerConfig,
  XYByValueAnnotationLayerConfig,
} from './types';
import { isHorizontalChart } from './state_helpers';
import { layerTypes } from '../..';
import type { ExtraAppendLayerArg } from './visualization';

export function getAxisName(
  axis: 'x' | 'y' | 'yLeft' | 'yRight',
  { isHorizontal }: { isHorizontal: boolean }
) {
  const vertical = i18n.translate('xpack.lens.xyChart.verticalAxisLabel', {
    defaultMessage: 'Vertical axis',
  });
  const horizontal = i18n.translate('xpack.lens.xyChart.horizontalAxisLabel', {
    defaultMessage: 'Horizontal axis',
  });
  if (axis === 'x') {
    return isHorizontal ? vertical : horizontal;
  }
  if (axis === 'y') {
    return isHorizontal ? horizontal : vertical;
  }
  const verticalLeft = i18n.translate('xpack.lens.xyChart.verticalLeftAxisLabel', {
    defaultMessage: 'Vertical left axis',
  });
  const verticalRight = i18n.translate('xpack.lens.xyChart.verticalRightAxisLabel', {
    defaultMessage: 'Vertical right axis',
  });
  const horizontalTop = i18n.translate('xpack.lens.xyChart.horizontalLeftAxisLabel', {
    defaultMessage: 'Horizontal top axis',
  });
  const horizontalBottom = i18n.translate('xpack.lens.xyChart.horizontalRightAxisLabel', {
    defaultMessage: 'Horizontal bottom axis',
  });
  if (axis === 'yLeft') {
    return isHorizontal ? horizontalBottom : verticalLeft;
  }
  return isHorizontal ? horizontalTop : verticalRight;
}

// min requirement for the bug:
// * 2 or more layers
// * at least one with date histogram
// * at least one with interval function
export function checkXAccessorCompatibility(state: XYState, datasourceLayers: DatasourceLayers) {
  const dataLayers = getDataLayers(state.layers);
  const errors = [];
  const hasDateHistogramSetIndex = dataLayers.findIndex(
    checkScaleOperation('interval', 'date', datasourceLayers)
  );
  const hasNumberHistogramIndex = dataLayers.findIndex(
    checkScaleOperation('interval', 'number', datasourceLayers)
  );
  const hasOrdinalAxisIndex = dataLayers.findIndex(
    checkScaleOperation('ordinal', undefined, datasourceLayers)
  );
  if (state.layers.length > 1) {
    const erroredLayers = [hasDateHistogramSetIndex, hasNumberHistogramIndex, hasOrdinalAxisIndex]
      .filter((v) => v >= 0)
      .sort((a, b) => a - b);
    if (erroredLayers.length > 1) {
      const [firstLayer, ...otherLayers] = erroredLayers;
      const axis = getAxisName('x', { isHorizontal: isHorizontalChart(state.layers) });
      for (const otherLayer of otherLayers) {
        errors.push({
          shortMessage: i18n.translate('xpack.lens.xyVisualization.dataTypeFailureXShort', {
            defaultMessage: `Wrong data type for {axis}.`,
            values: {
              axis,
            },
          }),
          longMessage: i18n.translate('xpack.lens.xyVisualization.dataTypeFailureXLong', {
            defaultMessage: `The {axis} data in layer {firstLayer} is incompatible with the data in layer {secondLayer}. Select a new function for the {axis}.`,
            values: {
              axis,
              firstLayer: firstLayer + 1,
              secondLayer: otherLayer + 1,
            },
          }),
        });
      }
    }
  }
  return errors;
}

export function checkScaleOperation(
  scaleType: 'ordinal' | 'interval' | 'ratio',
  dataType: 'date' | 'number' | 'string' | undefined,
  datasourceLayers: DatasourceLayers
) {
  return (layer: XYDataLayerConfig) => {
    const datasourceAPI = datasourceLayers[layer.layerId];
    if (!layer.xAccessor) {
      return false;
    }
    const operation = datasourceAPI?.getOperationForColumnId(layer.xAccessor);
    return Boolean(
      operation && (!dataType || operation.dataType === dataType) && operation.scale === scaleType
    );
  };
}

export const isDataLayer = (layer: XYLayerConfig): layer is XYDataLayerConfig =>
  layer.layerType === layerTypes.DATA || !layer.layerType;

export const getDataLayers = (layers: XYLayerConfig[]) =>
  (layers || []).filter((layer): layer is XYDataLayerConfig => isDataLayer(layer));

export const getFirstDataLayer = (layers: XYLayerConfig[]) =>
  (layers || []).find((layer): layer is XYDataLayerConfig => isDataLayer(layer));

export const isReferenceLayer = (
  layer: Pick<XYLayerConfig, 'layerType'>
): layer is XYReferenceLineLayerConfig => layer.layerType === layerTypes.REFERENCELINE;

export const getReferenceLayers = (layers: Array<Pick<XYLayerConfig, 'layerType'>>) =>
  (layers || []).filter((layer): layer is XYReferenceLineLayerConfig => isReferenceLayer(layer));

export const isAnnotationsLayer = (
  layer: Pick<XYLayerConfig, 'layerType'>
): layer is XYAnnotationLayerConfig =>
  layer.layerType === layerTypes.ANNOTATIONS && 'indexPatternId' in layer;

export const isPersistedAnnotationsLayer = (
  layer: XYPersistedLayerConfig
): layer is XYPersistedAnnotationLayerConfig =>
  layer.layerType === layerTypes.ANNOTATIONS && !('indexPatternId' in layer);

export const isPersistedByValueAnnotationsLayer = (
  layer: XYPersistedLayerConfig
): layer is XYPersistedByValueAnnotationLayerConfig =>
  isPersistedAnnotationsLayer(layer) &&
  (layer.persistanceType === 'byValue' || !layer.persistanceType);

export const isByReferenceAnnotationsLayer = (
  layer: XYLayerConfig
): layer is XYByReferenceAnnotationLayerConfig =>
  'annotationGroupId' in layer && '__lastSaved' in layer;

export const isPersistedByReferenceAnnotationsLayer = (
  layer: XYPersistedAnnotationLayerConfig
): layer is XYPersistedByReferenceAnnotationLayerConfig =>
  isPersistedAnnotationsLayer(layer) && layer.persistanceType === 'byReference';

export const isPersistedLinkedByValueAnnotationsLayer = (
  layer: XYPersistedAnnotationLayerConfig
): layer is XYPersistedLinkedByValueAnnotationLayerConfig =>
  isPersistedAnnotationsLayer(layer) && layer.persistanceType === 'linked';

export const getAnnotationsLayers = (layers: Array<Pick<XYLayerConfig, 'layerType'>>) =>
  (layers || []).filter((layer): layer is XYAnnotationLayerConfig => isAnnotationsLayer(layer));

export const getGroupMetadataFromAnnotationLayer = (
  layer: XYAnnotationLayerConfig
): { title: string; description: string; tags: string[] } => {
  if (layer.cachedMetadata) {
    return layer.cachedMetadata;
  }
  if (isByReferenceAnnotationsLayer(layer)) {
    const { title, description, tags } = layer.__lastSaved;
    return { title, description, tags };
  }
  return { title: '', description: '', tags: [] };
};

export const getAnnotationLayerTitle = (layer: XYAnnotationLayerConfig): string => {
  return getGroupMetadataFromAnnotationLayer(layer).title;
};

export interface LayerTypeToLayer {
  [layerTypes.DATA]: (layer: XYDataLayerConfig) => XYDataLayerConfig;
  [layerTypes.REFERENCELINE]: (layer: XYReferenceLineLayerConfig) => XYReferenceLineLayerConfig;
  [layerTypes.ANNOTATIONS]: (layer: XYAnnotationLayerConfig) => XYAnnotationLayerConfig;
}

export const getLayerTypeOptions = (layer: XYLayerConfig, options: LayerTypeToLayer) => {
  if (isDataLayer(layer)) {
    return options[layerTypes.DATA](layer);
  } else if (isReferenceLayer(layer)) {
    return options[layerTypes.REFERENCELINE](layer);
  }
  return options[layerTypes.ANNOTATIONS](layer);
};

export function getVisualizationType(state: State): VisualizationType | 'mixed' {
  if (!state.layers.length) {
    return (
      visualizationTypes.find((t) => t.id === state.preferredSeriesType) ?? visualizationTypes[0]
    );
  }
  const dataLayers = getDataLayers(state?.layers);
  const visualizationType = visualizationTypes.find((t) => t.id === dataLayers?.[0].seriesType);
  const seriesTypes = uniq(dataLayers.map((l) => l.seriesType));

  return visualizationType && seriesTypes.length === 1 ? visualizationType : 'mixed';
}

export function getDescription(state?: State) {
  if (!state) {
    return {
      icon: defaultIcon,
      label: i18n.translate('xpack.lens.xyVisualization.xyLabel', {
        defaultMessage: 'XY',
      }),
    };
  }

  const visualizationType = getVisualizationType(state);

  if (visualizationType === 'mixed' && isHorizontalChart(state.layers)) {
    return {
      icon: IconChartBarHorizontal,
      label: i18n.translate('xpack.lens.xyVisualization.mixedBarHorizontalLabel', {
        defaultMessage: 'Mixed bar horizontal',
      }),
    };
  }

  if (visualizationType === 'mixed') {
    return {
      icon: IconChartMixedXy,
      label: i18n.translate('xpack.lens.xyVisualization.mixedLabel', {
        defaultMessage: 'Mixed XY',
      }),
    };
  }

  return {
    icon: visualizationType.icon || defaultIcon,
    label: visualizationType.fullLabel || visualizationType.label,
  };
}

export const defaultIcon = IconChartBarStacked;
export const defaultSeriesType = 'bar_stacked';

export const supportedDataLayer = {
  type: layerTypes.DATA,
  label: i18n.translate('xpack.lens.xyChart.addDataLayerLabel', {
    defaultMessage: 'Visualization',
  }),
  icon: IconChartMixedXy,
};

// i18n ids cannot be dynamically generated, hence the function below
export function getMessageIdsForDimension(
  dimension: string,
  layers: number[],
  isHorizontal: boolean
) {
  const layersList = layers.map((i: number) => i + 1).join(', ');
  switch (dimension) {
    case 'Break down':
      return {
        shortMessage: i18n.translate('xpack.lens.xyVisualization.dataFailureSplitShort', {
          defaultMessage: `Missing {axis}.`,
          values: { axis: 'Break down by axis' },
        }),
        longMessage: i18n.translate('xpack.lens.xyVisualization.dataFailureSplitLong', {
          defaultMessage: `{layers, plural, one {Layer} other {Layers}} {layersList} {layers, plural, one {requires} other {require}} a field for the {axis}.`,
          values: { layers: layers.length, layersList, axis: 'Break down by axis' },
        }),
      };
    case 'Y':
      return {
        shortMessage: i18n.translate('xpack.lens.xyVisualization.dataFailureYShort', {
          defaultMessage: `Missing {axis}.`,
          values: { axis: getAxisName('y', { isHorizontal }) },
        }),
        longMessage: i18n.translate('xpack.lens.xyVisualization.dataFailureYLong', {
          defaultMessage: `{layers, plural, one {Layer} other {Layers}} {layersList} {layers, plural, one {requires} other {require}} a field for the {axis}.`,
          values: { layers: layers.length, layersList, axis: getAxisName('y', { isHorizontal }) },
        }),
      };
  }
  return { shortMessage: '', longMessage: '' };
}

const newLayerFn = {
  [layerTypes.DATA]: ({
    layerId,
    seriesType,
  }: {
    layerId: string;
    seriesType: SeriesType;
  }): XYDataLayerConfig => ({
    layerId,
    layerType: layerTypes.DATA,
    accessors: [],
    seriesType,
  }),
  [layerTypes.REFERENCELINE]: ({ layerId }: { layerId: string }): XYReferenceLineLayerConfig => ({
    layerId,
    layerType: layerTypes.REFERENCELINE,
    accessors: [],
  }),
  [layerTypes.ANNOTATIONS]: ({
    layerId,
    indexPatternId,
    extraArg,
  }: {
    layerId: string;
    indexPatternId: string;
    extraArg: ExtraAppendLayerArg | undefined;
  }): XYAnnotationLayerConfig => {
    if (extraArg) {
      const { annotationGroupId, ...libraryGroupConfig } = extraArg;

      const newLayer: XYByReferenceAnnotationLayerConfig = {
        layerId,
        layerType: layerTypes.ANNOTATIONS,
        annotationGroupId,

        annotations: cloneDeep(libraryGroupConfig.annotations),
        indexPatternId: libraryGroupConfig.indexPatternId,
        ignoreGlobalFilters: libraryGroupConfig.ignoreGlobalFilters,
        __lastSaved: libraryGroupConfig,
      };

      return newLayer;
    }

    const newLayer: XYByValueAnnotationLayerConfig = {
      layerId,
      layerType: layerTypes.ANNOTATIONS,
      annotations: [],
      indexPatternId,
      ignoreGlobalFilters: true,
    };

    return newLayer;
  },
};

export function newLayerState({
  layerId,
  layerType = layerTypes.DATA,
  seriesType,
  indexPatternId,
  extraArg,
}: {
  layerId: string;
  layerType?: XYLayerType;
  seriesType: SeriesType;
  indexPatternId: string;
  extraArg?: ExtraAppendLayerArg;
}) {
  return newLayerFn[layerType]({ layerId, seriesType, indexPatternId, extraArg });
}

export function getLayersByType(state: State, byType?: string) {
  return state.layers.filter(({ layerType = layerTypes.DATA }) =>
    byType ? layerType === byType : true
  );
}

export function validateLayersForDimension(
  dimension: string,
  layers: XYDataLayerConfig[],
  missingCriteria: (layer: XYDataLayerConfig) => boolean
):
  | { valid: true }
  | {
      valid: false;
      payload: { shortMessage: string; longMessage: React.ReactNode };
    } {
  // Multiple layers must be consistent:
  // * either a dimension is missing in ALL of them
  // * or should not miss on any
  if (layers.every(missingCriteria) || !layers.some(missingCriteria)) {
    return { valid: true };
  }
  // otherwise it's an error and it has to be reported
  const layerMissingAccessors = layers.reduce((missing: number[], layer, i) => {
    if (missingCriteria(layer)) {
      missing.push(i);
    }
    return missing;
  }, []);

  return {
    valid: false,
    payload: getMessageIdsForDimension(dimension, layerMissingAccessors, isHorizontalChart(layers)),
  };
}

export const isNumericMetric = (op: OperationMetadata) =>
  !op.isBucketed && op.dataType === 'number';

export const isNumericDynamicMetric = (op: OperationMetadata) =>
  isNumericMetric(op) && !op.isStaticValue;
export const isBucketed = (op: OperationMetadata) => op.isBucketed;
