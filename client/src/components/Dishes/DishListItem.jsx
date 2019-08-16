import React from 'react'
import PropTypes from 'prop-types'

import Details from './Details'

const DishListItem = ({ dish, selectedDishID, setSelectedDishID }) => {
  const toggleOpen = () => {
    if (selectedDishID === dish.id) {
      setSelectedDishID(null)
    } else {
      setSelectedDishID(dish.id)
    }
  }

  return (
    <>
      <div role="button" tabIndex="-1" onClick={toggleOpen}>
        {dish.name}
      </div>
      {selectedDishID === dish.id && <Details dish={dish} />}
    </>
  )
}

DishListItem.propTypes = {
  dish: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  selectedDishID: PropTypes.string,
  setSelectedDishID: PropTypes.func.isRequired,
}

DishListItem.defaultProps = {
  selectedDishID: null,
}

export default DishListItem
