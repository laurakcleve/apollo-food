import React from 'react'
import { Link } from 'react-router-dom'
import { Query } from 'react-apollo'
import { gql } from 'apollo-boost'

import AddForm from './AddForm'

const Dishes = () => {
  return (
    <div>
      <h1>Dishes</h1>
      <Link to="/">Home</Link>
      <Query query={DISHES_QUERY}>
        {({ data, loading, error }) => {
          if (loading) return <p>Loading...</p>
          if (error) return <p>Error</p>

          return (
            <div>
              {data.dishes.map((dish) => (
                <div key={dish.id}>{dish.name}</div>
              ))}
            </div>
          )
        }}
      </Query>

      <AddForm DISHES_QUERY={DISHES_QUERY} />
    </div>
  )
}

const DISHES_QUERY = gql`
  query dishes {
    dishes {
      id
      name
    }
  }
`

export default Dishes
