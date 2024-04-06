import useAxios from 'axios-hooks'
import {AgGridReact} from '@ag-grid-community/react'
import {useState} from 'react'
import {useForm, SubmitHandler} from 'react-hook-form'
import cx from 'classnames'

import type {ColDef, GridOptions} from '@ag-grid-community/core'

interface Expense {
  year: number
  total_expense: number
}

export default function Expenses() {

  const {
    register,
    handleSubmit,
    reset,
    formState: {errors}
  } = useForm()
  const [formData, setFormData] = useState('{"startYear":"0", "endYear":"0"}');

  const current = JSON.parse(formData)

  const [{data, loading, error}] = useAxios<Expense[], any, any>({
    url: `expenses/${current.startYear}/${current.endYear}`,
    method: 'GET'
  })

  const [columnDefs, _] = useState<ColDef[]>([
    {
      field: 'year',
      headerName: 'Year',
      sort: "asc",
    },
    {
      field: 'total_expense',
      headerName: 'Total Expenses',
    },
  ])

  if (loading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>
  }

  const gridOptions: GridOptions = {
    autoSizeStrategy: {
      type: 'fitGridWidth'
    }
  }

  return (
    <>
      <div className="flex flex-col w-full gap-4">
        <form className="flex flex-col md:flex-row justi gap-4 p-4 items-center" onSubmit={handleSubmit((formdata) => setFormData(JSON.stringify(formdata)))}>
          <div className="flex gap-2">
            <label htmlFor="start">Start Year:</label>
            <input id="start" {...register("startYear", { required: true })} placeholder='YYYY' className='form-text' />
          </div>
          <div className="flex gap-2">
            <label htmlFor="end">End Year:</label>
            <input id="end" {...register("endYear", { required: true })} placeholder='YYYY' className='form-text' />
          </div>
          <input className="min-w-24 form-button" type="submit" value="Submit" />
        </form>
        <div className="ag-theme-alpine-dark w-full" style={{height: 500}}>
          <AgGridReact rowData={data} columnDefs={columnDefs} gridOptions={gridOptions} />
        </div>
      </div>
    </>
  )
}