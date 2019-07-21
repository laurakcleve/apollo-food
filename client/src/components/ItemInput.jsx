import React from 'react'
import { Query } from 'react-apollo'
import { gql } from 'apollo-boost'

const ITEMS_QUERY = gql`
  query items {
    items {
      id
      name
    }
  }
`

const ItemInput = React.forwardRef(({ newItemName, setNewItemName }, ref) => {
  return (
    <Query query={ITEMS_QUERY}>
      {({ data, loading, error }) => {
        if (loading) return <p>Loading...</p>
        if (error) return <p>Error</p>

        return (
          <>
            <input
              ref={ref}
              type="text"
              list="itemList"
              value={newItemName}
              onChange={(event) => setNewItemName(event.target.value)}
            />
            <datalist id="itemList">
              {data.items.map((item) => (
                <option key={item.id}>{item.name}</option>
              ))}
            </datalist>
          </>
        )
      }}
    </Query>
  )
})

export default ItemInput
