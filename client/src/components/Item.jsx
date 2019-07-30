import React from 'react'
import PropTypes from 'prop-types'
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
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this item?'))
                      deleteItem()
                  }}
                >
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

Item.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
}

export default Item
