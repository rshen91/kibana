/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { I18nProvider } from '@kbn/i18n-react';
import { EuiWrappingPopover } from '@elastic/eui';

import { CoreStart, ThemeServiceStart } from '@kbn/core/public';
import { KibanaThemeProvider } from '@kbn/kibana-react-plugin/public';
import { ShareMenuItem, ShowShareMenuOptions } from '../types';
import { ShareMenuRegistryStart } from './share_menu_registry';
import { AnonymousAccessServiceContract } from '../../common/anonymous_access';
import type { BrowserUrlService } from '../types';
import { ShareUxModal } from '../components/share_modal/share_modal';
import { ShareContextMenu } from '../components/share_context_menu';

export class ShareMenuManager {
  private isOpen = false;

  private container = document.createElement('div');

  start(
    core: CoreStart,
    urlService: BrowserUrlService,
    shareRegistry: ShareMenuRegistryStart,
    disableEmbed: boolean,
    anonymousAccessServiceProvider?: () => AnonymousAccessServiceContract
  ) {
    return {
      /**
       * Collects share menu items from registered providers and mounts the share context menu under
       * the given `anchorElement`. If the context menu is already opened, a call to this method closes it.
       * @param options
       */
      toggleShareContextMenu: (options: ShowShareMenuOptions) => {
        const onClose = () => {
          this.onClose();
          options.onClose?.();
        };
        const menuItems = shareRegistry.getShareMenuItems({ ...options, onClose });
        const anonymousAccess = anonymousAccessServiceProvider?.();
        this.toggleShareContextMenu({
          ...options,
          allowEmbed: disableEmbed ? false : options.allowEmbed,
          onClose,
          menuItems,
          urlService,
          anonymousAccess,
          theme: core.theme,
        });
      },
    };
  }

  private onClose = () => {
    ReactDOM.unmountComponentAtNode(this.container);
    this.isOpen = false;
  };

  private toggleShareContextMenu({
    anchorElement,
    allowEmbed,
    allowShortUrl,
    objectId,
    objectType,
    sharingData,
    menuItems,
    shareableUrl,
    shareableUrlForSavedObject,
    shareableUrlLocatorParams,
    embedUrlParamExtensions,
    theme,
    showPublicUrlSwitch,
    urlService,
    anonymousAccess,
    snapshotShareWarning,
    onClose,
    objectTypeTitle,
    disabledShareUrl,
  }: ShowShareMenuOptions & {
    menuItems: ShareMenuItem[];
    urlService: BrowserUrlService;
    anonymousAccess: AnonymousAccessServiceContract | undefined;
    theme: ThemeServiceStart;
    onClose: () => void;
  }) {
    if (this.isOpen) {
      onClose();
      return;
    }

    this.isOpen = true;

    document.body.appendChild(this.container);
    const element = (
      <I18nProvider>
        <KibanaThemeProvider theme$={theme.theme$}>
          <EuiWrappingPopover
            id="sharePopover"
            button={anchorElement}
            isOpen={true}
            closePopover={onClose}
            panelPaddingSize="none"
            anchorPosition="downLeft"
          >
            <ShareUxModal
              allowEmbed={allowEmbed}
              allowShortUrl={allowShortUrl}
              objectId={objectId}
              objectType={objectType}
              objectTypeTitle={objectTypeTitle}
              shareMenuItems={menuItems}
              sharingData={sharingData}
              shareableUrl={shareableUrl}
              shareableUrlForSavedObject={shareableUrlForSavedObject}
              shareableUrlLocatorParams={shareableUrlLocatorParams}
              onClose={onClose}
              embedUrlParamExtensions={embedUrlParamExtensions}
              anonymousAccess={anonymousAccess}
              showPublicUrlSwitch={showPublicUrlSwitch}
              urlService={urlService}
              snapshotShareWarning={snapshotShareWarning}
              disabledShareUrl={disabledShareUrl}
            />
          </EuiWrappingPopover>
        </KibanaThemeProvider>
      </I18nProvider>
    );
    ReactDOM.render(element, this.container);
  }
}
export type ShareMenuManagerStart = ReturnType<ShareMenuManager['start']>;
