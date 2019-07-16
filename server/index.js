const { ApolloServer } = require('apollo-server')
const pg = require('pg')
require('dotenv').config()

const client = new pg.Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
})
client.connect()

const typeDefs = `
  type Query {
    items: [Item]!
  }
  
  type Mutation {
    addItem(name: String!): Item!
  }

  type Item {
    id: ID!
    name: String!
  }
`

const resolvers = {
  Query: {
    items: () =>
      client
        .query('SELECT * FROM item')
        .then((results) => Promise.resolve(results.rows)),
  },
  Mutation: {
    addItem: (parent, args) => {
      console.log('args.name:', args.name)
      return client
        .query('INSERT INTO item(name) VALUES($1) RETURNING *', [args.name])
        .then((results) => Promise.resolve(results.rows[0]))
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => console.log(`Running on ${url}`))
