import React from 'react'
import { Link } from 'react-router-dom'
import { Query } from 'react-apollo'
import { gql } from 'apollo-boost'

const INVENTORY_ITEMS_QUERY = gql`
  query inventoryItems {
    inventoryItems {
      id
      item {
        id
        name
      }
      add_date
      expiration
      amount
    }
  }
`

const Inventory = () => {
  return (
    <Query query={INVENTORY_ITEMS_QUERY}>
      {({ data, loading, error }) => {
        if (loading) return <p>Loading...</p>
        if (error) return <p>Error</p>

        return (
          <div>
            <h1>Inventory</h1>
            <Link to="/">Home</Link>
            <ul>
              {data.inventoryItems.map((inventoryItem) => (
                <li>
                  <span>{inventoryItem.item.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )
      }}
    </Query>
  )
}

export default Inventory
