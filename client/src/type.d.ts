// Define a generic interface for the map entries
interface ProductEntry<N, V> {
    key: N;
    value: V;
  }
interface IProduct {
    _id: string
    name: string
    quantity: number
    createdAt?: string
    updatedAt?: string
}

type ProductProps = {
    product: ProductEntry
}

type ApiDataType = {
    message: string
    status: string
    products: IProduct[]
    product?: IProduct
  }
  