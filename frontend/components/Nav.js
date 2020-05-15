import Link from 'next/link'
import NavStyles from './styles/NavStyles'

const Nav = () =>
  <NavStyles>
    <Link href='/'>
      <a>home</a>
    </Link>
    <Link href='/'>
      <a>shop</a>
    </Link>
    <Link href='/sell'>
      <a>sell</a>
    </Link>
    <Link href='/'>
      <a>signup</a>
    </Link>
    <Link href='/'>
      <a>orders</a>
    </Link>
    <Link href='/'>
      <a>me</a>
    </Link>
  </NavStyles>

export default Nav