import React from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import { gql } from 'apollo-boost'

const ITEMS_QUERY = gql`
  query items {
    items {
      id
      name
      default_shelflife
    }
  }
`

const ItemInput = React.forwardRef(
  ({ newItemName, setNewItemName, setNewItemShelflife, checkShelflife }, ref) => {
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
                onChange={(event) => {
                  setNewItemShelflife('')
                  setNewItemName(event.target.value)
                }}
                onBlur={checkShelflife}
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
  }
)

ItemInput.propTypes = {
  newItemName: PropTypes.string.isRequired,
  setNewItemName: PropTypes.func.isRequired,
}

export default ItemInput
