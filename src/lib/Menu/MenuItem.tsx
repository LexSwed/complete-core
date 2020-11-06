import React from 'react';

import { useAllHandlers } from '../utils';
import { useMenu } from './utils';
import ListItem from '../ListItem';
import { useOpenStateControls } from '../utils/OpenStateProvider';

type Props = React.ComponentProps<typeof ListItem> & { action?: string };

const MenuItem = React.forwardRef<HTMLLIElement, Props>(({ action, disabled, ...props }, ref) => {
  const { onAction } = useMenu();
  const { close } = useOpenStateControls();

  const onClick = useAllHandlers(() => {
    action && onAction?.(action);
    close();
  }, props.onClick);

  return <ListItem {...props} onClick={onClick} role="menuitem" ref={ref} />;
});

MenuItem.displayName = 'MenuItem';

export default MenuItem;