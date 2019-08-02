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

  addInventoryItem({ name, addDate, expiration, amount, defaultShelflife }) {
    const queryString = `
      WITH new_item_id AS (
        INSERT INTO item(name, default_shelflife)
        SELECT $1, $5
        WHERE NOT EXISTS (
          SELECT 1
          FROM item
          WHERE name = $1
        )
        RETURNING id
      ), existing_item_id AS (
        SELECT id
        FROM item
        WHERE name = $1
      ), item_id_for_insert AS (
        SELECT id 
        FROM new_item_id 
        UNION SELECT id FROM existing_item_id
      ), default_shelflife_update as (
        UPDATE item
        SET default_shelflife = $5
        WHERE id = (SELECT id FROM item_id_for_insert)
        RETURNING *
      )
      INSERT INTO inventory_item(item_id, add_date, expiration, amount)
      SELECT id, $2 AS add_date, $3 AS expiration, $4 AS amount
      FROM (SELECT id FROM item_id_for_insert) AS the_id
      RETURNING *
    `
    return client
      .query(queryString, [name, addDate, expiration, amount, defaultShelflife])
      .then((results) => Promise.resolve(results.rows[0]))
  }

  updateInventoryItem({ id, addDate, amount, expiration }) {
    const queryString = `
      UPDATE inventory_item
      SET add_date = $2,
          amount = $3,
          expiration = $4
      WHERE id = $1
      RETURNING *
    `
    return client
      .query(queryString, [id, addDate, amount, expiration])
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
