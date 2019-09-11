import React from 'react'
import { render } from 'react-dom'
import ApolloClient, { InMemoryCache } from 'apollo-boost'
import { ApolloProvider } from '@apollo/react-hooks'
import { BrowserRouter, Route } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import typeDefs from './typeDefs'
import resolvers from './resolvers'

import theme from './theme/theme'
import GlobalStyles from './theme/GlobalStyles'
import Layout from './components/Layout'
import Header from './components/Header'
import Home from './components/Home'
import Items from './components/Items'
import Item from './components/Item'
import Inventory from './components/Inventory/Inventory'
import Dishes from './components/Dishes/Dishes'
import Purchases from './components/Purchases'

const cache = new InMemoryCache()

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache,
  typeDefs,
  resolvers,
})

cache.writeData({
  data: {
    sortedFilteredDishes: [],
    currentDishFilters: ['all'],
    currentDishSortBy: 'last date',
    currentDishSortOrder: 'desc',
    sortedFilteredInventoryItems: [],
    currentInventorySortBy: 'expiration',
    currentInventorySortOrder: 'asc',
    currentInventoryFilter: 'all',
  },
})

render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Layout>
          <GlobalStyles />
          <Header />
          <Route exact path="/" component={Home} />
          <Route exact path="/items" component={Items} />
          <Route exact path="/item/:id" component={Item} />
          <Route exact path="/inventory" component={Inventory} />
          <Route exact path="/dishes" component={Dishes} />
          <Route exact path="/Purchases" component={Purchases} />
        </Layout>
      </ThemeProvider>
    </BrowserRouter>
  </ApolloProvider>,
  document.getElementById('root')
)
