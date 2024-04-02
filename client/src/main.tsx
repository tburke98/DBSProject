import React from 'react'
import ReactDOM from 'react-dom/client'

import {Outlet, RouterProvider, createBrowserRouter, Link} from 'react-router-dom'
import {configure} from 'axios-hooks'
import Axios from 'axios'
import {ModuleRegistry} from '@ag-grid-community/core'
import {ClientSideRowModelModule} from '@ag-grid-community/client-side-row-model'
import {Package, Engine, Truck, UserPlus, HandCoins, ChartLineUp} from '@phosphor-icons/react'

import '@ag-grid-community/styles/ag-grid.css'
import '@ag-grid-community/styles/ag-theme-alpine.css'
import './index.css'

import Expenses from './pages/Expenses'
import Suppliers from './pages/Suppliers'
import Orders from './pages/Orders'

const axios = Axios.create({
  baseURL: import.meta.env.VITE_API_URL
})
configure({axios})

ModuleRegistry.registerModules([ClientSideRowModelModule])

const routes = [
  {index: true, element: <Home />},
  {path: '/expenses', element: <Expenses />},
  {path: '/Suppliers', element: <Suppliers />},
  {path: '/Orders', element: <Orders />}
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
      <div className="flex flex-col w-full min-h-screen">
        <div className="bg-neutral-900 text-blue-100 p-4 w-full flex gap-4">
          <Link to="/">Home</Link>
          <Link to="/Suppliers">Suppliers</Link>
          <Link to="/Orders">Orders</Link>
          <Link to="/expenses">Expenses</Link>
        </div>
        <div className="flex bg-neutral-800 flex-grow justify-center">
          <div className="flex w-full p-4 max-w-7xl">
            <Outlet />
          </div>
        </div>
        <div className="bg-neutral-900 text-blue-100 p-2 w-full text-center">
          &copy; CSCI 3461 Database Systems Group 5
        </div>
      </div>
    </>
  )
}

function Home() {
  return (
    <>
      <div className="w-full gap-4 flex flex-col">
        <div className="mx-auto mt-24 gap-4 p-4 text-center text-blue-100 rounded-lg flex flex-col">
          <span className="font-bold text-4xl">MUC Database</span>
          <span className="font-semibold">Ethan Cooke, Justin Kaiser, Travis Burke</span>
        </div>
        <div className="w-full flex h-full items-center">
          <div className="flex w-full flex-col gap-4">
            <div className="flex flex-col md:flex-row w-full justify-between gap-4">
              <div className="table-buttons">
                <div className="table-icons">
                  <Truck size={96} />
                </div>
                <span>Orders</span>
              </div>
              <div className="table-buttons">
                <div className="table-icons">
                  <Package size={96} />
                </div>
                <span>Suppliers</span>
              </div>
              <div className="table-buttons">
                <div className="table-icons">
                  <Engine size={96} />
                </div>
                <span>Parts</span>
              </div>
            </div>
            <div className="flex flex-col md:flex-row w-full justify-between gap-4">
              <div className="table-buttons">
                <div className="table-icons">
                  <ChartLineUp size={96} />
                </div>
                <span>Budget Projection</span>
              </div>
              <div className="table-buttons">
                <div className="table-icons">
                  <UserPlus size={96} />
                </div>
                <span>New Supplier</span>
              </div>
              <div className="table-buttons">
                <div className="table-icons">
                  <HandCoins size={96} />
                </div>
                <span>Annual Expenses</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
