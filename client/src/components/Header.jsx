import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Link, withRouter } from 'react-router-dom'

const Header = ({ location }) => {
  return (
    <StyledHeader>
      <div>
        <StyledLink to="/" pathname={location.pathname}>
          Home
        </StyledLink>
        <StyledLink to="/inventory" pathname={location.pathname}>
          Inventory
        </StyledLink>
      </div>
    </StyledHeader>
  )
}

const StyledHeader = styled.header`
  div {
    display: flex;
    align-items: flex-end;
    max-width: ${({ theme }) => theme.containerWidth};
    margin: 0 auto;
  }
`

const StyledLink = styled(Link)``

Header.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
}

export default withRouter(Header)
