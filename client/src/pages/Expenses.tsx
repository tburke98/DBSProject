import useAxios from 'axios-hooks'
import {AgGridReact} from '@ag-grid-community/react'
import {useState} from 'react'
import {useForm, SubmitHandler} from 'react-hook-form'
import cx from 'classnames'
import type {ColDef, GridOptions} from '@ag-grid-community/core'

interface ExpenseData {
  startYear: number
  endYear: number
}

interface Expense {
  year: number
  total_expense: number
}

interface ExpenseFormProps {
  state: [ExpenseData | null, Function]
}

export default function Expense() {
  const [expenseData, setExpenseData] = useState<ExpenseData | null>(null)

  return expenseData ? <ExpenseDisplay expenseData={expenseData} /> : <ExpenseForm state={[expenseData, setExpenseData]}/>
}

function ExpenseForm(props: ExpenseFormProps) {
  const [expenseData, setExpenseData] = props.state
  const {
    register,
    handleSubmit,
    formState: {errors}
  } = useForm()

  return (
    <>
      <form
        className="flex w-full justify-center items-center"
        onSubmit={handleSubmit(formdata => setExpenseData(formdata))} 
        noValidate
      >
        <div className="form-card max-w-xl flex flex-col w-full gap-4 mb-32">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-col gap-2 flex-grow">
              <label htmlFor="start">Start Year:</label>
              <input
                id="start"
                {...register('startYear', {required: true})}
                placeholder="YYYY"
                type="number"
                className={cx('form-text', {invalid: errors.startYear})}
              />
              {errors.startYear && <p className="text-sm text-red-600">Please input a start year</p>}
            </div>
            <div className="flex flex-col gap-2 flex-grow">
              <label htmlFor="end">End Year:</label>
              <input
                id="end"
                {...register('endYear', {required: true})}
                placeholder="YYYY"
                type="number"
                className={cx('form-text', {invalid: errors.endYear})}
              />
              {errors.endYear && <p className="text-sm text-red-600">Please input an end year</p>}
            </div>
          </div>
          <input className="min-w-24 w-full form-button" type="submit" value="Submit" />
        </div>
      </form>
    </>
  )
}

function ExpenseDisplay({expenseData}: {expenseData: ExpenseData}) {
  const {startYear, endYear} = expenseData
  const [{data, loading, error}] = useAxios<Expense[], any, any>({
    url: `expenses/${startYear}/${endYear}`,
    method: 'GET'
  })

  if (loading || error) {
    return <div>Loading...</div>
  }

  interface convertedExpense {
    year: number
    total_expense: string
  }

  const rowData: convertedExpense[] = Array.from(data!, (expense: Expense) =>  {
    return {
      year: expense.year,
      total_expense: expense.total_expense.toLocaleString('en-CA', {style: 'currency', currency: 'CAD'})
    }
  })

  const columnDefs: ColDef[] = [
    {
      field: 'year',
      headerName: 'Year',
      sort: 'asc',
      flex: 1
    },
    {
      field: 'total_expense',
      headerName: 'Total Expenses',
      flex: 1
    }
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