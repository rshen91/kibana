/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React, { FC } from 'react';
import { toMountPoint } from '@kbn/react-kibana-mount';
import { I18nProvider } from '@kbn/i18n-react';
import { i18n } from '@kbn/i18n';
import { EuiContextMenu, EuiContextMenuPanelDescriptor } from '@elastic/eui';
import type { CoreStart } from '@kbn/core-lifecycle-browser';
import { Capabilities } from '@kbn/core-capabilities-common';
import { OverlayStart } from '@kbn/core-overlays-browser';
import type { LocatorPublic } from '../../common';
import { ShareMenuItem, ShareContextMenuPanelItem, UrlParamExtension } from '../types';
import { AnonymousAccessServiceContract } from '../../common/anonymous_access';
import type { BrowserUrlService } from '../types';
import { LinkModal, EmbedModal } from './modals';

export interface ShareContextMenuProps {
  allowEmbed: boolean;
  allowShortUrl: boolean;
  objectId?: string;
  objectType: string;
  shareableUrl?: string;
  shareableUrlForSavedObject?: string;
  shareableUrlLocatorParams?: {
    locator: LocatorPublic<any>;
    params: any;
  };
  shareMenuItems: ShareMenuItem[];
  sharingData: any;
  onClose: () => void;
  embedUrlParamExtensions?: UrlParamExtension[];
  anonymousAccess?: AnonymousAccessServiceContract;
  showPublicUrlSwitch?: (anonymousUserCapabilities: Capabilities) => boolean;
  urlService: BrowserUrlService;
  snapshotShareWarning?: string;
  objectTypeTitle?: string;
  disabledShareUrl?: boolean;
  openModal: OverlayStart['openModal'];
  theme: CoreStart['theme'];
  i18nStart: CoreStart['i18n'];
}

export const ShareContextMenu: FC<ShareContextMenuProps> = (props: ShareContextMenuProps) => {
  const {
    openModal,
    onClose,
    urlService,
    theme,
    i18nStart,
    objectType,
    disabledShareUrl,
    allowEmbed,
    shareMenuItems,
    objectTypeTitle,
  } = props;

  const openLinkModal = () => {
    const session = openModal(
      toMountPoint(
        <LinkModal
          isEmbedded={false}
          allowShortUrl={false}
          onClose={() => {
            onClose();
            session.close();
          }}
          urlService={urlService}
        />,
        { theme, i18n: i18nStart }
      ),
      {
        maxWidth: 400,
        'data-test-subj': 'link-modal',
      }
    );
  };

  const openEmbedModal = () => {
    const session = openModal(
      toMountPoint(
        <EmbedModal
          isEmbedded={false}
          allowShortUrl={false}
          onClose={() => {
            onClose();
            session.close();
          }}
          urlService={urlService}
          objectType={objectType}
        />,
        { theme, i18n: i18nStart }
      ),
      {
        maxWidth: 400,
        'data-test-subj': 'embed-modal',
      }
    );
  };

  // private openCsvExportModal() {
  //   const session = overlays.openModal(
  //     toMountPoint(
  //       <CsvModalContentUI
  //         isEmbedded={false}
  //         allowShortUrl={false}
  //         onClose={() => {
  //           onClose();
  //           session.close();
  //         }}
  //         urlService={urlService}
  //         objectType={objectType}
  //       />,
  //       { theme: theme, i18n: i18nStart }
  //     ),
  //     {
  //       maxWidth: 400,
  //       'data-test-subj': 'embed-modal',
  //     }
  //   );
  // }
  const getPanels = () => {
    const panels: EuiContextMenuPanelDescriptor[] = [];
    const menuItems: ShareContextMenuPanelItem[] = [];

    menuItems.push({
      name: i18n.translate('share.contextMenu.permalinksLabel', {
        defaultMessage: 'Get Link',
      }),
      icon: 'link',
      sortOrder: 0,
      disabled: Boolean(disabledShareUrl),
      // do not break functional tests
      'data-test-subj': 'Permalinks',
      onClick: openLinkModal,
    });

    if (allowEmbed) {
      menuItems.push({
        name: i18n.translate('share.contextMenu.embedCodeLabel', {
          defaultMessage: 'Embed',
        }),
        icon: 'console',
        sortOrder: 0,
        onClick: openEmbedModal,
      });
    }

    shareMenuItems.forEach(({ shareMenuItem }) => {
      const panelId = panels.length + 1;
      panels.push({
        ...panels,
        id: panelId,
      });
      menuItems.push({
        ...shareMenuItem,
      });
    });

    if (menuItems.length > 1) {
      const topLevelMenuPanel = {
        id: panels.length + 1,
        title: i18n.translate('share.contextMenuTitle', {
          defaultMessage: 'Share this {objectType}',
          values: {
            objectType: objectTypeTitle || objectType,
          },
        }),
        items: menuItems
          // Sorts ascending on sort order first and then ascending on name
          .sort((a, b) => {
            const aSortOrder = a.sortOrder || 0;
            const bSortOrder = b.sortOrder || 0;
            if (aSortOrder > bSortOrder) {
              return 1;
            }
            if (aSortOrder < bSortOrder) {
              return -1;
            }
            if (a.name.toLowerCase().localeCompare(b.name.toLowerCase()) > 0) {
              return 1;
            }
            return -1;
          })
          .map((menuItem) => {
            menuItem['data-test-subj'] = `sharePanel-${
              menuItem['data-test-subj'] ?? menuItem.name.replace(' ', '')
            }`;
            delete menuItem.sortOrder;
            return menuItem;
          }),
      };
      panels.push(topLevelMenuPanel);
    }

    return { panels };
  };

  const { panels } = getPanels();
  return (
    <>
      <I18nProvider>
        <EuiContextMenu
          initialPanelId={panels[panels.length - 1].id}
          panels={panels}
          data-test-subj="shareContextMenu"
        />
      </I18nProvider>
    </>
  );
};
