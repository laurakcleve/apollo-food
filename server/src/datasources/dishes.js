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

  addDish({ name, ingredientSets }) {
    console.log(ingredientSets)
    const queryString = `
      WITH new_dish_id AS (
        INSERT INTO item(name)
        VALUES($1)
        RETURNING id
      )
      DO
      $do$
      DECLARE
        item_sets_counter := ${ingredientSets.ingredientSets.length};
      BEGIN
        WHILE item_sets_counter > 0
        LOOP
          RAISE NOTICE 'count is %', item_sets_counter;
        END LOOP;
      END
      $do$
    `
    return client
      .query(queryString, [name])
      .then((results) => Promise.resolve(results.rows[0]))
  }
}

module.exports = DishesAPI
