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
    <form className='flex w-full justify-center items-center' onSubmit={handleSubmit(data => setBudgetData(data))} noValidate>
      <div className="form-card max-w-2xl flex flex-col w-full gap-4 mb-32">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col gap-2 flex-grow">
            <label htmlFor="years">Enter amount of years</label>
            <input
              type="number"
              id="years"
              min="0"
              {...register('numYears', {required: true})}
              className={cx('form-text', {invalid: errors.numYears})}
            />
            {errors.numYears && <p className="text-sm text-red-600">Please input a number of year</p>}
          </div>
          <div className="flex flex-col gap-2 flex-grow">
            <label htmlFor="years">Enter inflation rate</label>
            <input
              type="number"
              id="rate"
              min="0"
              {...register('rate', {required: true})}
              className={cx('form-text', {invalid: errors.rate})}
            />
            {errors.rate && <p className="text-sm text-red-600">Please input a rate</p>}
          </div>
        </div>
        <input type="submit" value="Send" className="form-button" />
      </div>
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
    {field: 'year', headerName: 'Year', flex: 1},
    {field: 'projection', headerName: 'Budget Projection', flex: 1}
  ]

  const gridOptions: GridOptions = {
    autoSizeStrategy: {
      type: 'fitGridWidth'
    }
  }

  return (
    <div className="flex w-full justify-center items-center">
      <div className="ag-theme-alpine-dark w-full" style={{height: 600}}>
        <AgGridReact rowData={rowData} columnDefs={columnDefs} gridOptions={gridOptions} />
      </div>
    </div>
  )
}
