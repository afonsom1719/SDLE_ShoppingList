import React, { useState } from 'react'
import { CCounter } from '../crdts'

type Props = { 
  saveProduct: (e: React.FormEvent, formData: ProductEntry<string, CCounter> | any) => void 
}

const AddProduct: React.FC<Props> = ({ saveProduct }) => {
  const [formData, setFormData] = useState<ProductEntry<string, CCounter> | {}>()

  const handleForm = (e: React.FormEvent<HTMLInputElement>): void => {
    setFormData({
      ...formData,
      [e.currentTarget.id]: e.currentTarget.value,
    })
  }

  return (
    <form className='Form' onSubmit={(e) => saveProduct(e, formData)}>
      <div>
        <div>
          <label htmlFor='name'>Name</label>
          <input onChange={handleForm} type='text' id='name' />
        </div>
        <div>
          <label htmlFor='quantity'>Quantity</label>
          <input onChange={handleForm} type='number' id='quantity' />
        </div>
      </div>
      <button disabled={formData === undefined ? true: false} >Add Product</button>
    </form>
  )
}

export default AddProduct
