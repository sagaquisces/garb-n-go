import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`

class DeleteItem extends Component {
  // update = (cache, payload) => {
  //   console.log("IN UPDATE")
  //   // update cache on client
  //   const data = cache.readQuery({ query: ALL_ITEMS_QUERY })
  //   console.log(data, payload)
  //   //filter deleted item out
  //   data.items = data.items.filter(item => item.id !== payload.data.deleteItem.id)
  //   // put the items back
  //   cache.writeQuery({ query: ALL_ITEMS_QUERY, data})
  // }
  render() {
    return (
      <Mutation 
        mutation={DELETE_ITEM_MUTATION}
        variables={{ id: this.props.id }}
        update={this.props.update}
      >
        {(deleteItem, { error }) => {
          return (
            <button onClick={() => {
              if(confirm("Are you sure you want to delete this item?")) {
                deleteItem()
              }
            }}>{this.props.children}</button>
          )
        }}

      </Mutation>
      
    )
  }
}

export default DeleteItem