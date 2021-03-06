import { FocusRing as SpectrumFocusRing } from '@react-aria/focus';
import React from 'react';

import { css } from '../stitches.config';

const focusClass = css({
  outline: 'none',
});

const focusRingClass = css({
  focusRing: '$focusRing',
});

interface Props extends Omit<React.ComponentPropsWithRef<typeof SpectrumFocusRing>, 'focusRingClass' | 'focusClass'> {}

const FocusRing: React.FC<Props> = (props) => {
  return <SpectrumFocusRing focusRingClass={`${focusRingClass}`} focusClass={`${focusClass}`} {...props} />;
};

export default FocusRing;
