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
      type: 'fitGridWidth'
    },
    defaultColDef: {
      filter: true,
      sortable: true,
      resizable: true
    }
  }

  return (
    <div className="ag-theme-alpine-dark w-full" style={{height: 600}}>
      <AgGridReact
        rowData={data}
        columnDefs={columnDefs}
        gridOptions={gridOptions}
        suppressRowClickSelection={true}
        groupSelectsChildren={true}
        rowSelection={'multiple'}
        rowGroupPanelShow={'always'}
        pivotPanelShow={'always'}
        pagination={true}
      />
    </div>
  )
}
