import React from 'react'
import styled from 'styled-components'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'

import { SORT_AND_FILTER_DISHES_MUTATION } from '../../queries'

const Sidebar = () => {
  const { loading: tagsLoading, error: tagsError, data: tagsData } = useQuery(
    DISH_TAGS_QUERY
  )
  const { data: sortByData, loading: sortByLoading, error: sortByError } = useQuery(
    SORT_BY_QUERY
  )
  const {
    loading: filtersLoading,
    error: filtersError,
    data: filtersData,
  } = useQuery(CURRENT_FILTERS_QUERY)

  const [addFilter] = useMutation(ADD_FILTER_MUTATION)
  const [sortAndFilterDishes] = useMutation(SORT_AND_FILTER_DISHES_MUTATION)

  return (
    <StyledSidebar>
      <Tags>
        <h3>Tags</h3>
        {!tagsLoading &&
          !tagsError &&
          !filtersLoading &&
          !filtersError &&
          !sortByLoading &&
          !sortByError &&
          [{ id: Date.now(), name: 'all' }].concat(tagsData.dishTags).map((tag) => (
            <React.Fragment key={tag.id}>
              <label htmlFor={`tag${tag.id}`}>
                <input
                  type="checkbox"
                  id={`tag${tag.id}`}
                  checked={filtersData.currentFilters.includes(tag.name)}
                  onChange={() => {
                    addFilter({ variables: { filter: tag.name } })
                    sortAndFilterDishes({
                      variables: { sortBy: sortByData.currentDishSortBy },
                    })
                  }}
                />
                {tag.name}
              </label>

              <br />
            </React.Fragment>
          ))}
      </Tags>
    </StyledSidebar>
  )
}

const StyledSidebar = styled.div`
  flex: 0 0 200px;
`

const Tags = styled.div``

const SORT_BY_QUERY = gql`
  query sortByQuery {
    currentDishSortBy @client
  }
`

const DISH_TAGS_QUERY = gql`
  query dishTags {
    dishTags {
      id
      name
    }
  }
`

const CURRENT_FILTERS_QUERY = gql`
  query currentFilters {
    currentFilters @client
  }
`

const ADD_FILTER_MUTATION = gql`
  mutation addFilter($filter: String!) {
    addFilter(filter: $filter) @client
  }
`

export default Sidebar
