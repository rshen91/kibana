/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React, { useRef, useState } from 'react';
import type { FC } from 'react';
import {
  EuiPopover,
  EuiPopoverTitle,
  EuiSelectable,
  EuiFilterButton,
  EuiFlexGroup,
  EuiFlexItem,
  EuiText,
  EuiButtonEmpty,
  EuiTextColor,
  EuiSpacer,
  EuiLink,
  useEuiTheme,
  EuiPopoverFooter,
  EuiButton,
} from '@elastic/eui';
import type { EuiSelectableProps, ExclusiveUnion } from '@elastic/eui';
import { css } from '@emotion/react';
import { i18n } from '@kbn/i18n';
import { RedirectAppLinks } from '@kbn/shared-ux-link-redirect-app';

import { useServices } from '../services';
import type { TagOptionItem } from './use_tag_filter_panel';

const isMac = navigator.platform.toLowerCase().indexOf('mac') >= 0;
const modifierKeyPrefix = isMac ? '⌘' : '^';

const clearSelectionBtnCSS = css`
  height: auto;
`;

const saveBtnWrapperCSS = css`
  width: 100%;
`;

interface Props {
  clearTagSelection: () => void;
  isInUse: boolean;
  options: TagOptionItem[];
  totalActiveFilters: number;
  onSelectChange: (updatedOptions: TagOptionItem[]) => void;
}

export const TagFilterPanel: FC<Props> = ({
  isInUse,
  options,
  totalActiveFilters,
  onSelectChange,
  clearTagSelection,
}) => {
  const { euiTheme } = useEuiTheme();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const togglePopover = () => {
    setIsPopoverOpen((prev) => !prev);
  };

  const closePopover = () => {
    setIsPopoverOpen(false);
  };

  const { navigateToUrl, currentAppId$, getTagManagementUrl } = useServices();
  const isSearchVisible = options.length > 10;
  const searchBoxCSS = css`
    padding: ${euiTheme.size.s};
    border-bottom: ${euiTheme.border.thin};
  `;

  const popoverTitleCSS = css`
    height: ${euiTheme.size.xxxl};
  `;

  let searchProps: ExclusiveUnion<
    { searchable: false },
    {
      searchable: true;
      searchProps: EuiSelectableProps['searchProps'];
    }
  > = {
    searchable: false,
  };

  if (isSearchVisible) {
    searchProps = {
      searchable: true,
      searchProps: {
        compressed: true,
      },
    };
  }

  const ref = useRef<HTMLButtonElement | null>(null);

  const button = (
    <EuiFilterButton
      iconType="arrowDown"
      iconSide="right"
      onClick={togglePopover}
      data-test-subj="tagFilterPopoverButton"
      hasActiveFilters={totalActiveFilters > 0}
      numActiveFilters={totalActiveFilters}
      grow
      buttonRef={ref}
    >
      Tags
    </EuiFilterButton>
  );

  return (
    <EuiPopover
      button={button}
      isOpen={isPopoverOpen}
      closePopover={
        closePopover
        // () => {
        // closePopover();
        // console.log(ref.current);
        // if (ref.current) ref.current.focus();
        // }
      }
      panelPaddingSize="none"
      anchorPosition="downCenter"
      panelProps={{ css: { width: euiTheme.base * 18 } }}
      panelStyle={isInUse ? { transition: 'none' } : undefined}
    >
      <>
        <EuiPopoverTitle paddingSize="m" css={popoverTitleCSS}>
          <EuiFlexGroup>
            <EuiFlexItem>Tags</EuiFlexItem>
            <EuiFlexItem grow={false}>
              {totalActiveFilters > 0 && (
                <EuiButtonEmpty flush="both" onClick={clearTagSelection} css={clearSelectionBtnCSS}>
                  {i18n.translate(
                    'contentManagement.tableList.tagFilterPanel.clearSelectionButtonLabelLabel',
                    {
                      defaultMessage: 'Clear selection',
                    }
                  )}
                </EuiButtonEmpty>
              )}
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiPopoverTitle>
        <EuiSelectable<any>
          singleSelection={false}
          aria-label="some aria label"
          options={options}
          renderOption={(option) => option.view}
          emptyMessage="There aren't any tags"
          noMatchesMessage="No tag matches the search"
          onChange={onSelectChange}
          data-test-subj="tagSelectableList"
          {...searchProps}
        >
          {(list, search) => {
            return (
              <>
                {isSearchVisible ? <div css={searchBoxCSS}>{search}</div> : <EuiSpacer size="s" />}
                {list}
              </>
            );
          }}
        </EuiSelectable>
        <EuiPopoverFooter paddingSize="m">
          <EuiFlexGroup direction="column" alignItems="center" gutterSize="s">
            <EuiFlexItem>
              <EuiText size="xs">
                <EuiTextColor color="dimgrey">
                  {i18n.translate(
                    'contentManagement.tableList.tagFilterPanel.modifierKeyHelpText',
                    {
                      defaultMessage: '{modifierKeyPrefix} + click exclude',
                      values: {
                        modifierKeyPrefix,
                      },
                    }
                  )}
                </EuiTextColor>
              </EuiText>
            </EuiFlexItem>

            <EuiFlexItem css={saveBtnWrapperCSS}>
              <EuiButton onClick={closePopover}>
                {i18n.translate('contentManagement.tableList.tagFilterPanel.doneButtonLabel', {
                  defaultMessage: 'Done',
                })}
              </EuiButton>
            </EuiFlexItem>

            <EuiFlexItem>
              <RedirectAppLinks
                coreStart={{
                  application: {
                    navigateToUrl,
                    currentAppId$,
                  },
                }}
              >
                <EuiLink href={getTagManagementUrl()} data-test-subj="manageAllTagsLink" external>
                  {i18n.translate(
                    'contentManagement.tableList.tagFilterPanel.manageAllTagsLinkLabel',
                    {
                      defaultMessage: 'Manage tags',
                    }
                  )}
                </EuiLink>
              </RedirectAppLinks>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiPopoverFooter>
      </>
    </EuiPopover>
  );
};
