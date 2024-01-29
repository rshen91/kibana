/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React, { Component } from 'react';
import {
  EuiButton,
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
  EuiForm,
  EuiFormRow,
  EuiLoadingSpinner,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiRadioGroup,
  EuiSpacer,
  EuiSwitch,
  EuiIconTip,
  EuiSwitchEvent,
  EuiCopy,
  EuiToolTip,
} from '@elastic/eui';
import { format as formatUrl, parse as parseUrl } from 'url';

import { Capabilities } from '@kbn/core-capabilities-common';
import { FormattedMessage } from '@kbn/i18n-react';
import { i18n } from '@kbn/i18n';
import {
  LocatorPublic,
  AnonymousAccessServiceContract,
  AnonymousAccessState,
} from '../../../common';
import { UrlParamExtension, BrowserUrlService } from '../../types';

export interface LinkModalProps {
  allowShortUrl: boolean;
  isEmbedded?: boolean;
  objectId?: string;
  objectType: string;
  shareableUrl?: string;
  shareableUrlForSavedObject?: string;
  shareableUrlLocatorParams?: {
    locator: LocatorPublic<any>;
    params: any;
  };
  urlParamExtensions?: UrlParamExtension[];
  anonymousAccess?: AnonymousAccessServiceContract;
  showPublicUrlSwitch?: (anonymousUserCapabilities: Capabilities) => boolean;
  urlService: BrowserUrlService;
  snapshotShareWarning?: string;
  onClose: () => void;
}

export enum ExportUrlAsType {
  EXPORT_URL_AS_SAVED_OBJECT = 'savedObject',
  EXPORT_URL_AS_SNAPSHOT = 'snapshot',
}

interface UrlParams {
  [extensionName: string]: {
    [queryParam: string]: boolean;
  };
}

interface State {
  exportUrlAs: ExportUrlAsType;
  useShortUrl: boolean;
  usePublicUrl: boolean;
  isCreatingShortUrl: boolean;
  url?: string;
  shortUrlErrorMsg?: string;
  urlParams?: UrlParams;
  anonymousAccessParameters: AnonymousAccessState['accessURLParameters'];
  showPublicUrlSwitch: boolean;
  showWarningButton: boolean;
}

export class LinkModal extends Component<LinkModalProps, State> {
  private mounted?: boolean;
  private shortUrlCache?: string;

  constructor(props: LinkModalProps) {
    super(props);

    this.shortUrlCache = undefined;
    this.state = {
      exportUrlAs: ExportUrlAsType.EXPORT_URL_AS_SNAPSHOT,
      useShortUrl: false,
      usePublicUrl: false,
      isCreatingShortUrl: false,
      url: '',
      anonymousAccessParameters: null,
      showPublicUrlSwitch: false,
      showWarningButton: Boolean(this.props.snapshotShareWarning),
    };
  }

  public componentWillUnmount() {
    window.removeEventListener('hashchange', this.resetUrl);

    this.mounted = false;
  }

  public componentDidMount() {
    this.mounted = true;
    this.setUrl();

    window.addEventListener('hashchange', this.resetUrl, false);

    if (this.props.anonymousAccess) {
      (async () => {
        const { accessURLParameters: anonymousAccessParameters } =
          await this.props.anonymousAccess!.getState();

        if (!this.mounted) {
          return;
        }

        if (!anonymousAccessParameters) {
          return;
        }

        let showPublicUrlSwitch: boolean = false;

        if (this.props.showPublicUrlSwitch) {
          const anonymousUserCapabilities = await this.props.anonymousAccess!.getCapabilities();

          if (!this.mounted) {
            return;
          }

          try {
            showPublicUrlSwitch = this.props.showPublicUrlSwitch!(anonymousUserCapabilities);
          } catch {
            showPublicUrlSwitch = false;
          }
        }

        this.setState({
          anonymousAccessParameters,
          showPublicUrlSwitch,
        });
      })();
    }
  }

  private isNotSaved = () => {
    return this.props.objectId === undefined || this.props.objectId === '';
  };

  private makeUrlEmbeddable = (url: string): string => {
    const embedParam = '?embed=true';
    const urlHasQueryString = url.indexOf('?') !== -1;

    if (urlHasQueryString) {
      return url.replace('?', `${embedParam}&`);
    }

    return `${url}${embedParam}`;
  };

  private getUrlParamExtensions = (url: string): string => {
    const { urlParams } = this.state;
    return urlParams
      ? Object.keys(urlParams).reduce((urlAccumulator, key) => {
          const urlParam = urlParams[key];
          return urlParam
            ? Object.keys(urlParam).reduce((queryAccumulator, queryParam) => {
                const isQueryParamEnabled = urlParam[queryParam];
                return isQueryParamEnabled
                  ? queryAccumulator + `&${queryParam}=true`
                  : queryAccumulator;
              }, urlAccumulator)
            : urlAccumulator;
        }, url)
      : url;
  };

  private updateUrlParams = (url: string) => {
    url = this.props.isEmbedded ? this.makeUrlEmbeddable(url) : url;
    url = this.state.urlParams ? this.getUrlParamExtensions(url) : url;

    return url;
  };

  private getSnapshotUrl = (forSavedObject?: boolean) => {
    let url = '';
    if (forSavedObject && this.props.shareableUrlForSavedObject) {
      url = this.props.shareableUrlForSavedObject;
    }
    if (!url) {
      url = this.props.shareableUrl || window.location.href;
    }
    return this.updateUrlParams(url);
  };

  private getSavedObjectUrl = () => {
    if (this.isNotSaved()) {
      return;
    }

    const url = this.getSnapshotUrl(true);

    const parsedUrl = parseUrl(url);
    if (!parsedUrl || !parsedUrl.hash) {
      return;
    }

    // Get the application route, after the hash, and remove the #.
    const parsedAppUrl = parseUrl(parsedUrl.hash.slice(1), true);

    const formattedUrl = formatUrl({
      protocol: parsedUrl.protocol,
      auth: parsedUrl.auth,
      host: parsedUrl.host,
      pathname: parsedUrl.pathname,
      hash: formatUrl({
        pathname: parsedAppUrl.pathname,
        query: {
          // Add global state to the URL so that the iframe doesn't just show the time range
          // default.
          _g: parsedAppUrl.query._g,
        },
      }),
    });
    return this.updateUrlParams(formattedUrl);
  };

  private resetUrl = () => {
    if (this.mounted) {
      this.shortUrlCache = undefined;
      this.setState(
        {
          useShortUrl: false,
        },
        this.setUrl
      );
    }
  };

  private addUrlAnonymousAccessParameters = (url: string): string => {
    if (!this.state.anonymousAccessParameters || !this.state.usePublicUrl) {
      return url;
    }

    const parsedUrl = new URL(url);

    for (const [name, value] of Object.entries(this.state.anonymousAccessParameters)) {
      parsedUrl.searchParams.set(name, value);
    }

    return parsedUrl.toString();
  };

  private createShortUrl = async () => {
    this.setState({
      isCreatingShortUrl: true,
      shortUrlErrorMsg: undefined,
    });

    try {
      const { shareableUrlLocatorParams } = this.props;
      if (shareableUrlLocatorParams) {
        const shortUrls = this.props.urlService.shortUrls.get(null);
        const shortUrl = await shortUrls.createWithLocator(shareableUrlLocatorParams);
        this.shortUrlCache = await shortUrl.locator.getUrl(shortUrl.params, { absolute: true });
      } else {
        const snapshotUrl = this.getSnapshotUrl();
        const shortUrl = await this.props.urlService.shortUrls
          .get(null)
          .createFromLongUrl(snapshotUrl);
        this.shortUrlCache = shortUrl.url;
      }

      if (!this.mounted) {
        return;
      }

      this.setState(
        {
          isCreatingShortUrl: false,
          useShortUrl: true,
        },
        this.setUrl
      );
    } catch (fetchError) {
      if (!this.mounted) {
        return;
      }

      this.shortUrlCache = undefined;
      this.setState(
        {
          useShortUrl: false,
          isCreatingShortUrl: false,
          shortUrlErrorMsg: i18n.translate('share.urlModal.unableCreateShortUrlErrorMessage', {
            defaultMessage: 'Unable to create short URL. Error: {errorMessage}',
            values: {
              errorMessage: fetchError.message,
            },
          }),
        },
        this.setUrl
      );
    }
  };

  private handleShortUrlChange = async (evt: EuiSwitchEvent) => {
    const isChecked = evt.target.checked;

    if (!isChecked || this.shortUrlCache !== undefined) {
      this.setState({ useShortUrl: isChecked }, this.setUrl);
      return;
    }

    // "Use short URL" is checked but shortUrl has not been generated yet so one needs to be created.
    this.createShortUrl();
  };

  private setUrl = () => {
    let url: string | undefined;

    if (this.state.exportUrlAs === ExportUrlAsType.EXPORT_URL_AS_SAVED_OBJECT) {
      url = this.getSavedObjectUrl();
    } else if (this.state.useShortUrl) {
      url = this.shortUrlCache;
    } else {
      url = this.getSnapshotUrl();
    }

    if (url) {
      url = this.addUrlAnonymousAccessParameters(url);
    }

    this.setState({ url });
  };

  private handleExportUrlAs = (optionId: string) => {
    this.setState(
      {
        showWarningButton:
          Boolean(this.props.snapshotShareWarning) &&
          (optionId as ExportUrlAsType) === ExportUrlAsType.EXPORT_URL_AS_SNAPSHOT,
        exportUrlAs: optionId as ExportUrlAsType,
      },
      this.setUrl
    );
  };

  private renderWithIconTip = (child: React.ReactNode, tipContent: React.ReactNode) => {
    return (
      <EuiFlexGroup gutterSize="none" responsive={false}>
        <EuiFlexItem grow={false}>{child}</EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiIconTip content={tipContent} position="bottom" />
        </EuiFlexItem>
      </EuiFlexGroup>
    );
  };

  private renderShortUrlSwitch = () => {
    if (
      this.state.exportUrlAs === ExportUrlAsType.EXPORT_URL_AS_SAVED_OBJECT ||
      !this.props.allowShortUrl
    ) {
      return null;
    }
    const shortUrlLabel = (
      <FormattedMessage id="share.urlModal.shortUrlLabel" defaultMessage="Short URL" />
    );
    const switchLabel = this.state.isCreatingShortUrl ? (
      <span>
        <EuiLoadingSpinner size="s" /> {shortUrlLabel}
      </span>
    ) : (
      shortUrlLabel
    );
    const switchComponent = (
      <EuiSwitch
        label={switchLabel}
        checked={this.state.useShortUrl}
        onChange={this.handleShortUrlChange}
        data-test-subj="useShortUrl"
      />
    );
    const tipContent = (
      <FormattedMessage
        id="share.urlModal.shortUrlHelpText"
        defaultMessage="We recommend sharing shortened snapshot URLs for maximum compatibility.
        Internet Explorer has URL length restrictions,
        and some wiki and markup parsers don't do well with the full-length version of the snapshot URL,
        but the short URL should work great."
      />
    );

    return (
      <EuiFormRow helpText={this.state.shortUrlErrorMsg} data-test-subj="createShortUrl">
        {this.renderWithIconTip(switchComponent, tipContent)}
      </EuiFormRow>
    );
  };

  snapshotLabel = (
    <FormattedMessage id="share.urlModal.snapshotLabel" defaultMessage="Snapshot" />
  );

  public render() {
    return (
      <EuiModal onClose={this.props.onClose}>
        <EuiModalHeader>
          <EuiModalHeaderTitle>{`Get link to this ${
            this.props.objectType === 'lens' ? 'visualization' : this.props.objectType
          }`}</EuiModalHeaderTitle>
        </EuiModalHeader>
        <EuiModalBody>
          <EuiForm className="kbnShareContextMenu__finalPanel" data-test-subj="shareUrlForm">
            <EuiFormRow
              helpText={
                this.isNotSaved() ? (
                  <FormattedMessage
                    id="share.urlPanel.canNotShareAsSavedObjectHelpText"
                    defaultMessage="To share as a saved object, save the {objectType}."
                    values={{ objectType: this.props.objectType }}
                  />
                ) : undefined
              }
            >
              <EuiRadioGroup
                options={[
                  {
                    id: ExportUrlAsType.EXPORT_URL_AS_SNAPSHOT,
                    label: (
                      <>
                        {this.renderWithIconTip(
                          this.snapshotLabel,
                          <FormattedMessage
                            id="share.urlModal.snapshotDescription"
                            defaultMessage="Snapshot URLs encode the current state of the {objectType} in the URL itself.
                      Edits to the saved {objectType} won't be visible via this URL."
                            values={{ objectType: this.props.objectType }}
                          />
                        )}
                      </>
                    ),
                    'data-test-subj': 'exportAsSnapshot',
                  },
                  {
                    id: ExportUrlAsType.EXPORT_URL_AS_SAVED_OBJECT,
                    disabled: this.isNotSaved(),
                    label: this.renderWithIconTip(
                      <FormattedMessage
                        id="share.urlModal.savedObjectLabel"
                        defaultMessage="Saved object"
                      />,
                      <FormattedMessage
                        id="share.urlModal.savedObjectDescription"
                        defaultMessage="You can share this URL with people to let them load the most recent saved version of this {objectType}."
                        values={{ objectType: this.props.objectType }}
                      />
                    ),
                    'data-test-subj': 'exportAsSavedObject',
                  },
                ]}
                onChange={this.handleExportUrlAs}
                name="embed radio group"
                idSelected={this.state.exportUrlAs}
                legend={{
                  children: (
                    <FormattedMessage
                      id="share.urlModal.generateLinkAsLabel"
                      defaultMessage="Generate as"
                    />
                  ),
                }}
              />
            </EuiFormRow>
            <EuiSpacer size="m" />
          </EuiForm>
        </EuiModalBody>
        <EuiModalFooter>
          <EuiFlexGroup alignItems="center">
            <EuiFlexItem>{this.props.allowShortUrl && this.renderShortUrlSwitch()}</EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiFlexGroup gutterSize="m">
                <EuiFlexItem>
                  <EuiButtonEmpty onClick={this.props.onClose} data-test-subj="share.doneButton">
                    <FormattedMessage id="share.doneButton" defaultMessage="Done" />
                  </EuiButtonEmpty>
                </EuiFlexItem>
                <EuiFlexItem>
                  {this.isNotSaved() ? (
                    <EuiToolTip
                      content={
                        this.props.objectType === 'dashboard'
                          ? 'One or more panels on this dashboard have changed. Before you generate a snapshot, save the dashboard.'
                          : 'Save before you generate a snapshot.'
                      }
                    >
                      <EuiButton
                        color="warning"
                        iconType="warning"
                        data-test-subj="copyShareUrlButton"
                        data-share-url={this.state.url}
                      >
                        <FormattedMessage
                          id="share.link.saveNeededButton"
                          defaultMessage="Copy link"
                        />
                      </EuiButton>
                    </EuiToolTip>
                  ) : (
                    <EuiCopy textToCopy={this.state.url ?? ''}>
                      {(copy) => (
                        <EuiButton
                          fill
                          onClick={copy}
                          data-test-subj="copyShareUrlButton"
                          data-share-url={this.state.url}
                        >
                          <FormattedMessage
                            id="share.link.copyLinkButton"
                            defaultMessage="Copy link"
                          />
                        </EuiButton>
                      )}
                    </EuiCopy>
                  )}
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiModalFooter>
      </EuiModal>
    );
  }
}
