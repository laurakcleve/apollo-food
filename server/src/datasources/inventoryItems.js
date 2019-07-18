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
}

module.exports = InventoryItemsAPI
