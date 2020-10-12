import React, { useMemo } from 'react';
import Flex from '../Flex';
import { styled } from '../stitches.config';
import Text from '../Text';
import { useUID } from 'react-uid';
import Box from '../Box';

const Wrapper = styled(Flex, {
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
});

type Props = React.ComponentProps<typeof Flex> & {
  hasHint?: boolean;
};

const tonesMap: Record<NonNullable<Props['validity']>, React.ComponentProps<typeof Text>['tone']> = {
  valid: 'success',
  invalid: 'danger',
};

export const FormField: React.FC<Props> = ({
  main = 'stretch',
  cross = 'stretch',
  flow,
  display,
  space = 'xs',
  css,
  style,
  className,
  children,
  hasHint,
  as,
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
      as={as}
    >
      {children}
    </Wrapper>
  );
};

export const Hint: React.FC<React.ComponentProps<typeof Text> & { validity?: Props['validity'] }> = ({
  validity,
  children,
  ...props
}) => {
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

type InputAriaProps = {
  'id': string;
  'aria-describedby'?: string;
  'aria-labelledby'?: string;
};