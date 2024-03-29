import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import moment from 'moment'

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
      <TitleBar>
        <div
          className="column column--name"
          role="button"
          tabIndex="-1"
          onClick={toggleOpen}
        >
          {dish.name}
        </div>

        <div className="column column--last-date">
          {dish.dates.length > 0 &&
            moment(Number(dish.dates[0].date)).format('M/D/YY')}
        </div>
      </TitleBar>
      {selectedDishID === dish.id && <Details dish={dish} />}
    </>
  )
}

const TitleBar = styled.div`
  display: flex;

  .column-name {
    flex: 1;
  }
`

DishListItem.propTypes = {
  dish: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    dates: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
  selectedDishID: PropTypes.string,
  setSelectedDishID: PropTypes.func.isRequired,
}

DishListItem.defaultProps = {
  selectedDishID: null,
}

export default DishListItem
