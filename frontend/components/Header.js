import Nav from './Nav'
import Link from 'next/link'
import styled from 'styled-components'
import Router from 'next/router'
import NProgress from 'nprogress'
import Cart from './Cart'
// import Search from './Search.hide'

Router.onRouteChangeStart = () => {
  NProgress.start()
}

Router.onRouteChangeComplete = () => {
  NProgress.done()
}

Router.onRouteChangeError = () => {
  NProgress.done()
}

const Logo = styled.h1`
  font-size: 4rem;
  margin-left: 2rem;
  margin-bottom: 0rem;
  margin-top: 0rem;
  position: relative;
  z-index: 2;
  -webkit-filter: drop-shadow(${({theme}) => theme.bs});
  filter        : drop-shadow(${({theme}) => theme.bs});
  

  a {
    padding: 0.5rem 0rem 0.5rem 1rem;
    background: ${({ theme }) => theme.blue};
    color: white;
    text-transform: lowercase;
    text-decoration: none;
    &:after {
      top: 50%;
      border: solid transparent;
      content: ' ';
      height: 0;
      width: 0;
      position: absolute;
      border-left-color: ${({theme}) => theme.blue};
      border-width: 3rem;
      margin-top: -3rem;
    }
  }

  @media (max-width: 1300px) {
    margin: 0;
    text-align: center;
  }
`

const StyledHeader = styled.header`
  .bar {
    background-color: ${({ theme }) => theme.yellow};
    border-bottom: 10px solid ${({ theme }) => theme.yellow};
    display: grid;
    grid-template-columns: auto 1fr;
    justify-content: space-between;
    align-items: stretch;
    @media (max-width: 1300px) {
      grid-template-columns: 1fr;
      justify-content: center;
    }
  }

  .sub-bar {
    display: grid;
    grid-template-columns: auto 1fr;
    border-bottom: 1px solid ${({ theme }) => theme.lightgrey};
    box-shadow: ${({theme}) => theme.bs};
  }
`

const Header = () =>
  <StyledHeader>
    <div className='bar'>
      <Logo>
        <Link href='/'>
          <a>garb-n-go</a>
        </Link>
      </Logo>
      <Nav />
    </div>
{/*
    <div className='sub-bar'>
      <Search />
    </div>
*/}
    <Cart />
  </StyledHeader>

export default Header