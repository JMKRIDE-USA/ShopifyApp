import { Spinner as PolarisSpinner } from '@shopify/polaris';
import styled from 'styled-components';

const SpinnerDiv = styled.div`
  width: 30px;
`

export const Spinner = () => (
  <SpinnerDiv>
    <PolarisSpinner size="medium"/>
  </SpinnerDiv>
)