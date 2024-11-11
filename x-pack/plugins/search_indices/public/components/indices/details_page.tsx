/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import {
  EuiPageTemplate,
  EuiFlexItem,
  EuiFlexGroup,
  EuiButtonEmpty,
  EuiTabbedContent,
  EuiTabbedContentTab,
  useEuiTheme,
  EuiButton,
} from '@elastic/eui';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FormattedMessage } from '@kbn/i18n-react';
import { i18n } from '@kbn/i18n';
import { SectionLoading } from '@kbn/es-ui-shared-plugin/public';
import { ApiKeyForm } from '@kbn/search-api-keys-components';
import { useNavigateToDiscover } from '../../hooks/use_navigate_to_discover';
import { useIndex } from '../../hooks/api/use_index';
import { useKibana } from '../../hooks/use_kibana';
import { ConnectionDetails } from '../connection_details/connection_details';
import { QuickStats } from '../quick_stats/quick_stats';
import { useIndexMapping } from '../../hooks/api/use_index_mappings';
import { IndexDocuments } from '../index_documents/index_documents';
import { DeleteIndexModal } from './delete_index_modal';
import { IndexloadingError } from './details_page_loading_error';
import { SearchIndexDetailsTabs } from '../../routes';
import { SearchIndexDetailsMappings } from './details_page_mappings';
import { SearchIndexDetailsSettings } from './details_page_settings';
import { SearchIndexDetailsPageMenuItemPopover } from './details_page_menu_item';
import { useIndexDocumentSearch } from '../../hooks/api/use_document_search';
import { useUsageTracker } from '../../contexts/usage_tracker_context';
import { AnalyticsEvents } from '../../analytics/constants';
import { usePageChrome } from '../../hooks/use_page_chrome';
import { IndexManagementBreadcrumbs } from '../shared/breadcrumbs';

export const SearchIndexDetailsPage = () => {
  const indexName = decodeURIComponent(useParams<{ indexName: string }>().indexName);
  const tabId = decodeURIComponent(useParams<{ tabId: string }>().tabId);

  const { console: consolePlugin, docLinks, application, history, share } = useKibana().services;
  const {
    data: index,
    refetch,
    isError: isIndexError,
    isInitialLoading,
    error: indexLoadingError,
  } = useIndex(indexName);
  const {
    data: mappings,
    isError: isMappingsError,
    isInitialLoading: isMappingsInitialLoading,
    error: mappingsError,
  } = useIndexMapping(indexName);
  const { data: indexDocuments, isInitialLoading: indexDocumentsIsInitialLoading } =
    useIndexDocumentSearch(indexName);

  const navigateToPlayground = useCallback(async () => {
    const playgroundLocator = share.url.locators.get('PLAYGROUND_LOCATOR_ID');
    if (playgroundLocator && index) {
      await playgroundLocator.navigate({ 'default-index': index.name });
    }
  }, [share, index]);
  const navigateToDiscover = useNavigateToDiscover(indexName);

  const [hasDocuments, setHasDocuments] = useState<boolean>(false);
  const [isDocumentsLoading, setDocumentsLoading] = useState<boolean>(true);
  useEffect(() => {
    setDocumentsLoading(isInitialLoading);
    setHasDocuments(!(!isInitialLoading && indexDocuments?.results?.data.length === 0));
  }, [indexDocuments, isInitialLoading, setHasDocuments, setDocumentsLoading]);

  usePageChrome(indexName, [
    ...IndexManagementBreadcrumbs,
    {
      text: indexName,
    },
  ]);

  const usageTracker = useUsageTracker();

  const detailsPageTabs: EuiTabbedContentTab[] = useMemo(() => {
    return [
      {
        id: SearchIndexDetailsTabs.DATA,
        name: i18n.translate('xpack.searchIndices.documentsTabLabel', {
          defaultMessage: 'Data',
        }),
        content: (
          <IndexDocuments
            indexName={indexName}
            indexDocuments={indexDocuments}
            isInitialLoading={indexDocumentsIsInitialLoading}
          />
        ),
        'data-test-subj': `${SearchIndexDetailsTabs.DATA}Tab`,
      },
      {
        id: SearchIndexDetailsTabs.MAPPINGS,
        name: i18n.translate('xpack.searchIndices.mappingsTabLabel', {
          defaultMessage: 'Mappings',
        }),
        content: <SearchIndexDetailsMappings index={index} />,
        'data-test-subj': `${SearchIndexDetailsTabs.MAPPINGS}Tab`,
      },
      {
        id: SearchIndexDetailsTabs.SETTINGS,
        name: i18n.translate('xpack.searchIndices.settingsTabLabel', {
          defaultMessage: 'Settings',
        }),
        content: <SearchIndexDetailsSettings indexName={indexName} />,
        'data-test-subj': `${SearchIndexDetailsTabs.SETTINGS}Tab`,
      },
    ];
  }, [index, indexName, indexDocuments, indexDocumentsIsInitialLoading]);
  const [selectedTab, setSelectedTab] = useState(detailsPageTabs[0]);

  useEffect(() => {
    const newTab = detailsPageTabs.find((tab) => tab.id === tabId);
    if (newTab) setSelectedTab(newTab);
  }, [detailsPageTabs, tabId]);

  const handleTabClick = useCallback(
    (tab: EuiTabbedContentTab) => {
      history.push(`index_details/${indexName}/${tab.id}`);

      const tabEvent = {
        [SearchIndexDetailsTabs.DATA]: AnalyticsEvents.indexDetailsNavDataTab,
        [SearchIndexDetailsTabs.MAPPINGS]: AnalyticsEvents.indexDetailsNavMappingsTab,
        [SearchIndexDetailsTabs.SETTINGS]: AnalyticsEvents.indexDetailsNavSettingsTab,
      }[tab.id];

      if (tabEvent) {
        usageTracker.click(tabEvent);
      }
    },

    [history, indexName, usageTracker]
  );
  const embeddableConsole = useMemo(
    () => (consolePlugin?.EmbeddableConsole ? <consolePlugin.EmbeddableConsole /> : null),
    [consolePlugin]
  );
  const navigateToIndexListPage = useCallback(() => {
    application.navigateToApp('management', { deepLinkId: 'index_management' });
  }, [application]);

  const refetchIndex = useCallback(() => {
    refetch();
  }, [refetch]);
  const indexError = useMemo(
    () =>
      isIndexError
        ? {
            title: indexLoadingError ? indexLoadingError.body?.error : '',
            message: indexLoadingError ? indexLoadingError.body?.message : '',
          }
        : {
            title: mappingsError ? mappingsError.body?.error : '',
            message: mappingsError ? mappingsError.body?.message : '',
          },
    [isIndexError, indexLoadingError, mappingsError]
  );
  const [isShowingDeleteModal, setShowDeleteIndexModal] = useState<boolean>(false);
  const handleDeleteIndexModal = useCallback(() => {
    setShowDeleteIndexModal(!isShowingDeleteModal);
  }, [isShowingDeleteModal]);
  const { euiTheme } = useEuiTheme();

  if (isInitialLoading || isMappingsInitialLoading || indexDocumentsIsInitialLoading) {
    return (
      <SectionLoading>
        {i18n.translate('xpack.searchIndices.loadingDescription', {
          defaultMessage: 'Loading index details…',
        })}
      </SectionLoading>
    );
  }

  return (
    <EuiPageTemplate
      offset={0}
      restrictWidth={false}
      data-test-subj="searchIndicesDetailsPage"
      grow={false}
      panelled
      bottomBorder
    >
      {isIndexError || isMappingsError || !index || !mappings || !indexDocuments ? (
        <IndexloadingError
          error={indexError}
          navigateToIndexListPage={navigateToIndexListPage}
          reloadFunction={refetchIndex}
        />
      ) : (
        <>
          <EuiPageTemplate.Header
            restrictWidth
            data-test-subj="searchIndexDetailsHeader"
            pageTitle={index?.name}
            bottomBorder={false}
            rightSideItems={[
              <EuiFlexGroup gutterSize="m">
                {hasDocuments ? (
                  <>
                    <EuiFlexItem>
                      <EuiButtonEmpty
                        isLoading={isDocumentsLoading}
                        data-test-subj="viewInDiscoverLink"
                        onClick={navigateToDiscover}
                      >
                        <FormattedMessage
                          id="xpack.searchIndices.indexAction.useInPlaygroundButtonLabel"
                          defaultMessage="View in Discover"
                        />
                      </EuiButtonEmpty>
                    </EuiFlexItem>
                    <EuiFlexItem>
                      <EuiButton
                        isLoading={isDocumentsLoading}
                        data-test-subj="useInPlaygroundLink"
                        onClick={navigateToPlayground}
                        iconType="launch"
                        fill
                      >
                        <FormattedMessage
                          id="xpack.searchIndices.indexAction.useInPlaygroundButtonLabel"
                          defaultMessage="Search in Playground"
                        />
                      </EuiButton>
                    </EuiFlexItem>
                  </>
                ) : (
                  <EuiFlexItem>
                    <EuiButtonEmpty
                      href={docLinks.links.apiReference}
                      target="_blank"
                      isLoading={isDocumentsLoading}
                      iconType="documentation"
                      data-test-subj="ApiReferenceDoc"
                    >
                      <FormattedMessage
                        id="xpack.searchIndices.indexAction.ApiReferenceButtonLabel"
                        defaultMessage="API Reference"
                      />
                    </EuiButtonEmpty>
                  </EuiFlexItem>
                )}
                <EuiFlexItem>
                  <SearchIndexDetailsPageMenuItemPopover
                    handleDeleteIndexModal={handleDeleteIndexModal}
                    showApiReference={hasDocuments}
                  />
                </EuiFlexItem>
              </EuiFlexGroup>,
            ]}
          />
          <EuiPageTemplate.Section
            grow={false}
            restrictWidth
            css={{ padding: `0 ${euiTheme.size.l} ${euiTheme.size.l}` }}
          >
            <EuiFlexGroup direction="column">
              <EuiFlexGroup direction="column">
                <EuiFlexItem>
                  <EuiFlexGroup css={{ overflow: 'auto' }} wrap>
                    <EuiFlexItem grow={false} css={{ minWidth: 400 }}>
                      <ConnectionDetails />
                    </EuiFlexItem>
                    <EuiFlexItem grow={false} css={{ minWidth: 400 }}>
                      <ApiKeyForm />
                    </EuiFlexItem>
                  </EuiFlexGroup>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiFlexGroup>
                    <QuickStats indexDocuments={indexDocuments} index={index} mappings={mappings} />
                  </EuiFlexGroup>
                </EuiFlexItem>
              </EuiFlexGroup>
              <EuiFlexItem>
                <EuiFlexItem>
                  <EuiTabbedContent
                    tabs={detailsPageTabs}
                    onTabClick={handleTabClick}
                    selectedTab={selectedTab}
                  />
                </EuiFlexItem>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiPageTemplate.Section>
        </>
      )}
      {isShowingDeleteModal && (
        <DeleteIndexModal
          onCancel={() => setShowDeleteIndexModal(!isShowingDeleteModal)}
          indexName={indexName}
          navigateToIndexListPage={navigateToIndexListPage}
        />
      )}
      {embeddableConsole}
    </EuiPageTemplate>
  );
};
