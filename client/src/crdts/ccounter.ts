import { DotKernel } from './dotkernel';
import { DotContext } from './dotcontext';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';

export interface Pair<A, B> {
  first: A;
  second: B;
}

@JsonObject()
class CCounter {
  @JsonProperty() public dk: DotKernel; // Dot kernel
  @JsonProperty() private id: string;

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

  static createWithConfig(id: string, jointContext: DotContext, dots: Pair<string, number>[]): CCounter {
    let ccounter = new CCounter(id, jointContext);
    if ('entries' in jointContext.cc) {
      const newccEntries = Object.entries(jointContext.cc.entries);
      const ccMap = new Map(newccEntries.map((entry) => [entry[1].key, entry[1].value]));

      const mappedCC = Array.from(ccMap).map(([k, v]) => {
        return { first: k, second: v };
      });

      // Convert dc to Set
      const dcSet = new Set(jointContext.dc);
      const newdotContext = DotContext.createWithConfig(mappedCC, Array.from(dcSet));
      ccounter = new CCounter(id, newdotContext);

      // Add dots if provided
      if (dots) {
        const pairDots: Pair<string, number>[] = dots.map((d) => {
          return { first: d.first, second: d.second };
        });
        pairDots.forEach((dot: Pair<string, number>) => {
          ccounter.dk.add(dot.first, dot.second);
        });
      }

    }
    return ccounter;
  }

  inc(val: number = 1): CCounter {
    let r = new CCounter();
    let dots = new Set<Pair<string, number>>(); // dots to remove, should be only 1
    let base = 0; // typically 0
    for (let dsit of this.dk.ds) {
      if (dsit[0][0] === this.id) {
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
      if (dsit[0][0] === this.id) {
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
