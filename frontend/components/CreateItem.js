import React, { Component } from 'react';
import { Mutation } from 'react-apollo'
import Router from 'next/router'
import gql from 'graphql-tag'
import Form from './styles/Form'
import formatMoney from '../lib/formatMoney'
import Error from './ErrorMessage'

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION (
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ){
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`

class CreateItem extends Component {
  state = {
    title: 'Cool shoes',
    description: 'Here is a test description',
    image: '',
    largeImage: '',
    price: 5000, // null string, otherwise number
  }
  handleChange = e => {
    const { name, type, value } = e.target
    const val = type === 'number' ? (value === '' ? '' : parseFloat(value)) : value
    this.setState({ [name]: val })
  }

  uploadFile = async e => {
    console.log('upload file')
    const files = e.target.files
    const data = new FormData()
    data.append('file', files[0])
    data.append('upload_preset', 'garb-n-go')

    const res = await fetch 
    ('https://api.cloudinary.com/v1_1/dbjxdgmy3/image/upload', {
      method: 'POST',
      body: data,
    })
    const file = await res.json()
    console.log(file)
    this.setState({
      image: file.secure_url,
      largeImage: file.eager[0].secure_url,
    })
  }
  render() {
    return (
      <Mutation
        mutation={CREATE_ITEM_MUTATION}
        variables={this.state}
      >
        {(createItem, { loading, error }) => (
          <Form onSubmit={async e => {
            e.preventDefault()
            const res = await createItem()
            Router.push({
              pathname: '/item',
              query: { id: res.data.createItem.id }
            })
            this.setState
          }}>
            <Error error={error} />
            <fieldset disabled={loading} aria-busy={loading}>
            <label htmlFor='file'>
              Upload File
              <input 
                type='file' 
                id='file' 
                name='file'
                placeholder='Upload an image'
                required
                onChange={this.uploadFile}
              />
              {this.state.image && <img width='200' src={this.state.image} alt="Upload Preview"></img>}
            </label>  
            <label htmlFor='title'>
                Title
                <input 
                  type='text' 
                  id='title' 
                  name='title' 
                  placeholder='Enter a title' 
                  required
                  value={this.state.title}
                  onChange={this.handleChange}
                />
              </label>
              <label htmlFor='title'>
                Price
                <input 
                  type='number' 
                  id='price' 
                  name='price' 
                  placeholder='Enter the price' 
                  required
                  value={this.state.price}
                  onChange={this.handleChange}
                />
              </label>
              <label htmlFor='description'>
                Description
                <textarea 
                  id='description' 
                  name='description' 
                  placeholder='Enter the description' 
                  required
                  value={this.state.description}
                  onChange={this.handleChange}
                />
              </label>
              <button type='submit'>Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>

    );
  }
}

export default CreateItem;
export { CREATE_ITEM_MUTATION }