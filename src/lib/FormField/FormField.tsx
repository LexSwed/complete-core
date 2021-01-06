import React, { useMemo } from 'react';
import { useUID } from 'react-uid';

import Box from '../Box';
import { FlexBox } from '../Flex';
import { styled } from '../stitches.config';
import Text from '../Text';
import type { PropsOf } from '../utils';

const Wrapper = styled(FlexBox, {
  position: 'relative',
  width: '100%',

  variants: {
    hasHint: {
      true: {
        pb: '$5',
      },
    },
  },
});

export const HintBox = styled(Box, {
  position: 'relative',
  minWidth: 0,
  flex: 2,
});

const HintText = styled(Text, {
  position: 'absolute',
  lineHeight: '1.1',
  minWidth: 0,
  bottom: '0',
  transform: 'translateY(calc(100% + 4px))',
  maxWidth: '-webkit-fill-available',
  pl: '$2',
});

export interface FormFieldProps extends PropsOf<typeof Wrapper> {
  hasHint?: boolean;
  validity?: keyof typeof tonesMap;
}

const tonesMap: Record<'valid' | 'invalid', PropsOf<typeof Text>['tone']> = {
  valid: 'success',
  invalid: 'danger',
};

export const FormField: React.FC<FormFieldProps> = ({
  main = 'stretch',
  cross = 'stretch',
  flow = 'column',
  display = 'inline',
  space = 'xs',
  css,
  style,
  className,
  children,
  hasHint,
}) => {
  return (
    <Wrapper
      main={main}
      cross={cross}
      flow={flow}
      display={display}
      space={space}
      css={css}
      style={style}
      className={className}
      hasHint={hasHint}
    >
      {children}
    </Wrapper>
  );
};
interface HintProps extends PropsOf<typeof Text> {
  validity?: FormFieldProps['validity'];
}

export const Hint: React.FC<HintProps> = ({ validity, children, ...props }) => {
  return (
    <HintText
      ellipsis
      size="xs"
      title={typeof children === 'string' ? children : undefined}
      tone={validity ? tonesMap[validity] : 'light'}
      {...props}
    >
      {children}
    </HintText>
  );
};

export function useFormField({ id, hint, label }: { id?: string; hint?: string; label?: string }): InputAriaProps {
  let newId = useUID();

  newId = id ?? newId;

  return useMemo(
    () => ({
      'id': newId,
      'aria-describedby': hint ? `${newId}-hint` : undefined,
      'aria-labelledby': label ? `${label}-label` : undefined,
    }),
    [hint, newId, label]
  );
}

interface InputAriaProps {
  'id': string;
  'aria-describedby'?: string;
  'aria-labelledby'?: string;
}
