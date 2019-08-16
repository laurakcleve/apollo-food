import React, { useState } from 'react'
import { Query, Mutation } from 'react-apollo'
import { gql } from 'apollo-boost'
import PropTypes from 'prop-types'

const AddForm = ({ DISHES_QUERY }) => {
  const [name, setName] = useState('')
  const [itemSets, setItemSets] = useState([
    {
      id: Date.now(),
      items: [
        {
          id: Date.now(),
          name: '',
        },
      ],
    },
  ])

  const addItemSet = () => {
    const newItemSets = [...itemSets]
    newItemSets.push({
      id: Date.now(),
      items: [
        {
          id: Date.now(),
          name: '',
        },
      ],
    })
    setItemSets(newItemSets)
  }

  const removeItemSet = (itemSetIndex) => {
    const newItemSets = [...itemSets]
    newItemSets.splice(itemSetIndex, 1)
    setItemSets(newItemSets)
  }

  const addSubstitute = (itemSetIndex) => {
    const newItemSets = [...itemSets]
    newItemSets[itemSetIndex].items.push({ id: Date.now(), name: '' })
    setItemSets(newItemSets)
  }

  const removeSubstitute = (itemSetIndex, itemSetItemIndex) => {
    const newItemSets = [...itemSets]
    if (newItemSets[itemSetIndex].items.length <= 1)
      newItemSets.splice(itemSetIndex, 1)
    else newItemSets[itemSetIndex].items.splice(itemSetItemIndex, 1)
    setItemSets(newItemSets)
  }

  const setItemSetItem = (event, itemSetIndex, itemSetItemIndex) => {
    const newItemSets = [...itemSets]
    newItemSets[itemSetIndex].items[itemSetItemIndex].name = event.target.value
    setItemSets(newItemSets)
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
              {itemSets.map((itemSet, itemSetIndex) => (
                <div key={itemSet.id}>
                  <span>Ingredient</span>
                  {itemSet.items.map((itemSetItem, itemSetItemIndex) => (
                    <React.Fragment key={itemSetItem.id}>
                      <input
                        type="text"
                        list="itemList"
                        value={itemSets[itemSetIndex][itemSetItemIndex]}
                        onChange={(event) =>
                          setItemSetItem(event, itemSetIndex, itemSetItemIndex)
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
                          removeSubstitute(itemSetIndex, itemSetItemIndex)
                        }
                      >
                        X
                      </button>
                    </React.Fragment>
                  ))}
                  <button type="button" onClick={() => addSubstitute(itemSetIndex)}>
                    Add substitute
                  </button>
                  <button type="button" onClick={() => removeItemSet(itemSetIndex)}>
                    Remove
                  </button>
                </div>
              ))}
            </>
          )
        }}
      </Query>

      <button type="button" onClick={addItemSet}>
        Add Item Set
      </button>

      <Mutation
        mutation={ADD_DISH_MUTATION}
        variables={{ name }}
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
  mutation addDish($name: String!) {
    addDish(name: $name) {
      id
      name
    }
  }
`

AddForm.propTypes = {
  DISHES_QUERY: PropTypes.shape({}).isRequired,
}

export default AddForm
