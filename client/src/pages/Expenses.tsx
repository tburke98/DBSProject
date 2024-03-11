import useAxios from 'axios-hooks'
import {AgGridReact} from '@ag-grid-community/react'
import {useState} from 'react'

export default function Expenses() {
  const [{data, loading, error}] = useAxios('expenses')

  const [colDefs, setColDefs] = useState([
    {field: 'year'},
    {field: 'month'},
    {field: 'electricity'},
    {field: 'water'},
    {field: 'heat'}
  ])

  if (loading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>
  }

  return (
    <div className="ag-theme-alpine" style={{height: 500}}>
      <AgGridReact rowData={data} columnDefs={colDefs} />
    </div>
  )
}
