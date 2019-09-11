import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { DISH_TAGS_QUERY, ITEMS_QUERY } from '../../queries'

const FormEdit = ({ setIsEditing, dish }) => {
  const [name, setName] = useState(dish.name)
  const [tags, setTags] = useState([])
  const [ingredientSets, setIngredientSets] = useState([]) // checking this for reference, need to copy?

  const { data } = useQuery(ITEMS_QUERY)
  const { data: dataDishTags } = useQuery(DISH_TAGS_QUERY)
  const [updateDish] = useMutation(UPDATE_DISH_MUTATION, {
    onCompleted: () => setIsEditing(false),
  })

  useEffect(() => {
    setIngredientSets(stripIngredientSets(dish.ingredientSets))
    setTags(stripTags(dish.tags))
  }, [dish.ingredientSets, dish.tags])

  const stripIngredientSets = (originalIngredientSets) => {
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

  const stripTags = (originalTags) => {
    const strippedTags = originalTags.map((tag) => {
      const { __typename, ...newTag } = tag
      return newTag
    })
    return strippedTags
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

  const addTag = () => {
    const newTags = [...tags]
    newTags.push({
      id: Date.now(),
      name: '',
    })
    setTags(newTags)
  }

  const updateTag = (index, value) => {
    const newTags = [...tags]
    newTags[index].name = value
    setTags(newTags)
  }

  const removeTag = (index) => {
    const newTags = [...tags]
    newTags.splice(index, 1)
    setTags(newTags)
  }

  return (
    <Form
      onSubmit={(event) => {
        event.preventDefault()
        updateDish({ variables: { id: dish.id, name, tags, ingredientSets } })
      }}
    >
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

      <Row className="tags">
        <div className="label">Tags</div>
        <div>
          {tags &&
            tags.map((tag, index) => (
              <React.Fragment key={tag.id}>
                <input
                  key={tag.id}
                  list="tagList"
                  value={tag.name}
                  onChange={(event) => updateTag(index, event.target.value)}
                />
                <datalist id="tagList">
                  {dataDishTags.dishTags &&
                    dataDishTags.dishTags.map((dishTag) => (
                      <option key={dishTag.id}>{dishTag.name}</option>
                    ))}
                </datalist>
                <button type="button" onClick={() => removeTag(index)}>
                  X
                </button>
              </React.Fragment>
            ))}
        </div>
        <button type="button" onClick={addTag}>
          Add tag
        </button>
      </Row>

      {ingredientSets.map((ingredientSet, ingredientSetIndex) => (
        <Row className="ingredient-set" key={ingredientSet.id}>
          <div className="label">Ingredient</div>
          <div>
            {ingredientSet.ingredients.map((ingredient, ingredientIndex) => (
              <div key={ingredient.id}>
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
              </div>
            ))}
          </div>
          <button
            className="add-substitute"
            type="button"
            onClick={() => addSubstitute(ingredientSetIndex)}
          >
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
            className="remove"
            onClick={() => removeIngredientSet(ingredientSetIndex)}
          >
            Remove
          </button>
        </Row>
      ))}
      <button type="button" onClick={addIngredientSet}>
        Add Ingredient Set
      </button>
      <button type="submit">Save</button>
    </Form>
  )
}

const UPDATE_DISH_MUTATION = gql`
  mutation updateDish(
    $id: ID!
    $name: String!
    $tags: [DishTagInput]!
    $ingredientSets: [IngredientSetInput]!
  ) {
    updateDish(id: $id, name: $name, tags: $tags, ingredientSets: $ingredientSets) {
      id
      name
      tags {
        id
        name
      }
      ingredientSets {
        id
        optional
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
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 10px;

  label {
    display: flex;
  }
  .label {
    width: 110px;
  }
  .ingredient-set {
    display: flex;
  }
  button.add-substitute,
  button.remove {
    height: 21px;
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
    tags: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
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
