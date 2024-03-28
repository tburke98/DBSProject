import React from 'react'
import ReactDOM from 'react-dom/client'

import {Outlet, RouterProvider, createBrowserRouter, Link} from 'react-router-dom'
import {configure} from 'axios-hooks'
import Axios from 'axios'
import {ModuleRegistry} from '@ag-grid-community/core'
import {ClientSideRowModelModule} from '@ag-grid-community/client-side-row-model'

import '@ag-grid-community/styles/ag-grid.css'
import '@ag-grid-community/styles/ag-theme-alpine.css'
import './index.css'

import Expenses from './pages/Expenses'

const axios = Axios.create({
  baseURL: import.meta.env.VITE_API_URL
})
configure({axios})

ModuleRegistry.registerModules([ClientSideRowModelModule])

const routes = [
  {index: true, element: <Home />},
  {path: '/expenses', element: <Expenses />},
  {path: '/test', element: <Test />}
]

const routerRoot = [{path: '/', element: <Layout />, children: routes}]

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={createBrowserRouter(routerRoot)} />
  </React.StrictMode>
)

function Layout() {
  return (
    <>
      <div className="flex flex-col w-full h-screen">
        <div className="bg-blue-800 text-white p-4 w-full flex gap-4">
          <Link to="/">Home</Link>
          <Link to="/test">Test</Link>
          <Link to="/expenses">Expenses</Link>
        </div>
        <Outlet />
        <div className="bg-blue-800 text-white p-2 w-full text-center">&copy; CSCI 3461 Database Systems Group 5</div>
      </div>
    </>
  )
}

function Home() {
  return <div className="flex flex-1">Hello, Home!</div>
}

function Test() {
  return <div className="flex flex-1">Hello, Test!</div>
}
