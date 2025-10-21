import React from 'react'
import { useRoutes } from 'react-router-dom'
import Navigation from './components/Navigation'
import ViewAllBowls from './pages/ViewAllBowls'
import EditBowl from './pages/EditBowl'
import CreateBowl from './pages/CreateBowl'
import BowlDetails from './pages/BowlDetails'
import './App.css'

const App = () => {
  let element = useRoutes([
    {
      path: '/menu',
      element: <CreateBowl title='RAMEN REMIX | Customize' />
    },
    {
      path:'/bowls',
      element: <ViewAllBowls title='RAMEN REMIX | Custom Bowls' />
    },
    {
      path: '/bowls/:id',
      element: <BowlDetails title='RAMEN REMIX | View' />
    },
    {
      path: '/bowls/edit/:id',
      element: <EditBowl title='RAMEN REMIX | Edit' />
    }
  ])

  return (
    <div className='app'>

      <Navigation />

      { element }

    </div>
  )
}

export default App