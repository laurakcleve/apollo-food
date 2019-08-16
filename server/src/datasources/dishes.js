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
        ingredientSets.ingredientSets.map((ingredientSet, ingredientSetIndex) => {
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
}

module.exports = DishesAPI
