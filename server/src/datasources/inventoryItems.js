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

  getLocation({ inventoryItemID }) {
    const queryString = `
      SELECT inventory_item_location.*
      FROM inventory_item_location
      INNER JOIN inventory_item 
        ON inventory_item.location_id = inventory_item_location.id
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
    category,
    location,
  }) {
    const queryString = `
      WITH retrieved_item_id AS (
        SELECT item_id_for_insert($1) 
      ), retrieved_counts_as_item_id AS (
        SELECT item_id_for_insert($5)
      ), retrieved_location_id AS (
        SELECT location_id_for_insert($6)
      ),
      counts_as_insert AS (
        INSERT INTO item_counts_as(specific_item_id, generic_item_id)
        SELECT (SELECT * FROM retrieved_item_id), (SELECT * FROM retrieved_counts_as_item_id)
        WHERE $5 != ''
          AND ((SELECT generic_item_id 
                FROM item_counts_as
                WHERE specific_item_id = (SELECT * FROM retrieved_item_id)) 
                  != (SELECT * FROM retrieved_counts_as_item_id)
              OR (SELECT * FROM retrieved_item_id) 
                NOT IN (SELECT specific_item_id FROM item_counts_as)
              )
      )
      INSERT INTO inventory_item(item_id, add_date, expiration, amount, location_id)
      SELECT 
        (SELECT * FROM retrieved_item_id), 
        $2 AS add_date, 
        $3 AS expiration, 
        $4 AS amount, 
        (SELECT * FROM retrieved_location_id) as location_id
      RETURNING *
    `
    return client
      .query(queryString, [name, addDate, expiration, amount, countsAs, location])
      .then((results) => {
        const updateShelflifeQueryString = `
          UPDATE item
          SET default_shelflife = $1
          WHERE id = $2
          RETURNING *
        `
        return client
          .query(updateShelflifeQueryString, [
            defaultShelflife,
            results.rows[0].item_id,
          ])
          .then(() => {
            const categoryQueryString = `
            UPDATE item
            SET category_id = (SELECT category_id_for_insert($1))
            WHERE id = $2
            RETURNING *
          `
            return client
              .query(categoryQueryString, [category, results.rows[0].item_id])
              .then(() => {
                return Promise.resolve(results.rows[0])
              })
          })
      })
  }

  updateInventoryItem({ id, addDate, amount, expiration, category, location }) {
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
      .then((results) => {
        const categoryQueryString = `
          UPDATE item
          SET category_id = (SELECT category_id_for_insert($1))
          WHERE id = $2
          RETURNING *
        `
        return client
          .query(categoryQueryString, [category, results.rows[0].item_id])
          .then(() => {
            const locationQueryString = `
              UPDATE inventory_item
              SET location_id = (SELECT location_id_for_insert($1))
              WHERE id = $2
              RETURNING *
            `
            return client
              .query(locationQueryString, [location, results.rows[0].id])
              .then(() => Promise.resolve(results.rows[0]))
          })
      })
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
