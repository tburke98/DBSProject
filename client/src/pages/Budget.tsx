import useAxios from 'axios-hooks'
import {useState} from 'react'
import {useForm} from 'react-hook-form'
import cx from 'classnames'

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

  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: {errors}
  } = useForm()

  const onSubmit = async data => {
    const {years, rate} = data

    reset()
    setSubmitted(true)
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex flex-col w-full gap-4">
          <div className="flex-col w-min">
            <label htmlFor="years">Enter amount of years</label>
            <input
              type="number"
              id="years"
              min="0"
              {...register('year', {required: true})}
              className={cx('rounded p-1', {invalid: errors.year})}
            />
            {errors.year && <p className="text-sm text-red-600">Please a year</p>}
          </div>
          <div className="flex-col w-min">
            <label htmlFor="years">Enter interest rate</label>
            <input
              type="number"
              id="rate"
              min="0"
              {...register('rate', {required: true})}
              className={cx('rounded p-1', {invalid: errors.rate})}
            />
            {errors.rate && <p className="text-sm text-red-600">Please a rate</p>}
          </div>
        </div>
        {submitted && (
          <div className="text-sm text-green-800">
            Thank you for your message. We will get back to you as soon as possible.
          </div>
        )}
        <input type="submit" value="Send" className="bg-slate-500 rounded cursor-pointer" />
      </form>
    </>
  )
}
