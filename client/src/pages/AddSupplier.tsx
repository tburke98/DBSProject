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
      <div className="flex flex-col w-full gap-4">
        <div className="flex flex-col justify-center gap-4 p-4">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-2">
              <label htmlFor="name">Supplier Name: </label>
              <input id="name" {...register('name', {required: true})} placeholder="" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email">Email: </label>
              <input id="email" {...register('email', {required: true})} placeholder="someone@example.com" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="phones">Phone Numbers(comma separated): </label>
              <input id="phones" {...register('phones', {required: true})} placeholder="x(xxx)xxx-xxxx" />
            </div>
            <button type="submit" value="Submit" className="form-button max-w-32">
              Submit
            </button>
            <button type="reset" className="form-button max-w-32">
              Reset
            </button>
          </form>
          {isSubmitted && !loading && !error && <div className="success-banner">Submitted successfully!</div>}
          {error && <div className="error-banner">Submission failed. Please try again.</div>}
        </div>
      </div>
    </>
  )
}
