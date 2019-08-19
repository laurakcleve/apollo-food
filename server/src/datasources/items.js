const { DataSource } = require('apollo-datasource')
const client = require('./client')

class ItemsAPI extends DataSource {
  initialize(config) {
    this.context = config.context
  }

  getItems() {
    const queryString = `
      SELECT * 
      FROM item 
    `
    return client.query(queryString).then((results) => Promise.resolve(results.rows))
  }

  getItem({ id }) {
    const queryString = `
      SELECT * 
      FROM item 
      WHERE id = $1
    `
    return client
      .query(queryString, [Number(id)])
      .then((results) => Promise.resolve(results.rows[0]))
  }

  getItemCountsAs({ itemID }) {
    const queryString = `
      SELECT generic.* 
      FROM item generic
      INNER JOIN item_counts_as ica ON ica.generic_item_id = generic.id
      INNER JOIN item specific ON specific.id = ica.specific_item_id
      WHERE specific.id = $1
    `
    return client
      .query(queryString, [Number(itemID)])
      .then((results) => Promise.resolve(results.rows))
  }

  getItemDishes({ itemID }) {
    const queryString = `
      SELECT dish.*
      FROM item dish
      INNER JOIN ingredient_set ings ON ings.parent_item_id = dish.id
      INNER JOIN ingredient ing ON ing.ingredient_set_id = ings.id
      INNER JOIN item i ON i.id = ing.item_id
      WHERE i.id = $1
    `
    return client
      .query(queryString, [Number(itemID)])
      .then((results) => Promise.resolve(results.rows))
  }

  addItem({ name }) {
    const queryString = `
      INSERT INTO item(name)
      VALUES($1) 
      RETURNING *
    `
    return client
      .query(queryString, [name])
      .then((results) => Promise.resolve(results.rows[0]))
  }

  deleteItem({ id }) {
    const queryString = `
      DELETE FROM item
      WHERE id = $1
    `
    return client
      .query(queryString, [Number(id)])
      .then((results) => Promise.resolve(results.rowCount))
  }
}

module.exports = ItemsAPI
