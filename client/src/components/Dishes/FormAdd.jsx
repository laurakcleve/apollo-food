import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const FormAdd = ({ DISHES_QUERY }) => {
  const initialIngredientSets = [
    {
      id: Date.now(),
      optional: false,
      ingredients: [
        {
          id: Date.now(),
          item: {
            id: Date.now(),
            name: '',
          },
        },
      ],
    },
  ]

  const [name, setName] = useState('')
  const [ingredientSets, setIngredientSets] = useState(initialIngredientSets)

  const { loading, error, data } = useQuery(ITEMS_QUERY)
  const [addDish] = useMutation(ADD_DISH_MUTATION, {
    refetchQueries: [
      {
        query: DISHES_QUERY,
      },
    ],
    onCompleted: () => {
      resetInputs()
    },
  })

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error</p>

  const resetInputs = () => {
    setName('')
    setIngredientSets(initialIngredientSets)
  }

  const addIngredientSet = () => {
    const newIngredientSets = [...ingredientSets]
    newIngredientSets.push({
      id: Date.now(),
      optional: false,
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

  const handleCheckInput = (ingredientSetIndex) => {
    const newIngredientSets = [...ingredientSets]
    newIngredientSets[ingredientSetIndex].optional = !newIngredientSets[
      ingredientSetIndex
    ].optional
    setIngredientSets(newIngredientSets)
  }

  return (
    <Form
      onSubmit={(event) => {
        event.preventDefault()
        if (name)
          addDish({
            variables: {
              name,
              ingredientSets,
            },
          })
      }}
    >
      <h3>Add new dish</h3>

      <Row>
        <label htmlFor="name">
          <div className="label">Name</div>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
      </Row>

      {ingredientSets.map((ingredientSet, ingredientSetIndex) => (
        <Row key={ingredientSet.id}>
          <div>
            <div className="label">Ingredient</div>
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
                  onClick={() =>
                    removeSubstitute(ingredientSetIndex, ingredientIndex)
                  }
                >
                  X
                </button>
              </React.Fragment>
            ))}
            <button type="button" onClick={() => addSubstitute(ingredientSetIndex)}>
              Add substitute
            </button>

            <label htmlFor={`optional${ingredientSetIndex}`}>
              <input
                type="checkbox"
                id={`optional${ingredientSetIndex}`}
                checked={ingredientSet.optional}
                onChange={() => handleCheckInput(ingredientSetIndex)}
              />
              <span>Optional</span>
            </label>

            <button
              type="button"
              onClick={() => removeIngredientSet(ingredientSetIndex)}
            >
              Remove
            </button>
          </div>
        </Row>
      ))}
      <button type="button" onClick={addIngredientSet}>
        Add Ingredient Set
      </button>
      <button type="submit">Save</button>
    </Form>
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

const Form = styled.form`
  label {
    display: block;
  }
`

const Row = styled.div`
  display: flex;
  margin: 10px;

  label {
    display: flex;
  }
  .label {
    width: 110px;
  }
`

FormAdd.propTypes = {
  DISHES_QUERY: PropTypes.shape({}).isRequired,
}

export default FormAdd
