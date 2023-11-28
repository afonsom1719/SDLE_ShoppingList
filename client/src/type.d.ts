// Define a generic interface for the map entries
interface ProductEntry<N, V> {
    key: N;
    value: V;
    shoppingListId?: string;
    collection?: string = 'products';
  }

interface ShoppingListEntry<N, V> {
    name: N;
    context: V;
    collection?: string = 'shopping-lists';
}
interface IProduct {
    _id: string
    _rev?: string
    name: string
    quantity: number
    createdAt?: string
    updatedAt?: string
    shoppingListId?: string;
    collection: string = 'products'
}

interface IShoppingList {
    _id: string
    _rev?: string
    name: string
    context: DotContext
    createdAt?: string
    updatedAt?: string
    collection: string = 'shopping-lists'
}

type ProductProps = {
    product: IProduct
}

type ApiDataType = {
    message: string
    status: string
    products: IProduct[]
    product?: IProduct
  }
  