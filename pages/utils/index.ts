import { Box, styled } from '../../build';

export const ExampleBox = styled(Box, {
  bc: '$gray050',
  border: '2px dashed $gray200',
  height: '50px',
  minWidth: '50px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: '$gray500',
  fontSize: '$sm',
});