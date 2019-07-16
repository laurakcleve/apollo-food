import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { gql } from 'apollo-boost'
import { Query, Mutation } from 'react-apollo'

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
  const [itemName, setItemName] = useState('')

  const submitItem = (addItem, event) => {
    event.preventDefault()
    addItem()
  }

  return (
    <>
      <Query query={ITEMS_QUERY}>
        {({ data, loading, error }) => {
          if (loading) return <p>Loading...</p>
          if (error) return <p>Error</p>

          return (
            <div>
              <h1>Items</h1>
              <Link to="/">Home</Link>
              <ul>
                {data.items.map((item) => (
                  <li key={item.id}>{item.name}</li>
                ))}
              </ul>
            </div>
          )
        }}
      </Query>

      <form>
        <label htmlFor="itemName">
          <span>Add an item:</span>
          <input
            id="itemName"
            type="text"
            value={itemName}
            onChange={(event) => setItemName(event.target.value)}
          />
        </label>

        <Mutation
          mutation={ADD_ITEM_MUTATION}
          variables={{ itemName }}
          refetchQueries={[{ query: ITEMS_QUERY }]}
          onCompleted={() => setItemName('')}
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
