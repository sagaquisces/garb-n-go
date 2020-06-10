import { Mutation, Query } from 'react-apollo'
import Error from './ErrorMessage'
import gql from 'graphql-tag'
import Table from './styles/Table'
import Button from './styles/Button'
import PropTypes from 'prop-types'

const possiblePermissions = [
  'ADMIN',
  'USER',
  'ITEMCREATE',
  'ITEMUPDATE',
  'ITEMDELETE',
  'PERMISSIONUPDATE',
]

const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation updatePermissions($permissions: [Permission], $userId: ID!) {
    updatePermissions(permissions: $permissions, userId: $userId) {
      id
      permissions
      name
      email
    }
  }
`

const ALL_USERS_QUERY = gql`
  query {
    users {
      id
      name
      email
      permissions
    }
  }
`

const Permissions = props => (
  <Query query={ALL_USERS_QUERY}>
    {({data, error, loading }) => console.log(data, error, loading) || (
      <div>
        
        <h2>Manage Permissions</h2>
        <Error error={error} />
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              {possiblePermissions.map(permission => 
                <th key={permission}>{permission}</th>
              )}
              <th>👇🏻</th>
            </tr>
          </thead>
          <tbody>
          {data && data.users.map(user => <UserPermissions key={user.id} user={user}/>)}
          </tbody>
        </Table>
      </div>
    )}
      
  </Query>
)

class UserPermissions extends React.Component {
  static propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      id: PropTypes.string,
      permissions: PropTypes.array,
    }).isRequired,
  }
  // ok to seed state from props
  state = {
    permissions: this.props.user.permissions,
  }
  handlePermissionChange = e => {
    const checkbox = e.target
    let updatedPermissions = [...this.state.permissions]
    if(checkbox.checked) {
      updatedPermissions.push(checkbox.value)
    } else {
      updatedPermissions = updatedPermissions.filter(permission => permission !== checkbox.value)
    }
    this.setState({ permissions: updatedPermissions })
    console.log(updatedPermissions)
  }
  render() {
    const user = this.props.user
    return (
      <Mutation
        mutation={UPDATE_PERMISSIONS_MUTATION}
        variables={{
          permissions: this.state.permissions,
          userId: this.props.user.id
        }}
      >
        {(updatePermissions, {loading, error}) => (
          <>
            {error && <tr><td colspan='9'><Error error={error}/></td></tr>}
            <tr>
              <td>{user.name}</td>
              <td>{user.email}</td>
              {possiblePermissions.map(permission => (
                <td key={permission}>
                  <label htmlFor={`${user.id}-permission-${permission}`}>
                    <input 
                      type='checkbox'
                      id={`${user.id}-permission-${permission}`}
                      checked={this.state.permissions.includes(permission)}
                      value={permission}
                      onChange={this.handlePermissionChange}
                    />
                  </label>
                </td>
              ))}
              <td>
                <Button
                  type='button'
                  disabled={loading}
                  onClick={updatePermissions}
                >
                  Updat{loading ? 'ing' : 'e'}
                </Button>
              </td>
            </tr>
          </>
        )}
      </Mutation>

    )
  }
}

export default Permissions