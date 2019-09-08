const { DataSource } = require('apollo-datasource')
const client = require('./client')

class CategoriesAPI extends DataSource {
  initialize(config) {
    this.context = config.context
  }

  getCategories() {
    const queryString = `
      SELECT * 
      FROM item_category 
    `
    return client.query(queryString).then((results) => Promise.resolve(results.rows))
  }
}

module.exports = CategoriesAPI
