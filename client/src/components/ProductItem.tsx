import React from 'react'

type Props = ProductProps & {
    deleteProduct: (_id: string) => void
}

const Product: React.FC<Props> = ({ product, deleteProduct }) => {
  const checkProduct: string = ''
  return (
    <div className='Card'>
      <div className='Card--text'>
        <h1 className={checkProduct}>{product.name}</h1>
        <span className={checkProduct}>{product.quantity}</span>
      </div>
      <div className='Card--button'>
        <button
          onClick={() => deleteProduct(product._id)}
          className='Card--button__delete'
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default Product
