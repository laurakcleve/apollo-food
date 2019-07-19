import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { gql } from 'apollo-boost'
import { Query, Mutation } from 'react-apollo'

import ItemInput from './ItemInput'

const ITEMS_QUERY = gql`
  query items {
    items {
      id
      name
    }
  }
`

const ADD_ITEM_MUTATION = gql`
  mutation addItem($itemName: String!) {
    addItem(name: $itemName) {
      id
      name
    }
  }
`

const Items = () => {
  const [newItemName, setNewItemName] = useState('')

  const submitItem = (addItem, event) => {
    event.preventDefault()
    addItem()
  }

  return (
    <>
      <Query query={ITEMS_QUERY} fetchPolicy="network-only">
        {({ data, loading, error }) => {
          if (loading) return <p>Loading...</p>
          if (error) return <p>Error</p>

          return (
            <div>
              <h1>Items</h1>
              <Link to="/">Home</Link>
              <ul>
                {data.items.map((item) => (
                  <li key={item.id}>
                    <Link to={`/item/${item.id}`}>{item.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )
        }}
      </Query>

      <form>
        <span>Add an item:</span>
        <ItemInput newItemName={newItemName} setNewItemName={setNewItemName} />

        <Mutation
          mutation={ADD_ITEM_MUTATION}
          variables={{ itemName: newItemName }}
          refetchQueries={[{ query: ITEMS_QUERY }]}
          onCompleted={() => setNewItemName('')}
        >
          {(addItem) => (
            <button type="submit" onClick={(event) => submitItem(addItem, event)}>
              Save
            </button>
          )}
        </Mutation>
      </form>
    </>
  )
}

export default Items
