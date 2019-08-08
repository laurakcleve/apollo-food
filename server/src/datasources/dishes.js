const { DataSource } = require('apollo-datasource')
const client = require('./client')

class DishesAPI extends DataSource {
  initialize(config) {
    this.context = config.context
  }

  getDishes() {
    const queryString = `
      SELECT *
      FROM item
      WHERE id IN (
        SELECT DISTINCT parent_item_id
        FROM ingredient_set
      )
    `
    return client.query(queryString).then((results) => Promise.resolve(results.rows))
  }

  getDish({ id }) {
    const queryString = `
      SELECT *
      FROM item
      WHERE id = $1 
    `
    return client
      .query(queryString, [Number(id)])
      .then((results) => Promise.resolve(results.rows[0]))
  }
}

module.exports = DishesAPI
