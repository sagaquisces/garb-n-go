import styled from 'styled-components'

const Button = styled.button`
  background-color: #209CEE;
  color: white;
  border: none;
  padding: 16px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: ${props => (props.custom || '16px')};
  margin: 4px 2px;
  transition-duration: 0.4s;
  cursor: pointer;

  &:hover {
    background-color: white;
    color: black;
  }
`

export default Button