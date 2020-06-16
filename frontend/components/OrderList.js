import React, { Component } from 'react'
import { Query } from 'react-apollo'
import Link from 'next/link'
import styled from 'styled-components'
import gql from 'graphql-tag'
import formatMoney from '../lib/formatMoney'
import { timeDifferenceForDate } from '../lib/timeDifference'
import OrderItemStyles from './styles/OrderItemStyles'
import Error from './ErrorMessage'

const USER_ORDERS_QUERY = gql`
  query userOrdersQuery {
    orders(orderBy: createdAt_DESC) {
      id
      total
      createdAt
      items {
        id
        title
        price
        description
        quantity
        image
      }
    }
  } 
`

const OrderUl = styled.ul`
  display: grid;
  grid-gap: 4rem;
  grid-template-columns: repeat(auto-fit, minmax(50%, 1fr));
`

class OrderList extends Component {
  render() {
    return (
        <Query
          query={USER_ORDERS_QUERY}
        >
          {({data, loading, error}) => {
            if (loading) return <p>Loading...</p>
            if (error) return <Error error={error}/>
            if (!data && !data.orders) return null
            return (
              <div>
                <h2>You have {data.orders.length} order{data.orders.length !== 1 ? 's' : ''}.</h2>
                <OrderUl>
                  {data.orders.map(order => {
                    const numItems = order.items.reduce((a, b) => a + b.quantity, 0)
                    const numProducts = order.items.length
                    return (
                      <OrderItemStyles key={order.id}>
                        <Link href={{
                          pathname: '/order',
                          query: {id: order.id }
                        }}>
                          <a>
                            <div className='order-meta'>
                              <p>{numItems} items.</p>
                              <p>{numProducts} products.</p>
                              <p>{timeDifferenceForDate(order.createdAt)}</p>
                              <p>{formatMoney(order.total)}</p>
                            </div>
                            <div className='images'>
                              {order.items.map(item => (
                                <img key={item.id} src={item.image} alt={item.title} />
                              ))}
                            </div>
                          </a>
                        </Link>
                      </OrderItemStyles>
                    )
                  })}
                </OrderUl>
              </div>
            )
          }}
        </Query>
    )
  }
}

export default OrderList