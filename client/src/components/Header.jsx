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

        <StyledLink to="/dishes" pathname={location.pathname}>
          Dishes
        </StyledLink>

        <StyledLink to="/items" pathname={location.pathname}>
          Items
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

const StyledLink = styled(Link)`
  margin-right: 10px;
`

Header.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
}

export default withRouter(Header)
