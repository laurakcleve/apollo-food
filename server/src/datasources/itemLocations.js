const { DataSource } = require('apollo-datasource')
const client = require('./client')

class ItemLocationsAPI extends DataSource {
  initialize(config) {
    this.context = config.context
  }

  getLocations() {
    const queryString = `
      SELECT * 
      FROM inventory_item_location 
    `
    return client.query(queryString).then((results) => Promise.resolve(results.rows))
  }
}

module.exports = ItemLocationsAPI
