import { DotContext } from "./dotcontext";
import { CCounter } from "./ccounter";

// Define a generic interface for the map entries
export interface ProductEntry<N, V> {
  key: N;
  value: V;
  shoppingListId?: string;
  collection?: string;
}

// Define a generic class for the ormap
export class Ormap {
  // Use an array of MapEntry to store the map data
  m: Array<ProductEntry<string, CCounter>>;

  // Use the DotContext class to store the causal context
  cbase: DotContext;
  c: DotContext;
  id: string;

  // Define the constructor with optional parameters
  constructor(i?: string, jointc?: DotContext) {
    // Initialize the map as an empty array
    this.m = [];

    // Initialize the base context as a new DotContext
    this.cbase = new DotContext();

    // If no causal context is supplied, use the base one
    // If supplied, use a shared causal context
    this.c = jointc || this.cbase;

    // If no id is supplied, use a default one
    // If supplied, use the given id
    this.id = i || (Math.random() * 1000000).toString();
  }

  // Define a method to get the context
  context(): DotContext {
    return this.c;
  }

  // Define a method to print the ormap
  toString(): string {
    // Use a string variable to store the output
    let output = "Map:" + this.c.toString() + "\n";
    // Loop through the map entries and append them to the output
    for (const kv of this.m) {
      output += kv.key + "->" + kv.value + "\n";
    }
    // Return the output
    return output;
  }

  // Define a method to access the map by key
  get(n: string): CCounter {
    // Use a variable to store the index of the key
    let i = this.m.findIndex((kv) => kv.key === n);
    // If the key is not found, create a new entry with an empty value
    if (i === -1) {
      // Create a new value with the id and the context
      let v = new CCounter(this.id, this.c);
      // Insert the new entry at the end of the map
      this.m.push({ key: n, value: v });
      // Return the new value
      return v;
    } else {
      // If the key is found, return the existing value
      return this.m[i].value;
    }
  }

  // Define a static factory method to create an instance of Ormap
  static createWithConfig(
    id?: string,
    jointContext?: DotContext,
    entries?: ProductEntry<string, CCounter>[],
  ): Ormap {
    const ormap = new Ormap(id, jointContext);

    // Add entries if provided
    if (entries) {
      entries.forEach((product: ProductEntry<string, CCounter>) => {
        console.log('key: ', product.key);
        console.log('value: ', product.value);
        const newCC = new CCounter(product.key, product.value.dk.c);
        ormap.m.push({ key: product.key, value: newCC });
      });
    }

    return ormap;
  }

  // Define a method to erase a key from the map
  erase(n: string): Ormap {
    // Create a new ormap to store the result
    let r = new Ormap();
    // Use a variable to store the index of the key
    let i = this.m.findIndex((kv) => kv.key === n);
    // If the key is found, remove it from the map
    if (i !== -1) {
      // Get the value of the key
      let v = this.m[i].value;
      // Reset the value and get its context
      let vc = v.reset();
      // Set the context of the result to the value's context
      r.c = vc.context();
      // Remove the entry from the map
      this.m.splice(i, 1);
    }
    // Return the result
    return r;
  }

  // Define a method to reset the map
  reset(): Ormap {
    // Create a new ormap to store the result
    let r = new Ormap();
    // If the map is not empty, loop through the entries and reset them
    if (this.m.length > 0) {
      // Loop through the map entries
      for (const kv of this.m) {
        // Get the value of the entry
        let v = kv.value;
        // Reset the value and get its context
        let vc = v.reset();
        // Join the context of the result with the value's context
        r.c.join(vc.context());
      }
      // Clear the map
      this.m = [];
    }
    // Return the result
    return r;
  }

  // Define a method to join the map with another ormap
  join(o: Ormap): void {
    // Store a copy of the current context
    const ic = this.c.copy();

    // Join all keys
    // Use two variables to store the indices of the map entries
    let mit = 0;
    let mito = 0;

    console.log("Joining: ", this.toString(), " with ", o.toString());
    //Entry at both
    this.m.forEach((kv) => {
        if (o.m.findIndex((kv2) => kv2.key === kv.key) !== -1) {
            console.log("Entry in both: ", kv.key);
            kv.value.join(o.get(kv.key));
        }
        });

    o.m.forEach((kv) => {
      if (this.m.findIndex((kv2) => kv2.key === kv.key) === -1) {
        console.log("Entry only at other: ", kv.key);
        console.log("Creating empty value with context: ", kv.value);
        let empty = new CCounter(this.id, o.c);
        this.get(kv.key).inc(kv.value.read());
      }
    });
    
    // Join the current context with the other context
    this.c.join(o.c);
  }
}

