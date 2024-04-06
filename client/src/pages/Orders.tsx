import useAxios from 'axios-hooks'
import {AgGridReact} from '@ag-grid-community/react'
import {useState} from 'react'

import type {ColDef, GridOptions} from '@ag-grid-community/core'

interface Orders {
  id: number
  sid: number
  date: string
  pid: number
  quantity: number
}

export default function Orders() {
  const [{data, loading, error}] = useAxios<Orders[], any, any>({
    url: 'orders',
    method: 'GET'
  })

  const [columnDefs, _] = useState<ColDef[]>([
    {field: '_id', headerName: 'Order ID'},
    {field: 'supplier_id', headerName: 'Supplier ID'},
    {field: 'order_date', headerName: 'Order Date'},
    {field: 'parts_and_quantities', headerName: 'Part ID : Quantity'}
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
