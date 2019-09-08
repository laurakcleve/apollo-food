import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { withApollo } from 'react-apollo'

const Sidebar = ({ filter }) => {
  const { loading, error, data } = useQuery(LOCATIONS_QUERY)

  return (
    <StyledSidebar>
      <Locations>
        <h3>Locations</h3>
        {!loading &&
          !error &&
          [{ id: Date.now(), name: 'all' }]
            .concat(data.itemLocations)
            .map((location) => (
              <div
                role="button"
                tabIndex="-1"
                onClick={() => filter(location.name)}
                key={location.id}
              >
                {location.name}
              </div>
            ))}
      </Locations>
    </StyledSidebar>
  )
}

const StyledSidebar = styled.div`
  flex: 0 0 200px;
`

const Locations = styled.div``

const LOCATIONS_QUERY = gql`
  query itemLocations {
    itemLocations {
      id
      name
    }
  }
`

Sidebar.propTypes = {
  filter: PropTypes.func.isRequired,
}

export default withApollo(Sidebar)
