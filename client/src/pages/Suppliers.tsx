import useAxios from 'axios-hooks'
import {AgGridReact} from '@ag-grid-community/react'
import {useState} from 'react'

import type {ColDef, GridOptions} from '@ag-grid-community/core'

interface Supplier {
  id: number
  name: string
  email: string
  phone: string
}

export default function Suppliers() {
  const [{data, loading, error}] = useAxios<Supplier[], any, any>({
    url: 'suppliers',
    method: 'GET'
  })

  const [columnDefs, _] = useState<ColDef[]>([
    {field: '_id', headerName: 'ID'},
    {field: 'email', headerName: 'Supplier Email'},
    {field: 'name', headerName: 'Supplier Name'},
    {field: 'phones', headerName: 'Supplier Phone Numbers'}
  ])

  if (loading || error) {
    return <div>Loading...</div>
  }

  const gridOptions: GridOptions = {
    autoSizeStrategy: {
      type: 'fitCellContents'
    }
  }

  return (
    <div className="ag-theme-alpine-dark w-full" style={{height: 600}}>
      <AgGridReact rowData={data} columnDefs={columnDefs} gridOptions={gridOptions} />
    </div>
  )
}
