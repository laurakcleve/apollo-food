import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { withApollo } from 'react-apollo'

const Sidebar = ({ addFilter, currentFilters }) => {
  const { loading, error, data } = useQuery(DISH_TAGS_QUERY)

  return (
    <StyledSidebar>
      <Tags>
        <h3>Tags</h3>
        {!loading &&
          !error &&
          [{ id: Date.now(), name: 'all' }].concat(data.dishTags).map((tag) => (
            <React.Fragment key={tag.id}>
              <label htmlFor={`tag${tag.id}`}>
                <input
                  type="checkbox"
                  id={`tag${tag.id}`}
                  checked={currentFilters.includes(tag.name)}
                  onChange={() => addFilter(tag.name)}
                />
                {tag.name}
              </label>

              <br />
            </React.Fragment>
          ))}
      </Tags>
    </StyledSidebar>
  )
}

const StyledSidebar = styled.div`
  flex: 0 0 200px;
`

const Tags = styled.div``

const DISH_TAGS_QUERY = gql`
  query dishTags {
    dishTags {
      id
      name
    }
  }
`

Sidebar.propTypes = {
  addFilter: PropTypes.func.isRequired,
  currentFilters: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
}

export default withApollo(Sidebar)
