import React, { Component } from 'react';
import PropTypes from 'prop-types'
import Link from 'next/link'
import Title from './styles/Title'
import ItemStyles from './styles/ItemStyles'
import PriceTag from './styles/PriceTag'
import DeleteItem from './DeleteItem'
import formatMoney from '../lib/formatMoney'
import AddToCart from './AddToCart'
import { ALL_ITEMS_QUERY } from './Items'

class Item extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
  }

  handleCacheUpdate = (cache, payload) => {
    // update cache on client
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY })
    console.log("payload.data.deleteItem.id ==>")
    console.log(payload.data.deleteItem.id)
    console.log("DATA ==>")
    console.log(data)
    // for reasons of immutability, I need to make a copy
    const newData = {...data}
    // and then filter out the deleted item
    newData.items = newData.items.filter(item => item.id !== payload.data.deleteItem.id)
    // put the items back
    cache.writeQuery({ query: ALL_ITEMS_QUERY, data: newData})
  }
  render() {
    const { item } = this.props
    return (
      <ItemStyles>
        {item.image && <img src={item.image} alt={item.title} />}
        <Title>
          <Link href={{
            pathname: '/item',
            query: {id: item.id}
          }}>
            <a>{item.title}</a>
          </Link>
        </Title>
        <PriceTag>{formatMoney(item.price)}</PriceTag>
        <p>{item.description}</p>

        <div className='buttonList'>
          <Link
            href={{
              pathname: 'update',
              query: { id: item.id },
            }}
          >
            <button>Edit</button>
          </Link>
          <AddToCart id={item.id} />
          <DeleteItem id={item.id} update={this.handleCacheUpdate}>Delete This Item</DeleteItem>
        </div>
      </ItemStyles>
    );
  }
}

export default Item;