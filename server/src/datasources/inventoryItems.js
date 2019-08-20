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

  addInventoryItem({
    name,
    addDate,
    expiration,
    amount,
    defaultShelflife,
    countsAs,
  }) {
    const queryString = `
      WITH inventory_insert AS (
        INSERT INTO item_counts_as(specific_item_id, generic_item_id)
        SELECT item_id_for_insert($1), item_id_for_insert($6)
        WHERE $6 != ''
          AND ((SELECT generic_item_id 
                FROM item_counts_as
                WHERE specific_item_id = item_id_for_insert($1)) != item_id_for_insert($6)
              OR item_id_for_insert($1) NOT IN (SELECT specific_item_id FROM item_counts_as)
              )
      ), default_shelflife_update AS (
        UPDATE item
        SET default_shelflife = $5
        WHERE id = item_id_for_insert($1)
        RETURNING *
      ) 
      INSERT INTO inventory_item(item_id, add_date, expiration, amount)
      SELECT item_id_for_insert($1), $2 AS add_date, $3 AS expiration, $4 AS amount
      RETURNING *
    `
    return client
      .query(queryString, [
        name,
        addDate,
        expiration,
        amount,
        defaultShelflife,
        countsAs,
      ])
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
