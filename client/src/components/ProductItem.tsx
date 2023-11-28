import React from 'react'

type Props = ProductProps & {
    deleteProduct: (_id: string) => void
}

const Product: React.FC<Props> = ({ product, deleteProduct }) => {
  const checkProduct: string = ''
  console.log('Product: ', product)
  return (
    <div className='Card'>
      <div className='Card--text'>
        <h1 className={checkProduct}>{product.key}</h1>
        <span className={checkProduct}>{product.value.read()}</span>
      </div>
      <div className='Card--button'>
        <button
          onClick={() => deleteProduct(product.key)}
          className='Card--button__delete'
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default Product
