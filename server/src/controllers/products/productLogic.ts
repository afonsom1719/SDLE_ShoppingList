import { Ormap } from "../../types/crdts";
import { IProduct } from "../../types/product";
import Product  from "../../models/product";


const getAllProducts = (current: IProduct[], dbProducts: IProduct[]) => {
    let ormap = new Ormap();
    current.forEach((product) => {
        ormap.get(product.name).inc(product.quantity);
    });

    // join with ormap from request
    let reqOrmap = new Ormap();
    dbProducts.forEach((product: IProduct) => {
        reqOrmap.get(product.name).inc(product.quantity);
    });

    ormap.join(reqOrmap);

    let newProducts: IProduct[] = [];

    // convert back to products
    ormap.m.forEach((kv) => {
        let p = new Product({
            name: kv.key,
            quantity: kv.value.read(),
        });
        newProducts.push(p);
    }
    );
    return newProducts;
};