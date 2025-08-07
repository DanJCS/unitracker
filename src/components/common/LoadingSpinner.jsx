import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${props => props.theme?.body || '#f8fafc'};
`;

const Spinner = styled.div`
  border: 4px solid ${props => props.theme?.borderColor || '#e2e8f0'};
  border-top: 4px solid ${props => props.theme?.accent || '#6366f1'};
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: ${spin} 2s linear infinite;
`;

const LoadingText = styled.p`
  margin-left: 20px;
  color: ${props => props.theme?.text || '#1e293b'};
  font-size: 16px;
`;

const LoadingSpinner = ({ text = "Loading..." }) => {
  return (
    <LoadingContainer>
      <Spinner />
      <LoadingText>{text}</LoadingText>
    </LoadingContainer>
  );
};

export default LoadingSpinner;