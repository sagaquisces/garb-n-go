import { Query } from 'react-apollo'
import Error from './ErrorMessage'
import gql from 'graphql-tag'
import Table from './styles/Table'
import Button from './styles/Button'

const possiblePermissions = [
  'ADMIN',
  'USER',
  'ITEMCREATE',
  'ITEMUPDATE',
  'ITEMDELETE',
  'PERMISSIONUPDATE',
]

const ALL_ITEMS_QUERY = gql`
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
  <Query query={ALL_ITEMS_QUERY}>
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
          {data && data.users.map(user => <User key={user.id} user={user}/>)}
          </tbody>
        </Table>
      </div>
    )}
      
  </Query>
)

class User extends React.Component {
  render() {
    const user = this.props.user
    return (
      <tr>
        <td>{user.name}</td>
        <td>{user.email}</td>
        {possiblePermissions.map(permission => (
          <td key={permission}>
            <label htmlFor={`${user.id}-permission-${permission}`}>
              <input type='checkbox' />
            </label>
          </td>
        ))}
        <td><Button>Update</Button></td>
      </tr>
    )
  }
}

export default Permissions