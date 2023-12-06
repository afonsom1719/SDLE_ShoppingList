import React, { useState } from 'react'
import { CCounter, DotContext } from '../../crdts'

type Props = { 
  saveShoppingList: (e: React.FormEvent, formData: ProductEntry<string, CCounter> | any) => void 
}

const AddShoppingList: React.FC<Props> = ({ saveShoppingList: saveProduct }) => {
  const [formData, setFormData] = useState<ShoppingListEntry<string, DotContext> | {}>({context: new DotContext(), name: ''})

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
          <input required={true} onChange={handleForm} type='text' id='name' />
        </div>
      </div>
      <button disabled={formData === undefined ? true: false} >Add Shopping list</button>
    </form>
  )
}

export default AddShoppingList
