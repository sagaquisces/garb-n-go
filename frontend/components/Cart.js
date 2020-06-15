import React from 'react'
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { adopt } from 'react-adopt'
import User from './User'
import CartStyles from './styles/CartStyles'
import Supreme from './styles/Supreme'
import CloseButton from './styles/CloseButton'
import Button from './styles/Button'
import CartItem from './CartItem'
import formatMoney from '../lib/formatMoney'
import calcTotalPrice from '../lib/calcTotalPrice'
import TakeMyMoney from './TakeMyMoney'

const LOCAL_STATE_QUERY = gql`
  query {
    cartOpen @client
  }
`

const TOGGLE_CART_MUTATION = gql`
  mutation {
    toggleCart @client
  }
`

const Composed = adopt({
  user: ({ render }) => <User>{render}</User>,
  toggleCart: ({ render }) => <Mutation mutation={TOGGLE_CART_MUTATION}>{render}</Mutation>,
  localState: ({ render }) => <Query query={LOCAL_STATE_QUERY}>{render}</Query>,
})

const Cart = (props) =>
  <Composed>
    {({ user, toggleCart, localState }) => {
      if(!user.data) return null
      const me = user.data.me
      console.log("ME+++++++++++++++")
      console.log(me)
      return (
        <CartStyles open={localState.data.cartOpen}>
          <header>
            <CloseButton onClick={toggleCart} title='close'>&times;</CloseButton>
            <Supreme>{ me ? me.name : '' } Cart</Supreme>
            <p>You have <strong>{me ? me.cart.length : ''}</strong> Item{(me && me.cart.length !== 1) ? 's' : ''} in your cart.</p>
          </header>
          <ul>
            {me ? me.cart.map(cartItem => <CartItem key={cartItem.id} cartItem={cartItem} />) : null}
          </ul>
          <footer>
            <p>{me ? formatMoney(calcTotalPrice(me.cart)) : ''}</p>
            {(me && me.cart.length) ? (
              <TakeMyMoney>
                <Button>CHECKOUT</Button>
              </TakeMyMoney>
            ) : null}
          </footer>
        </CartStyles>
      )
    }}
  </Composed>

export default Cart
export {
  LOCAL_STATE_QUERY,
  TOGGLE_CART_MUTATION,
}