import { DotContext } from "./dotcontext";

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
  rmv(id: string, val: number): DotKernel;

  // Define a method to add a new dot with a value and return the dot
  dotadd(id: string, val: number): [string, number];
}

// Implement the dotkernel class
class DotKernel implements DotKernel {
  ds: Map<[string, number], number>;
  cbase: DotContext;
  c: DotContext;

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

    this.ds.forEach((val, dot) => {
      if (o.c.dotin(dot)) {
        // other knows dot, must delete here
        this.ds.delete(dot);
      }
    }
    );
    o.ds.forEach((val, dot) => {
      if (!this.c.dotin(dot)) {
        // If I dont know, import
        this.ds.set(dot, val);
      }
    }
    );
    

    
    // CC
    this.c.join(o.c);
    o.c = this.c;
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

  rmv(id: string, val: number): DotKernel {
    let res = new DotKernel();
    // get new dot
    let dot = this.c.makedot(id);
    // remove under new dot
    this.ds.delete(dot);
    // make delta
    res.ds.delete(dot);
    res.c.insertdot(dot);
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
