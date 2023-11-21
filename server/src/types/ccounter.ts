import { DotKernel } from "./dotkernel";
import { DotContext } from "./dotcontext";

interface Pair<A, B> {
  first: A;
  second: B;
}

// Causal counter, variation of Riak_dt_emcntr and lexcounter
class CCounter {
  private dk: DotKernel; // Dot kernel
  private id: string;

  constructor(k?: string, jointc?: DotContext) {
    // Only for deltas and those should not be mutated
    // Mutable replicas need a unique id
    this.id = k ?? (Math.random() * 1000000).toString();
    this.dk = new DotKernel(jointc);
  }

  context(): DotContext {
    return this.dk.c;
  }

  toString(): string {
    return `CausalCounter:${this.dk}`;
  }

  inc(val: number = 1): CCounter {
    let r = new CCounter();
    let dots = new Set<Pair<string, number>>(); // dots to remove, should be only 1
    let base = 0; // typically 0
    for (let dsit of this.dk.ds) {
      if (dsit[0][0] == this.id) {
        // there should be a single one such
        base = Math.max(base, dsit[1]);
        let dot: Pair<string, number> = { first: this.id, second: dsit[1] };
        dots.add(dot);
      }
    }
    for (let dot of dots) r.dk.join(this.dk.rmv(dot.second));
    r.dk.join(this.dk.add(this.id, base + val));
    return r;
  }

  dec(val: number = 1): CCounter {
    let r = new CCounter();
    let dots = new Set<Pair<string, number>>(); // dots to remove, should be only 1
    let base = 0; // typically 0
    for (let dsit of this.dk.ds) {
      if (dsit[0][0] == this.id) {
        // there should be a single one such
        base = Math.max(base, dsit[1]);
        let dot: Pair<string, number> = { first: this.id, second: dsit[1] };
        dots.add(dot);
      }
    }
    for (let dot of dots) r.dk.join(this.dk.rmv(dot.second));
    r.dk.join(this.dk.add(this.id, base - val));
    

    return r;
  }

  reset(): CCounter {
    // Other nodes might however upgrade their counts
    let r = new CCounter();
    r.dk = this.dk.rmvAll();
    return r;
  }

  read(): number {
    let v = 0; // Usually 0
    for (let dse of this.dk.ds) v += dse[1];
    return v;
  }

  join(o: CCounter): void {
    this.dk.join(o.dk);
  }
}

export { CCounter };
