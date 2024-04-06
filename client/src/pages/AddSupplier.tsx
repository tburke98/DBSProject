import {useState} from 'react'
import {useForm} from 'react-hook-form'
import useAxios from 'axios-hooks'

export default function AddSuppliers() {
  interface Supplier {
    _id: number
    name: string
    email: string
    phones: string
  }

  const {
    register,
    handleSubmit,
    formState: {errors}
  } = useForm<Supplier>()

  const [formData, setFormData] = useState<Supplier>({
    _id: 0,
    name: '',
    email: '',
    phones: ''
  })

  const [{data, loading, error}, execute] = useAxios<Supplier[], any, any>(
    {
      url: `add_supplier`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    },
    {manual: true}
  )

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

  const onSubmit = async (formData: Supplier) => {
    try {
      console.log(formData)
      await execute({
        data: formData
      })
      setIsSubmitted(true)
    } catch (error) {
      setIsSubmitted(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>
  }

  return (
    <>
      <div className="flex flex-col w-full gap-4 justify-center items-center">
        <div className="flex flex-col max-w-2xl w-full justify-center gap-4 p-4 mb-32">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <div className="flex flex-col gap-2 flex-grow">
                <label htmlFor="name">Supplier Name: </label>
                <input id="name" {...register('name', {required: true})} placeholder="" className='form-text w-full'/>
              </div>
              <div className="flex flex-col gap-2 flex-grow">
                <label htmlFor="email">Email: </label>
                <input id="email" {...register('email', {required: true})} placeholder="someone@example.com" className='form-text w-full'/>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="phones">Phone Numbers(comma separated): </label>
              <input id="phones" {...register('phones', {required: true})} placeholder="x(xxx)xxx-xxxx" className='form-text'/>
            </div>
            <div className="flex flex-col md:flex-row w-full gap-4">
              <button type="submit" value="Submit" className="form-button w-full min-w-24">
                Submit
              </button>
              <button type="reset" className="form-button w-full min-w-24">
                Reset
              </button>
            </div>
          </form>
          {isSubmitted && !loading && !error && <div className="success-banner">Submitted successfully!</div>} 
          {error && <div className="error-banner">Submission failed. Please try again.</div>}
        </div>
      </div>
    </>
  )
}
