import React from 'react'
import StripeCheckout from 'react-stripe-checkout'
import { Mutation } from 'react-apollo'
import Router from 'next/router'
import NProgress from 'nprogress'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import calcTotalPrice from '../lib/calcTotalPrice'
import Error from './ErrorMessage'
import User, { CURRENT_USER_QUERY } from './User'

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($token: String!) {
    createOrder(token: $token) {
      id
      charge
      total
      items {
        id
        title
      }
    }
  }
`

const tallyTotalItems = (cart) => {
  return cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0)
}

class TakeMyMoney extends React.Component {
  onToken = async (res, createOrder) => {
    console.log('onToken called')
    console.log(res)
    const order = await createOrder({
      variables: {
        token: res.id
      },
    }).catch(err => {
      alert(err.message)
    })
    console.log(order)
  }
  render() {
    return (
      <User>
        {({ data }) => {
          const totalItems = tallyTotalItems(data.me.cart)
          return (
            <Mutation
              mutation={CREATE_ORDER_MUTATION}
              refetchQueries={[{ query: CURRENT_USER_QUERY }]}
            >
              {createOrder => (
                <StripeCheckout
                  amount={calcTotalPrice(data.me.cart)}
                  name="garb-n-go"
                  description={`Order of ${totalItems} item${totalItems !== 1 ? 's' : ''}.`}
                  image={(data.me.cart.length && data.me.cart[0].item) ? data.me.cart[0].item.image : ''}
                  stripeKey="pk_test_51GtoicDlB0VyXWnKnOccsPuDjTItxppzLnluwc3VgiNKoCKamWu6ytmFMZC5cipje3t9U1NqSE3z5Hg827UJ1rnV00MPJvuTPE"
                  currency="USD"
                  email={data.me.email}
                  token={res => this.onToken(res, createOrder)}
                >
                  {this.props.children}
                </StripeCheckout>
              )}
            </Mutation>
          )
        }}
      </User>
    )
  }
}

export default TakeMyMoney