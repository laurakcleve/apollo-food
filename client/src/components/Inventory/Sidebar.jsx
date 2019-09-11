import React from 'react'
import styled from 'styled-components'
import { useQuery, useApolloClient, useMutation } from '@apollo/react-hooks'
import { withApollo } from 'react-apollo'

import {
  LOCATIONS_QUERY,
  SORT_AND_FILTER_INVENTORY_ITEMS_MUTATION,
} from '../../queries'

const Sidebar = () => {
  const client = useApolloClient()
  const { loading, error, data } = useQuery(LOCATIONS_QUERY)
  const [sortAndFilterInventoryItems] = useMutation(
    SORT_AND_FILTER_INVENTORY_ITEMS_MUTATION
  )

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
                onClick={() => {
                  client.writeData({
                    data: { currentInventoryFilter: location.name },
                  })
                  sortAndFilterInventoryItems()
                }}
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

export default withApollo(Sidebar)
