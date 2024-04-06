import useAxios from 'axios-hooks'
import {AgGridReact} from '@ag-grid-community/react'
import {useState} from 'react'

import type {ColDef, GridOptions} from '@ag-grid-community/core'

interface Parts {
  id: number
  price: number
  description: string
}

export default function Parts() {
  const [{data, loading, error}] = useAxios<Parts[], any, any>({
    url: 'parts',
    method: 'GET'
  })

  const [columnDefs, _] = useState<ColDef[]>([
    {field: '_id', headerName: 'Part ID'},
    {field: 'price', headerName: 'Price'},
    {field: 'description', headerName: 'Description'}
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
