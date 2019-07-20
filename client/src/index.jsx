import React from 'react'
import { render } from 'react-dom'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'
import { BrowserRouter, Route } from 'react-router-dom'

import Home from './components/Home'
import Items from './components/Items'
import Item from './components/Item'
import Inventory from './components/Inventory/Inventory'
import Dishes from './components/Dishes'
import Purchases from './components/Purchases'

const client = new ApolloClient({ uri: 'http://localhost:4000/graphql' })

render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <Route exact path="/" component={Home} />
      <Route exact path="/items" component={Items} />
      <Route exact path="/item/:id" component={Item} />
      <Route exact path="/inventory" component={Inventory} />
      <Route exact path="/dishes" component={Dishes} />
      <Route exact path="/Purchases" component={Purchases} />
    </BrowserRouter>
  </ApolloProvider>,
  document.getElementById('root')
)
