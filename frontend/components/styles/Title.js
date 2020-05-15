import styled from 'styled-components'

const Title = styled.h3`
  margin: 0 1rem;
  color: white;
  text-align: center;
  transform: skew(-5deg) rotate(-1deg);
  margin-top: -3rem;
  text-shadow: 1px 1px 3px ${({ theme }) => theme.black};
  a {
    background: ${props => props.theme.blue};
    display: inline;
    line-height: 1.3;
    font-size: 4rem;
    text-align: center;
    color: white;
    padding: 0 1rem;
  }
`

export default Title;