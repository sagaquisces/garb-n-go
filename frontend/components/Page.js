import React, { Component } from 'react';
import Meta from './Meta'
import Header from './Header'
import styled, { ThemeProvider, injectGlobal } from 'styled-components'

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

class Page extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
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