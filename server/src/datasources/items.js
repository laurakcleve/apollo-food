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
      SELECT * FROM item 
      WHERE id = $1
    `
    return client
      .query(queryString, [Number(id)])
      .then((results) => Promise.resolve(results.rows[0]))
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
