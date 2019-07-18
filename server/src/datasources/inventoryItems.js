const { DataSource } = require('apollo-datasource')
const client = require('./client')

class InventoryItemsAPI extends DataSource {
  initialize(config) {
    this.context = config.context
  }

  getInventoryItems() {
    const queryString = `
      SELECT * 
      FROM inventory_item 
    `
    return client.query(queryString).then((results) => Promise.resolve(results.rows))
  }

  getInventoryItem({ id }) {
    const queryString = `
      SELECT * FROM inventory_item 
      WHERE id = $1
    `
    return client
      .query(queryString, [Number(id)])
      .then((results) => Promise.resolve(results.rows[0]))
  }

  getInventoryItemItem({ inventoryItemID }) {
    const queryString = `
      SELECT item.id, item.name
      FROM item
      INNER JOIN inventory_item
        ON inventory_item.item_id = item.id
      WHERE inventory_item.id = $1
    `
    return client
      .query(queryString, [Number(inventoryItemID)])
      .then((results) => Promise.resolve(results.rows[0]))
  }

  addInventoryItem({ name, addDate }) {
    const queryString = `
       WITH new_item_id AS (
         INSERT INTO item(name)
         SELECT $1
         WHERE NOT EXISTS (
           SELECT 1
           FROM item
           WHERE name = $1
         )
         RETURNING id
       )
       INSERT INTO inventory_item(item_id, add_date)
       SELECT id, $2 as add_date 
       FROM (
         SELECT id from new_item_id
         UNION
         SELECT id
         FROM item
         WHERE name = $1
       ) as item_id_to_insert
       RETURNING *
    `
    return client
      .query(queryString, [name, addDate])
      .then((results) => Promise.resolve(results.rows[0]))
  }

  deleteInventoryItem({ id }) {
    const queryString = `
      DELETE FROM inventory_item
      WHERE id = $1 
    `
    return client
      .query(queryString, [Number(id)])
      .then((results) => Promise.resolve(results.rowCount))
  }
}

module.exports = InventoryItemsAPI
