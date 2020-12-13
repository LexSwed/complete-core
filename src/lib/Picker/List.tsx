import React, { useEffect, useRef } from 'react';

import ListBox, { ListBoxProps } from '../ListBox/ListBox';
import { usePicker } from './utils';

interface Props extends ListBoxProps {
  triggerId: string;
}

const List: React.FC<Props> = ({ triggerId, children, ...props }) => {
  const { value } = usePicker();
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    // selected value is already focused
    if (ref.current?.contains(document.activeElement)) {
      return;
    }

    const option = ref.current?.querySelector('[role="option"]') as HTMLLIElement;

    if (option) {
      option?.focus?.();
    } else {
      ref.current?.focus();
    }
  }, [value]);

  return (
    <ListBox {...props} id={`${triggerId}-listbox`} aria-labelledby={triggerId} restoreFocus contain wrap ref={ref}>
      {children}
    </ListBox>
  );
};

export default List;