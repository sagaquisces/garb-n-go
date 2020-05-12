import React, { Component } from 'react';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components'
import Header from './Header'
import Meta from './Meta'

const theme = {
  red: '#ee205e',
  blue: '#209cee',
  yellow: '#eecf20',
  black: '#393939',
  grey: '#3A3A3A',
  lightgrey: '#E1E1E1',
  offWhite: '#EDEDED',
  maxWidth: '1000px',
  bs: '0px 3px 4px rgba(70,70,70,1)'
}

const StyledPage = styled.div`
  background: white;
  color: ${({ theme }) => theme.black};
`

const Inner = styled.div`
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 0 auto;
  padding: 2rem;
`

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'what_time_is_it';
    src: url('/static/WHATRG__.TTF');
    format: ('tff');
    font-weight: normal;
    font-style: normal;
  }
  html {
    box-sizing: border-box;
    font-size: 10px;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }
  body {
    padding: 0;
    margin: 0;
    font-size: 1.5rem;
    line-height: 2;
    font-family: 'what_time_is_it';
  }
  a {
    text-decoration: none;
    color: ${({ theme }) => theme.black}
  }
`

class Page extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <StyledPage>
          <Meta />
          <Header />
          <Inner>{this.props.children}</Inner>
        </StyledPage>
      </ThemeProvider>
    );
  }
}

export default Page;