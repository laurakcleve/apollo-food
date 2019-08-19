import React, { useState } from 'react'
import { Query, Mutation } from 'react-apollo'
import { gql } from 'apollo-boost'
import PropTypes from 'prop-types'

const FormAdd = ({ DISHES_QUERY }) => {
  const [name, setName] = useState('')
  const [ingredientSets, setIngredientSets] = useState([
    {
      id: Date.now(),
      ingredients: [
        {
          id: Date.now(),
          name: '',
        },
      ],
    },
  ])

  const addIngredientSet = () => {
    const newIngredientSets = [...ingredientSets]
    newIngredientSets.push({
      id: Date.now(),
      ingredients: [
        {
          id: Date.now(),
          name: '',
        },
      ],
    })
    setIngredientSets(newIngredientSets)
  }

  const removeIngredientSet = (ingredientSetIndex) => {
    const newIngredientSets = [...ingredientSets]
    newIngredientSets.splice(ingredientSetIndex, 1)
    setIngredientSets(newIngredientSets)
  }

  const addSubstitute = (ingredientSetIndex) => {
    const newIngredientSets = [...ingredientSets]
    newIngredientSets[ingredientSetIndex].ingredients.push({
      id: Date.now(),
      name: '',
    })
    setIngredientSets(newIngredientSets)
  }

  const removeSubstitute = (ingredientSetIndex, ingredientIndex) => {
    const newIngredientSets = [...ingredientSets]
    if (newIngredientSets[ingredientSetIndex].ingredients.length <= 1)
      newIngredientSets.splice(ingredientSetIndex, 1)
    else newIngredientSets[ingredientSetIndex].ingredients.splice(ingredientIndex, 1)
    setIngredientSets(newIngredientSets)
  }

  const setIngredient = (event, ingredientSetIndex, ingredientIndex) => {
    const newIngredientSets = [...ingredientSets]
    newIngredientSets[ingredientSetIndex].ingredients[ingredientIndex].name =
      event.target.value
    setIngredientSets(newIngredientSets)
  }

  const submitDish = (event, addDish) => {
    event.preventDefault()
    if (name) addDish()
  }

  return (
    <form>
      <h3>Add new dish</h3>

      <label htmlFor="name">
        <span>Name</span>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </label>

      <Query query={ITEMS_QUERY}>
        {({ data, loading, error }) => {
          if (loading) return <p>Loading...</p>
          if (error) return <p>Error</p>

          return (
            <>
              {ingredientSets.map((ingredientSet, ingredientSetIndex) => (
                <div key={ingredientSet.id}>
                  <span>Ingredient</span>
                  {ingredientSet.ingredients.map((ingredient, ingredientIndex) => (
                    <React.Fragment key={ingredient.id}>
                      <input
                        type="text"
                        list="itemList"
                        value={ingredientSets[ingredientSetIndex][ingredientIndex]}
                        onChange={(event) =>
                          setIngredient(event, ingredientSetIndex, ingredientIndex)
                        }
                      />
                      <datalist id="itemList">
                        {data.items.map((item) => (
                          <option key={item.id}>{item.name}</option>
                        ))}
                      </datalist>
                      <button
                        type="button"
                        onClick={() =>
                          removeSubstitute(ingredientSetIndex, ingredientIndex)
                        }
                      >
                        X
                      </button>
                    </React.Fragment>
                  ))}
                  <button
                    type="button"
                    onClick={() => addSubstitute(ingredientSetIndex)}
                  >
                    Add substitute
                  </button>
                  <button
                    type="button"
                    onClick={() => removeIngredientSet(ingredientSetIndex)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </>
          )
        }}
      </Query>

      <button type="button" onClick={addIngredientSet}>
        Add Item Set
      </button>

      <Mutation
        mutation={ADD_DISH_MUTATION}
        variables={{ name, ingredientSets }}
        refetchQueries={[{ query: DISHES_QUERY }]}
      >
        {(addDish) => (
          <button type="submit" onClick={(event) => submitDish(event, addDish)}>
            Save
          </button>
        )}
      </Mutation>
    </form>
  )
}

const ITEMS_QUERY = gql`
  query items {
    items {
      id
      name
    }
  }
`

const ADD_DISH_MUTATION = gql`
  mutation addDish($name: String!, $ingredientSets: [IngredientSetInput]!) {
    addDish(name: $name, ingredientSets: $ingredientSets) {
      id
      name
      ingredientSets {
        id
        ingredients {
          id
          item {
            id
            name
          }
        }
      }
    }
  }
`

FormAdd.propTypes = {
  DISHES_QUERY: PropTypes.shape({}).isRequired,
}

export default FormAdd
