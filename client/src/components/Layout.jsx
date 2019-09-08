import React from 'react'
import styled from 'styled-components'

const Layout = ({ children }) => {
  return <StyledLayout>{children}</StyledLayout>
}

const StyledLayout = styled.div`
  max-width: 900px;
  padding: 10px;
`

export default Layout
