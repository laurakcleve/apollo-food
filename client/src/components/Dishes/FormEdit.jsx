import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import PropTypes from 'prop-types'

const FormEdit = ({ setIsEditing, dish }) => {
  const [name, setName] = useState(dish.name)
  const [ingredientSets, setIngredientSets] = useState([]) // checking this for reference, need to copy?

  const { data } = useQuery(ITEMS_QUERY)
  const [updateDish] = useMutation(UPDATE_DISH_MUTATION, {
    onCompleted: () => setIsEditing(false),
  })

  useEffect(() => {
    setIngredientSets(strip(dish.ingredientSets))
  }, [dish.ingredientSets])

  const strip = (originalIngredientSets) => {
    const strippedIngredientSets = originalIngredientSets.map((ingredientSet) => {
      const { __typename, ...newIngredientSet } = ingredientSet
      newIngredientSet.ingredients = newIngredientSet.ingredients.map(
        (ingredient) => {
          const { __typename: ingredientTypename, ...newIngredient } = ingredient
          const { __typename: itemTypename, ...newItem } = ingredient.item
          newIngredient.item = newItem
          return newIngredient
        }
      )
      return newIngredientSet
    })
    return strippedIngredientSets
  }

  const addIngredientSet = () => {
    const newIngredientSets = [...ingredientSets]
    newIngredientSets.push({
      id: Date.now(),
      ingredients: [
        {
          id: Date.now(),
          item: {
            id: Date.now(),
            name: '',
          },
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
      item: {
        id: Date.now(),
        name: '',
      },
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
    newIngredientSets[ingredientSetIndex].ingredients[ingredientIndex].item.name =
      event.target.value
    setIngredientSets(newIngredientSets)
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        updateDish({ variables: { id: dish.id, name, ingredientSets } })
      }}
    >
      <label htmlFor="name">
        <span>Name</span>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </label>

      {ingredientSets.map((ingredientSet, ingredientSetIndex) => (
        <div key={ingredientSet.id}>
          <span>Ingredient</span>
          {ingredientSet.ingredients.map((ingredient, ingredientIndex) => (
            <React.Fragment key={ingredient.id}>
              <input
                type="text"
                list="itemList"
                value={
                  ingredientSets[ingredientSetIndex].ingredients[ingredientIndex]
                    .item.name
                }
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
                onClick={() => removeSubstitute(ingredientSetIndex, ingredientIndex)}
              >
                X
              </button>
            </React.Fragment>
          ))}
          <button type="button" onClick={() => addSubstitute(ingredientSetIndex)}>
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
      <button type="button" onClick={addIngredientSet}>
        Add Ingredient Set
      </button>
      <button type="submit">Save</button>
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

const UPDATE_DISH_MUTATION = gql`
  mutation updateDish(
    $id: ID!
    $name: String!
    $ingredientSets: [IngredientSetInput]!
  ) {
    updateDish(id: $id, name: $name, ingredientSets: $ingredientSets) {
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

FormEdit.propTypes = {
  setIsEditing: PropTypes.func.isRequired,
  dish: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    dates: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      })
    ),
    ingredientSets: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        ingredients: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            item: PropTypes.shape({
              id: PropTypes.string.isRequired,
              name: PropTypes.string.isRequired,
            }).isRequired,
          })
        ).isRequired,
      })
    ).isRequired,
  }).isRequired,
}

export default FormEdit
