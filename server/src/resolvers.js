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
        .query(
          `
            SELECT * 
            FROM item 
          `
        )
        .then((results) => Promise.resolve(results.rows)),

    item: (_, { id }) =>
      client
        .query(
          `
            SELECT * 
            FROM item 
            WHERE id = $1
          `,
          [Number(id)]
        )
        .then((results) => Promise.resolve(results.rows[0])),

    inventoryItems: () =>
      client
        .query(
          `
            SELECT * 
            FROM inventory_item
          `
        )
        .then((results) => Promise.resolve(results.rows)),
  },

  Mutation: {
    addItem: (_, { name }) =>
      client
        .query(
          `
            INSERT INTO item(name) 
            VALUES($1) RETURNING *
          `,
          [name]
        )
        .then((results) => Promise.resolve(results.rows[0])),

    deleteItem: (_, { id }) =>
      client
        .query(
          `
            DELETE FROM item 
            WHERE id = $1
          `,
          [Number(id)]
        )
        .then((results) => Promise.resolve(results.rowCount)),
  },

  InventoryItem: {
    item: (InventoryItem) =>
      client
        .query(
          `
            SELECT item.id, item.name 
            FROM item 
            INNER JOIN inventory_item 
              ON inventory_item.item_id = item.id
            WHERE inventory_item.id = $1
          `,
          [InventoryItem.id]
        )
        .then((results) => Promise.resolve(results.rows[0])),
  },
}

module.exports = resolvers
