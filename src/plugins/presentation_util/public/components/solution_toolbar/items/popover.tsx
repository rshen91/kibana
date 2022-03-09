/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React, { useState } from 'react';
import { EuiPopover, IconType } from '@elastic/eui';
import { Props as EuiPopoverProps } from '@elastic/eui/src/components/popover/popover';
import {
  SolutionToolbarButton,
  SolutionToolbarButtonProps as ButtonProps,
} from '../../../../../shared_ux/public';

type AllowedButtonProps = Omit<typeof ButtonProps, 'onClick' | 'fill'>;
type AllowedPopoverProps = Omit<
  EuiPopoverProps,
  'button' | 'isOpen' | 'closePopover' | 'anchorPosition'
>;

export type Props = AllowedButtonProps &
  AllowedPopoverProps & {
    children: (arg: { closePopover: () => void }) => React.ReactNode;
    iconType: IconType;
  };

export const SolutionToolbarPopover = ({ iconType, children, ...popover }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const onButtonClick = () => setIsOpen((status) => !status);
  const closePopover = () => setIsOpen(false);

  const button = (
    <SolutionToolbarButton
      {...{ label, iconType }}
      onClick={onButtonClick}
      data-test-subj={popover['data-test-subj']}
    />
  );

  return (
    <EuiPopover
      anchorPosition="downLeft"
      panelPaddingSize="none"
      {...{ isOpen, button, closePopover }}
      {...popover}
    >
      {children({ closePopover })}
    </EuiPopover>
  );
};
