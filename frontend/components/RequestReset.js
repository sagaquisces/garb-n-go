import React, { Component } from 'react';
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Form from './styles/Form'
import Error from './ErrorMessage'

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`

class RequestReset extends Component {
  state = {
    email: ''
  }
  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }
  render() {
    return (
      <Mutation 
        mutation={REQUEST_RESET_MUTATION} 
        variables={this.state}
      >
        {(reset, { error, loading, called }) => {
          return (
            <Form method="post" onSubmit={async e => {
              e.preventDefault()
              const success = await reset()
              this.setState({
                email: '',
                password: ''
              })
            }}>
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Request a password reset</h2>
                <Error error={error} />
                {!error && !loading && called && <p>Success! Check your email for a reset link.</p>}
                <label htmlFor="email">
                  Email 
                  <input 
                    type='email' 
                    name='email'
                    placeholder='email'
                    value={this.state.email}
                    onChange={this.handleChange}
                  />
                </label>
      
                <button type='submit'>Request Reset</button>
              </fieldset>
            </Form>
          )
        }}
      </Mutation>
    );
  }
}

export default RequestReset;