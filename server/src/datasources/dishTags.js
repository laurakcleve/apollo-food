const { DataSource } = require('apollo-datasource')
const client = require('./client')

class DishTagsAPI extends DataSource {
  initialize(config) {
    this.context = config.context
  }

  getTags() {
    const queryString = `
      SELECT * 
      FROM dish_tag 
    `
    return client.query(queryString).then((results) => Promise.resolve(results.rows))
  }
}

module.exports = DishTagsAPI
