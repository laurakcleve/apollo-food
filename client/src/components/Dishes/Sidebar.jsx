import React from 'react'
import styled from 'styled-components'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { withApollo } from 'react-apollo'

const Sidebar = ({ sortAndFilterDishes }) => {
  const { loading: tagsLoading, error: tagsError, data: tagsData } = useQuery(
    DISH_TAGS_QUERY
  )

  const { data: sortByData, loading: sortByLoading, error: sortByError } = useQuery(
    GET_SORT_BY_QUERY
  )

  const {
    loading: filtersLoading,
    error: filtersError,
    data: filtersData,
  } = useQuery(GET_CURRENT_FILTERS)

  const [addFilter] = useMutation(ADD_FILTER_MUTATION, {
    refetchQueries: [{ query: GET_FILTERED_DISHES }],
  })

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

const GET_SORT_BY_QUERY = gql`
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

const GET_CURRENT_FILTERS = gql`
  query currentFilters {
    currentFilters @client
  }
`

const ADD_FILTER_MUTATION = gql`
  mutation addFilter($filter: String!) {
    addFilter(filter: $filter) @client
  }
`

const GET_FILTERED_DISHES = gql`
  query filteredDishes {
    filteredDishes @client {
      id
      name
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
      dates {
        id
        date
      }
      tags {
        id
        name
      }
    }
  }
`

export default withApollo(Sidebar)
