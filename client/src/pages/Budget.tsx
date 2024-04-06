import {useState} from 'react'
import {useForm, SubmitHandler} from 'react-hook-form'
import cx from 'classnames'
import useAxios from 'axios-hooks'
import {AgGridReact} from '@ag-grid-community/react'
import type {ColDef, GridOptions} from '@ag-grid-community/core'

interface BudgetData {
  numYears: number
  rate: number
}

export default function Budget() {
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null)

  return budgetData ? <BudgetDisplay budgetData={budgetData} /> : <BudgetForm state={[budgetData, setBudgetData]} />
}

interface BudgetFormProps {
  state: [BudgetData | null, Function]
}

function BudgetForm(props: BudgetFormProps) {
  const [budgetData, setBudgetData] = props.state
  const {
    register,
    handleSubmit,
    formState: {errors}
  } = useForm()

  return (
    <form onSubmit={handleSubmit(data => setBudgetData(data))} noValidate>
      <div className="flex flex-col w-full gap-4">
        <div className="flex-col w-min">
          <label htmlFor="years">Enter amount of years</label>
          <input
            type="number"
            id="years"
            min="0"
            {...register('numYears', {required: true})}
            className={cx('rounded p-1', {invalid: errors.numYears})}
          />
          {errors.numYears && <p className="text-sm text-red-600">Please input a number of year</p>}
        </div>
        <div className="flex-col w-min">
          <label htmlFor="years">Enter inflation rate</label>
          <input
            type="number"
            id="rate"
            min="0"
            {...register('rate', {required: true})}
            className={cx('rounded p-1', {invalid: errors.rate})}
          />
          {errors.rate && <p className="text-sm text-red-600">Please input a rate</p>}
        </div>
      </div>
      {budgetData && <div className="text-sm text-green-800">Query successful</div>}
      <input type="submit" value="Send" className="bg-slate-500 rounded cursor-pointer p-1 mt-4" />
    </form>
  )
}

function BudgetDisplay({budgetData}: {budgetData: BudgetData}) {
  const {numYears, rate} = budgetData
  const [{data, loading, error}] = useAxios<{expenses: number}, any, any>({
    url: '/budget',
    method: 'GET'
  })

  if (loading || error) {
    return <div>Loading...</div>
  }

  interface ProjectionData {
    year: number
    projection: string
  }

  const rowData: ProjectionData[] = Array.from({length: numYears}, (_, i) => {
    const inflated = data!.expenses * (1 + rate / 100) ** (i + 1)
    return {
      year: new Date().getFullYear() + i,
      projection: inflated.toLocaleString('en-CA', {style: 'currency', currency: 'CAD'})
    }
  })

  const columnDefs: ColDef[] = [
    {field: 'year', headerName: 'Year'},
    {field: 'projection', headerName: 'Budget Projection'}
  ]

  const gridOptions: GridOptions = {
    autoSizeStrategy: {
      type: 'fitCellContents'
    }
  }

  return (
    <div className="ag-theme-alpine-dark w-full" style={{height: 600}}>
      <AgGridReact rowData={rowData} columnDefs={columnDefs} gridOptions={gridOptions} />
    </div>
  )
}
