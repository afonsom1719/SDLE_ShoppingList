import { DotContext } from "./dotcontext";
import { JsonObject, JsonProperty } from "typescript-json-serializer";

// Define a generic interface for the dotkernel class
interface DotKernel {
  ds: Map<[string, number], number>; // Map of dots to vals
  cbase: DotContext;
  c: DotContext;

  // Define a constructor that takes an optional shared causal context
  constructor(jointc?: DotContext) : void;

  // Define a method to print the dotkernel object
  toString(): string;

  // Define a method to join two dotkernel objects
  join(o: DotKernel): void;

  // Define a method to join two dotkernel objects with deep merge
  deepjoin(o: DotKernel): void;

  // Define a method to add a new dot with a value and return a delta
  add(id: string, val: number): DotKernel;

  // Define a method to remove a dot and return a delta
  rmv(val: number): DotKernel;

  rmvDot(dot: [string, number]): DotKernel;

  rmvAll() : DotKernel;

  // Define a method to add a new dot with a value and return the dot
  dotadd(id: string, val: number): [string, number];
}

// Implement the dotkernel class
@JsonObject()
class DotKernel implements DotKernel {
  @JsonProperty() ds: Map<[string, number], number>; // Map of dots to vals
  @JsonProperty() cbase: DotContext;
  @JsonProperty() c: DotContext;

  constructor(jointc?: DotContext) {
    this.ds = new Map<[string, number], number>();
    this.cbase = new DotContext();
    this.c = jointc ?? this.cbase; // Use the shared context or the base one
  }

  toString(): string {
    let output = "Kernel: DS ( ";
    for (const [dot, val] of this.ds) {
      output += `${dot[0]}:${dot[1]}->${val} `;
    }
    output += ") ";

    output += this.c.toString();

    return output;
  }

  

  join(o: DotKernel): void {
    if (this === o) return; // Join is idempotent, but just dont do it.
    // DS
    

    o.ds.forEach((val, dot) => {
      console.log("Checking dot: ", dot);
      if (!this.c.dotin(dot) && !this.ds.has(dot)) {
        console.log('dot: ', dot);
        // If I dont know, import
        this.ds.set(dot, val);
      }
    }
    );


    
    // CC
    this.c.join(o.c);
  }

  add(id: string, val: number): DotKernel {
    let res = new DotKernel();
    // get new dot
    let dot = this.c.makedot(id);
    // add under new dot
    this.ds.set(dot, val);
    // make delta
    res.ds.set(dot, val);
    res.c.insertdot(dot);
    return res;
  }

  rmv (val: number): DotKernel // remove all dots matching value
  {
    let res = new DotKernel;
    //typename  map<pair<K,int>,T>::iterator dsit;
    for(let dsit of this.ds) {
      if (dsit[1] == val) // match
      {
      
        res.c.insertdot(dsit[0],false); // result knows removed dots
        this.ds.delete(dsit[0]);
      }
    }
    res.c.compact(); // Maybe several dots there, so atempt compactation
    return res;
  }

  // Remove a dot by its key
rmvDot(dot: [string, number]): DotKernel {
  let res = new DotKernel();
  // Check if the dot exists in the map
  if (this.ds.has(dot)) {
    // Result knows removed dot
    res.c.insertdot(dot, false);
    // Remove the dot from the map
    this.ds.delete(dot);
  }
  // Attempt compactation
  res.c.compact();
  return res;
}

// Remove all dots
rmvAll(): DotKernel {
  let res = new DotKernel();
  // Iterate over all dots in the map
  for (let dot of this.ds.keys()) {
    // Result knows removed dots
    res.c.insertdot(dot, false);
  }
  // Attempt compactation
  res.c.compact();
  // Clear the map
  this.ds.clear();
  return res;
}


  


  dotadd(id: string, val: number): [string, number] {
    // get new dot
    let dot = this.c.makedot(id);
    // add under new dot
    this.ds.set(dot, val);
    return dot;
  }
}

export { DotKernel };
