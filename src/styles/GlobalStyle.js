import { createGlobalStyle } from 'styled-components';

const fontUrl = 'https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;700&display=swap';
export const GlobalStyle = createGlobalStyle`
    @import url('${fontUrl}');)
  body {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    transition: all 0.25s linear;
    margin: 0;
  }
`;