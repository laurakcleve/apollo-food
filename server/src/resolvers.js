const pg = require('pg')

const client = new pg.Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
})
client.connect()

const resolvers = {
  Query: {
    items: () =>
      client
        .query('SELECT * FROM item')
        .then((results) => Promise.resolve(results.rows)),
    item: (parent, args) =>
      client
        .query('SELECT * FROM item WHERE id = $1', [Number(args.id)])
        .then((results) => Promise.resolve(results.rows[0])),
  },
  Mutation: {
    addItem: (parent, args) =>
      client
        .query('INSERT INTO item(name) VALUES($1) RETURNING *', [args.name])
        .then((results) => Promise.resolve(results.rows[0])),
    deleteItem: (parent, args) =>
      client
        .query('DELETE FROM item WHERE id = $1', [Number(args.id)])
        .then((results) => Promise.resolve(results.rowCount)),
  },
}

module.exports = resolvers
