import {useState} from 'react'
import {useForm} from 'react-hook-form'
import axios from 'axios'

export default function AddSuppliers() {
  interface Supplier {
    _id: number
    name: string
    email: string
    phones: string
  }

  const {
    register,
    handleSubmit
  } = useForm<Supplier>()

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)

  const onSubmit = async (formData: Supplier) => {
    try {
      await axios.post("add_supplier", formData)
      setIsSubmitted(true)
      setError(false)
    } catch {
      setError(true)
    } 
  }

  return (
    <>
      <div className="flex flex-col w-full gap-4 justify-center items-center">
        <div className="flex flex-col max-w-2xl form-card w-full mb-32">
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
              <label htmlFor="phones">Phone Numbers: </label>
              <input id="phones" {...register('phones', {required: true})} placeholder="x(xxx)xxx-xxxx, x(xxx)xxx-xxxx, ..." className='form-text'/>
            </div>
            <button type="submit" value="Submit" className="form-button w-full min-w-24">
              Submit
            </button>
          </form>
          {isSubmitted && <div className="success-banner">Submitted successfully!</div>} 
          {error && <div className="error-banner">Submission failed. Please try again.</div>}
        </div>
      </div>
    </>
  )
}
