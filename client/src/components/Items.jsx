import React from 'react'
import { Link } from 'react-router-dom'
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks'

const Items = () => {
  const { loading, error, data } = useQuery(ITEMS_QUERY, {
    fetchPolicy: 'network-only',
  })

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error</p>

  return (
    <>
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
    </>
  )
}

const ITEMS_QUERY = gql`
  query items {
    items {
      id
      name
    }
  }
`

export default Items
