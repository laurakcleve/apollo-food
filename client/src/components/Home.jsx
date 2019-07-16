import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
      <h1>Home</h1>
      <ul>
        <li>
          <Link to="/items">Items</Link>
        </li>
        <li>
          <Link to="/inventory">Inventory</Link>
        </li>
        <li>
          <Link to="/dishes">Dishes</Link>
        </li>
        <li>
          <Link to="/purchases">Purchases</Link>
        </li>
      </ul>
    </div>
  )
}

export default Home
