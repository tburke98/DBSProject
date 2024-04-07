import {useState} from 'react'
import {useForm} from 'react-hook-form'
import useAxios from 'axios-hooks'
import cx from 'classnames'
import Suppliers from './Suppliers'

interface SupplierData {
  name: string
  email: string
  phones: string
}

interface SupplierFormProps {
  state: [SupplierData | null, Function]
}

export default function AddSupplier() {
  const [supplierData, setSupplierData] = useState<SupplierData | null>(null)

  return supplierData ? <HandleSubmit supplierData={supplierData} />  : <AddSupplierForm state={[supplierData, setSupplierData]} />
}

function AddSupplierForm(props: SupplierFormProps) {
  const [supplierData, setSupplierData] = props.state
  const {
    register,
    handleSubmit,
    formState: {errors}
  } = useForm()

  return (
    <>
      <div className="flex flex-col w-full gap-4 justify-center items-center">
        <div className="flex flex-col max-w-2xl form-card w-full mb-32">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit(data => setSupplierData(data))} noValidate>
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <div className="flex flex-col gap-2 flex-grow">
                <label htmlFor="name">Supplier Name: </label>
                <input 
                  id="name" 
                  {...register('name', {required: true})} 
                  type="text"
                  className={cx('form-text w-full', {invalid: errors.name})}
                />
                {errors.name && <p className="text-sm text-red-600">Please input a name</p>}
              </div>
              <div className="flex flex-col gap-2 flex-grow">
                <label htmlFor="email">Email: </label>
                <input 
                  id="email" 
                  {...register('email', {required: true})} 
                  placeholder="someone@example.com" 
                  className={cx('form-text w-full', {invalid: errors.email})}
                />
                {errors.email && <p className="text-sm text-red-600">Please input an email</p>}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="phones">Phone Numbers: </label>
              <input 
                id="phones" 
                {...register('phones', {required: true})} 
                placeholder="x(xxx)xxx-xxxx, x(xxx)xxx-xxxx, ..." 
                className={cx('form-text w-full', {invalid: errors.phones})}
              />
              {errors.phones && <p className="text-sm text-red-600">Please input a phone number</p>}
            </div>
            <button type="submit" value="Submit" className="form-button w-full min-w-24">
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

function HandleSubmit({supplierData}: {supplierData: SupplierData}) {
  const {name, email, phones} = supplierData
  const [{data, loading, error}] = useAxios<string, any, any>({
    url: `add_supplier/${name}/${email}/${phones}`,
    method: 'GET',
  })

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Supplier could not be added.</div>
  }

  return <Suppliers />
}