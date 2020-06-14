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

const tallyTotalItems = (cart) => {
  return cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0)
}

class TakeMyMoney extends React.Component {
  onToken = (res) => {
    console.log('onToken called')
    console.log(res)
  }
  render() {
    return (
      <User>
        {({ data }) => {
          const totalItems = tallyTotalItems(data.me.cart)
          return (
            <StripeCheckout
              amount={calcTotalPrice(data.me.cart)}
              name="garb-n-go"
              description={`Order of ${totalItems} item${totalItems !== 1 ? 's' : ''}.`}
              image={data.me.cart[0].item && data.me.cart[0].item.image}
              stripeKey="pk_test_51GtoicDlB0VyXWnKnOccsPuDjTItxppzLnluwc3VgiNKoCKamWu6ytmFMZC5cipje3t9U1NqSE3z5Hg827UJ1rnV00MPJvuTPE"
              currency="USD"
              email={data.me.email}
              token={res => this.onToken(res)}
            >
              {this.props.children}
            </StripeCheckout>
          )
        }}
      </User>
    )
  }
}

export default TakeMyMoney