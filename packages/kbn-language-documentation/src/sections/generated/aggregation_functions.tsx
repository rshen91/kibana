/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React from 'react';
import { i18n } from '@kbn/i18n';
import { Markdown } from '@kbn/shared-ux-markdown';

// DO NOT RENAME!
export const functions = {
  label: i18n.translate('languageDocumentation.documentationESQL.aggregationFunctions', {
    defaultMessage: 'Aggregation functions',
  }),
  description: i18n.translate(
    'languageDocumentation.documentationESQL.aggregationFunctionsDocumentationESQLDescription',
    {
      defaultMessage: `These functions can by used with STATS...BY:`,
    }
  ),
  // items are managed by scripts/generate_esql_docs.ts
  items: [
    // Do not edit manually... automatically generated by scripts/generate_esql_docs.ts
    {
      label: i18n.translate('languageDocumentation.documentationESQL.avg', {
        defaultMessage: 'AVG',
      }),
      preview: false,
      description: (
        <Markdown
          openLinksInNewTab
          readOnly
          enableSoftLineBreaks
          markdownContent={i18n.translate('languageDocumentation.documentationESQL.avg.markdown', {
            defaultMessage: `<!--
  This is generated by ESQL's AbstractFunctionTestCase. Do no edit it. See ../README.md for how to regenerate it.
  -->

  ### AVG
  The average of a numeric field.

  \`\`\`
  FROM employees
  | STATS AVG(height)
  \`\`\`
  `,
            description:
              'Text is in markdown. Do not translate function names, special characters, or field names like sum(bytes)',
            ignoreTag: true,
          })}
        />
      ),
    },
    // Do not edit manually... automatically generated by scripts/generate_esql_docs.ts
    {
      label: i18n.translate('languageDocumentation.documentationESQL.count', {
        defaultMessage: 'COUNT',
      }),
      preview: false,
      description: (
        <Markdown
          openLinksInNewTab
          readOnly
          enableSoftLineBreaks
          markdownContent={i18n.translate(
            'languageDocumentation.documentationESQL.count.markdown',
            {
              defaultMessage: `<!--
  This is generated by ESQL's AbstractFunctionTestCase. Do no edit it. See ../README.md for how to regenerate it.
  -->

  ### COUNT
  Returns the total number (count) of input values.

  \`\`\`
  FROM employees
  | STATS COUNT(height)
  \`\`\`
  `,
              description:
                'Text is in markdown. Do not translate function names, special characters, or field names like sum(bytes)',
              ignoreTag: true,
            }
          )}
        />
      ),
    },
    // Do not edit manually... automatically generated by scripts/generate_esql_docs.ts
    {
      label: i18n.translate('languageDocumentation.documentationESQL.count_distinct', {
        defaultMessage: 'COUNT_DISTINCT',
      }),
      preview: false,
      description: (
        <Markdown
          openLinksInNewTab
          readOnly
          enableSoftLineBreaks
          markdownContent={i18n.translate(
            'languageDocumentation.documentationESQL.count_distinct.markdown',
            {
              defaultMessage: `<!--
  This is generated by ESQL's AbstractFunctionTestCase. Do no edit it. See ../README.md for how to regenerate it.
  -->

  ### COUNT_DISTINCT
  Returns the approximate number of distinct values.

  \`\`\`
  FROM hosts
  | STATS COUNT_DISTINCT(ip0), COUNT_DISTINCT(ip1)
  \`\`\`
  `,
              description:
                'Text is in markdown. Do not translate function names, special characters, or field names like sum(bytes)',
              ignoreTag: true,
            }
          )}
        />
      ),
    },
    // Do not edit manually... automatically generated by scripts/generate_esql_docs.ts
    {
      label: i18n.translate('languageDocumentation.documentationESQL.max', {
        defaultMessage: 'MAX',
      }),
      preview: false,
      description: (
        <Markdown
          openLinksInNewTab
          readOnly
          enableSoftLineBreaks
          markdownContent={i18n.translate('languageDocumentation.documentationESQL.max.markdown', {
            defaultMessage: `<!--
  This is generated by ESQL's AbstractFunctionTestCase. Do no edit it. See ../README.md for how to regenerate it.
  -->

  ### MAX
  The maximum value of a field.

  \`\`\`
  FROM employees
  | STATS MAX(languages)
  \`\`\`
  `,
            description:
              'Text is in markdown. Do not translate function names, special characters, or field names like sum(bytes)',
            ignoreTag: true,
          })}
        />
      ),
    },
    // Do not edit manually... automatically generated by scripts/generate_esql_docs.ts
    {
      label: i18n.translate('languageDocumentation.documentationESQL.median', {
        defaultMessage: 'MEDIAN',
      }),
      preview: false,
      description: (
        <Markdown
          openLinksInNewTab
          readOnly
          enableSoftLineBreaks
          markdownContent={i18n.translate(
            'languageDocumentation.documentationESQL.median.markdown',
            {
              defaultMessage: `<!--
  This is generated by ESQL's AbstractFunctionTestCase. Do no edit it. See ../README.md for how to regenerate it.
  -->

  ### MEDIAN
  The value that is greater than half of all values and less than half of all values, also known as the 50% \`PERCENTILE\`.

  \`\`\`
  FROM employees
  | STATS MEDIAN(salary), PERCENTILE(salary, 50)
  \`\`\`
  Note: Like \`PERCENTILE\`, \`MEDIAN\` is usually approximate.
  `,
              description:
                'Text is in markdown. Do not translate function names, special characters, or field names like sum(bytes)',
              ignoreTag: true,
            }
          )}
        />
      ),
    },
    // Do not edit manually... automatically generated by scripts/generate_esql_docs.ts
    {
      label: i18n.translate('languageDocumentation.documentationESQL.median_absolute_deviation', {
        defaultMessage: 'MEDIAN_ABSOLUTE_DEVIATION',
      }),
      preview: false,
      description: (
        <Markdown
          openLinksInNewTab
          readOnly
          enableSoftLineBreaks
          markdownContent={i18n.translate(
            'languageDocumentation.documentationESQL.median_absolute_deviation.markdown',
            {
              defaultMessage: `<!--
  This is generated by ESQL's AbstractFunctionTestCase. Do no edit it. See ../README.md for how to regenerate it.
  -->

  ### MEDIAN_ABSOLUTE_DEVIATION
  Returns the median absolute deviation, a measure of variability. It is a robust statistic, meaning that it is useful for describing data that may have outliers, or may not be normally distributed. For such data it can be more descriptive than standard deviation.

  It is calculated as the median of each data point's deviation from the median of the entire sample. That is, for a random variable \`X\`, the median absolute deviation is \`median(|median(X) - X|)\`.

  \`\`\`
  FROM employees
  | STATS MEDIAN(salary), MEDIAN_ABSOLUTE_DEVIATION(salary)
  \`\`\`
  Note: Like \`PERCENTILE\`, \`MEDIAN_ABSOLUTE_DEVIATION\` is usually approximate.
  `,
              description:
                'Text is in markdown. Do not translate function names, special characters, or field names like sum(bytes)',
              ignoreTag: true,
            }
          )}
        />
      ),
    },
    // Do not edit manually... automatically generated by scripts/generate_esql_docs.ts
    {
      label: i18n.translate('languageDocumentation.documentationESQL.min', {
        defaultMessage: 'MIN',
      }),
      preview: false,
      description: (
        <Markdown
          openLinksInNewTab
          readOnly
          enableSoftLineBreaks
          markdownContent={i18n.translate('languageDocumentation.documentationESQL.min.markdown', {
            defaultMessage: `<!--
  This is generated by ESQL's AbstractFunctionTestCase. Do no edit it. See ../README.md for how to regenerate it.
  -->

  ### MIN
  The minimum value of a field.

  \`\`\`
  FROM employees
  | STATS MIN(languages)
  \`\`\`
  `,
            description:
              'Text is in markdown. Do not translate function names, special characters, or field names like sum(bytes)',
            ignoreTag: true,
          })}
        />
      ),
    },
    // Do not edit manually... automatically generated by scripts/generate_esql_docs.ts
    {
      label: i18n.translate('languageDocumentation.documentationESQL.percentile', {
        defaultMessage: 'PERCENTILE',
      }),
      preview: false,
      description: (
        <Markdown
          openLinksInNewTab
          readOnly
          enableSoftLineBreaks
          markdownContent={i18n.translate(
            'languageDocumentation.documentationESQL.percentile.markdown',
            {
              defaultMessage: `<!--
  This is generated by ESQL's AbstractFunctionTestCase. Do no edit it. See ../README.md for how to regenerate it.
  -->

  ### PERCENTILE
  Returns the value at which a certain percentage of observed values occur. For example, the 95th percentile is the value which is greater than 95% of the observed values and the 50th percentile is the \`MEDIAN\`.

  \`\`\`
  FROM employees
  | STATS p0 = PERCENTILE(salary,  0)
       , p50 = PERCENTILE(salary, 50)
       , p99 = PERCENTILE(salary, 99)
  \`\`\`
  `,
              description:
                'Text is in markdown. Do not translate function names, special characters, or field names like sum(bytes)',
              ignoreTag: true,
            }
          )}
        />
      ),
    },
    // Do not edit manually... automatically generated by scripts/generate_esql_docs.ts
    {
      label: i18n.translate('languageDocumentation.documentationESQL.st_centroid_agg', {
        defaultMessage: 'ST_CENTROID_AGG',
      }),
      preview: false,
      description: (
        <Markdown
          openLinksInNewTab
          readOnly
          enableSoftLineBreaks
          markdownContent={i18n.translate(
            'languageDocumentation.documentationESQL.st_centroid_agg.markdown',
            {
              defaultMessage: `<!--
  This is generated by ESQL's AbstractFunctionTestCase. Do no edit it. See ../README.md for how to regenerate it.
  -->

  ### ST_CENTROID_AGG
  Calculate the spatial centroid over a field with spatial point geometry type.

  \`\`\`
  FROM airports
  | STATS centroid=ST_CENTROID_AGG(location)
  \`\`\`
  `,
              description:
                'Text is in markdown. Do not translate function names, special characters, or field names like sum(bytes)',
              ignoreTag: true,
            }
          )}
        />
      ),
    },
    // Do not edit manually... automatically generated by scripts/generate_esql_docs.ts
    {
      label: i18n.translate('languageDocumentation.documentationESQL.sum', {
        defaultMessage: 'SUM',
      }),
      preview: false,
      description: (
        <Markdown
          openLinksInNewTab
          readOnly
          enableSoftLineBreaks
          markdownContent={i18n.translate('languageDocumentation.documentationESQL.sum.markdown', {
            defaultMessage: `<!--
  This is generated by ESQL's AbstractFunctionTestCase. Do no edit it. See ../README.md for how to regenerate it.
  -->

  ### SUM
  The sum of a numeric expression.

  \`\`\`
  FROM employees
  | STATS SUM(languages)
  \`\`\`
  `,
            description:
              'Text is in markdown. Do not translate function names, special characters, or field names like sum(bytes)',
            ignoreTag: true,
          })}
        />
      ),
    },
    // Do not edit manually... automatically generated by scripts/generate_esql_docs.ts
    {
      label: i18n.translate('languageDocumentation.documentationESQL.top', {
        defaultMessage: 'TOP',
      }),
      preview: false,
      description: (
        <Markdown
          openLinksInNewTab
          readOnly
          enableSoftLineBreaks
          markdownContent={i18n.translate('languageDocumentation.documentationESQL.top.markdown', {
            defaultMessage: `<!--
  This is generated by ESQL's AbstractFunctionTestCase. Do no edit it. See ../README.md for how to regenerate it.
  -->

  ### TOP
  Collects the top values for a field. Includes repeated values.

  \`\`\`
  FROM employees
  | STATS top_salaries = TOP(salary, 3, "desc"), top_salary = MAX(salary)
  \`\`\`
  `,
            description:
              'Text is in markdown. Do not translate function names, special characters, or field names like sum(bytes)',
            ignoreTag: true,
          })}
        />
      ),
    },
    // Do not edit manually... automatically generated by scripts/generate_esql_docs.ts
    {
      label: i18n.translate('languageDocumentation.documentationESQL.values', {
        defaultMessage: 'VALUES',
      }),
      preview: true,
      description: (
        <Markdown
          openLinksInNewTab
          readOnly
          enableSoftLineBreaks
          markdownContent={i18n.translate(
            'languageDocumentation.documentationESQL.values.markdown',
            {
              defaultMessage: `<!--
  This is generated by ESQL's AbstractFunctionTestCase. Do no edit it. See ../README.md for how to regenerate it.
  -->

  ### VALUES
  Returns all values in a group as a multivalued field. The order of the returned values isn't guaranteed. If you need the values returned in order use esql-mv_sort.

  \`\`\`
    FROM employees
  | EVAL first_letter = SUBSTRING(first_name, 0, 1)
  | STATS first_name=MV_SORT(VALUES(first_name)) BY first_letter
  | SORT first_letter
  \`\`\`
  `,
              description:
                'Text is in markdown. Do not translate function names, special characters, or field names like sum(bytes)',
              ignoreTag: true,
            }
          )}
        />
      ),
    },
    // Do not edit manually... automatically generated by scripts/generate_esql_docs.ts
    {
      label: i18n.translate('languageDocumentation.documentationESQL.weighted_avg', {
        defaultMessage: 'WEIGHTED_AVG',
      }),
      preview: false,
      description: (
        <Markdown
          openLinksInNewTab
          readOnly
          enableSoftLineBreaks
          markdownContent={i18n.translate(
            'languageDocumentation.documentationESQL.weighted_avg.markdown',
            {
              defaultMessage: `<!--
  This is generated by ESQL's AbstractFunctionTestCase. Do no edit it. See ../README.md for how to regenerate it.
  -->

  ### WEIGHTED_AVG
  The weighted average of a numeric expression.

  \`\`\`
  FROM employees
  | STATS w_avg = WEIGHTED_AVG(salary, height) by languages
  | EVAL w_avg = ROUND(w_avg)
  | KEEP w_avg, languages
  | SORT languages
  \`\`\`
  `,
              description:
                'Text is in markdown. Do not translate function names, special characters, or field names like sum(bytes)',
              ignoreTag: true,
            }
          )}
        />
      ),
    },
  ],
};
