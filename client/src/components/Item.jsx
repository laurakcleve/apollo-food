import React from 'react'
import { Query } from 'react-apollo'
import { gql } from 'apollo-boost'

const Item = ({ match }) => {
  const itemID = match.params.id

  const ITEM_QUERY = gql`
    query item($id: ID!) {
      item(id: $id) {
        id
        name
      }
    }
  `

  return (
    <Query query={ITEM_QUERY} variables={{ id: itemID }}>
      {({ data, loading, error }) => {
        if (loading) return <p>Loading...</p>
        if (error) return <p>Error</p>
        return (
          <div>
            <h1>{data.item.name}</h1>
          </div>
        )
      }}
    </Query>
  )
}

export default Item
