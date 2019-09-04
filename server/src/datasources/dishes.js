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

  getDishIngredientSets({ dishID }) {
    const queryString = `
      SELECT *
      FROM ingredient_set
      WHERE parent_item_id = $1 
    `
    return client
      .query(queryString, [Number(dishID)])
      .then((results) => Promise.resolve(results.rows))
  }

  getIngredientSetIngredients({ ingredientSetID }) {
    const queryString = `
      SELECT *
      FROM ingredient
      WHERE ingredient_set_id = $1 
    `
    return client
      .query(queryString, [Number(ingredientSetID)])
      .then((results) => Promise.resolve(results.rows))
  }

  getIngredientItem({ ingredientID }) {
    const queryString = `
      SELECT *
      FROM item
      INNER JOIN ingredient ON ingredient.item_id = item.id
      WHERE ingredient.id = $1 
    `
    return client
      .query(queryString, [Number(ingredientID)])
      .then((results) => Promise.resolve(results.rows[0]))
  }

  getDishDates({ dishID }) {
    const queryString = `
      SELECT id, date
      FROM dish_date 
      WHERE dish_id = $1
      ORDER BY dish_date DESC
    `
    return client
      .query(queryString, [Number(dishID)])
      .then((results) => Promise.resolve(results.rows))
  }

  addDish({ name, ingredientSets }) {
    // Building the return object
    const newDish = {}

    const newDishQueryString = `
      INSERT INTO item(name, item_type)
      VALUES($1, 'dish')
      RETURNING *
    `
    return client.query(newDishQueryString, [name]).then((newDishResults) => {
      const newDishID = newDishResults.rows[0].id
      const newDishName = newDishResults.rows[0].name
      // Building the return object
      newDish.id = newDishID
      newDish.name = newDishName
      newDish.ingredientSets = []

      return Promise.all(
        ingredientSets.map((ingredientSet, ingredientSetIndex) => {
          // Building the return object
          newDish.ingredientSets.push({})

          const newIngredientSetQueryString = `
            INSERT INTO ingredient_set(parent_item_id)
            VALUES($1)
            RETURNING *
          `
          return client
            .query(newIngredientSetQueryString, [newDishID])
            .then((newIngredientSetResults) => {
              const newIngredientSetID = newIngredientSetResults.rows[0].id

              // Building the return object
              newDish.ingredientSets[ingredientSetIndex].id = newIngredientSetID
              newDish.ingredientSets[ingredientSetIndex].ingredients = []

              return Promise.all(
                ingredientSet.ingredients.map((ingredient, ingredientIndex) => {
                  const newIngredientQueryString = `
                    WITH new_item_id AS (
                      INSERT INTO item(name, item_type)
                      SELECT $1, 'baseItem'
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
                    )
                    INSERT INTO ingredient(ingredient_set_id, item_id)
                    SELECT $2 AS ingredient_set_id, id AS item_id
                    FROM (SELECT id FROM item_id_for_insert) AS the_id
                    RETURNING *
                  `
                  return client
                    .query(newIngredientQueryString, [
                      ingredient.name,
                      newIngredientSetID,
                    ])
                    .then((newIngredientresults) => {
                      const newIngredient = newIngredientresults.rows[0]
                      console.log(newIngredient)

                      // Building the return object
                      newDish.ingredientSets[ingredientSetIndex].ingredients[
                        ingredientIndex
                      ] = {
                        id: newIngredient.id,
                        item: {
                          id: newIngredient.item_id,
                          name: ingredient.name,
                        },
                      }
                    })
                })
              )
            })
        })
      ).then(() => Promise.resolve(newDish))
    })
  }

  addDishDate({ dishID, date }) {
    const queryString = `
      INSERT INTO dish_date(dish_id, date)
      VALUES($1, $2)
      RETURNING id, date
    `
    return client
      .query(queryString, [Number(dishID), date])
      .then((results) => Promise.resolve(results.rows[0]))
  }

  deleteDishDate({ id }) {
    const queryString = `
      DELETE FROM dish_date
      WHERE id = $1
    `
    return client
      .query(queryString, [Number(id)])
      .then((results) => Promise.resolve(results.rows[0]))
  }
}

module.exports = DishesAPI
