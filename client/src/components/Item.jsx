import React from 'react'
import { Query, Mutation } from 'react-apollo'
import { gql } from 'apollo-boost'

const Item = ({ match, history }) => {
  const itemID = match.params.id

  const ITEM_QUERY = gql`
    query item($id: ID!) {
      item(id: $id) {
        id
        name
      }
    }
  `

  const DELETE_ITEM_MUTATION = gql`
    mutation deleteItem($itemID: ID!) {
      deleteItem(id: $itemID)
    }
  `

  return (
    <Query query={ITEM_QUERY} variables={{ id: itemID }}>
      {({ data, loading, error }) => {
        if (loading) return <p>Loading...</p>
        if (error) return <p>Error</p>
        return (
          <>
            <div>
              <h1>{data.item.name}</h1>
            </div>
            <Mutation
              mutation={DELETE_ITEM_MUTATION}
              variables={{ itemID: data.item.id }}
              onCompleted={() => history.push('/items')}
            >
              {(deleteItem) => (
                <button type="button" onClick={deleteItem}>
                  Delete
                </button>
              )}
            </Mutation>
          </>
        )
      }}
    </Query>
  )
}

export default Item
