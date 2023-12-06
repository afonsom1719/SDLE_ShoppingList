// Autonomous causal context, for context sharing in maps
class DotContext {
  public cc: Map<string, number>; // Compact causal context
  public dc: Set<[string, number]>; // Dot cloud

  constructor(cc?: Map<string, number>, dc?: Set<[string, number]>) {
    console.log('DotContext constructor', typeof cc,typeof dc);
    let ccLocal = cc;
    let dcLocal = dc;
    // if(typeof cc === 'string') {
    //   ccLocal = JSON.parse(cc);
    // }
    // if(typeof dc === 'string') {
    //   dcLocal = JSON.parse(dc);
    // }
    this.cc = ccLocal || new Map<string, number>();
    this.dc = dcLocal || new Set<[string, number]>();
  }

  public equals(o: DotContext): boolean {
    if (this === o) return true;
    // Compare cc
    if (this.cc.size !== o.cc.size) return false;
    for (const [k, v] of this.cc) {
      if (o.cc.get(k) !== v) return false;
    }
    // Compare dc
    if (this.dc.size !== o.dc.size) return false;
    for (const d of this.dc) {
      if (!o.dc.has(d)) return false;
    }
    return true;
  }

  public toString(): string {
    let output = 'Context:';
    output += ' CC ( ';
    for (const [k, v] of this.cc) {
      output += k + ':' + v + ' ';
    }
    output += ')';
    output += ' DC ( ';
    for (const [k, v] of this.dc) {
      output += k + ':' + v + ' ';
    }
    output += ')';
    return output;
  }

  public dotin(d: [string, number]): boolean {
    const v = this.cc.get(d[0]);
    if (v !== undefined && d[1] <= v) return true;
    if (this.dc.has(d)) return true;
    return false;
  }

  public compact(): void {
    // Compact DC to CC if possible
    //boolean flag; // may need to compact several times if ordering not best
    let flag: boolean; // may need to compact several times if ordering not best
    do {
      flag = false;
      for (const d of this.dc) {
        const v = this.cc.get(d[0]);
        if (v === undefined) {
          // No CC entry
          if (d[1] === 1) {
            // Can compact
            this.cc.set(d[0], d[1]);
            this.dc.delete(d);
            flag = true;
          }
        } else {
          // there is a CC entry already
          if (d[1] === v + 1) {
            // Contiguous, can compact
            this.cc.set(d[0], d[1]);
            this.dc.delete(d);
            flag = true;
          } else if (d[1] <= v) {
            // dominated, so prune
            this.dc.delete(d);
            // no extra compaction oportunities so flag untouched
          }
        }
      }
    } while (flag === true);
  }

  public makedot(id: string): [string, number] {
    // On a valid dot generator, all dots should be compact on the used id
    // Making the new dot, updates the dot generator and returns the dot
    // pair<typename map<K,int>::iterator,bool> ret;
    let v = this.cc.get(id);
    if (v === undefined) {
      // not there, so insert it
      this.cc.set(id, 1);
      v = 1;
    } else {
      // already there, so update it
      v++;
      this.cc.set(id, v);
    }
    //return dot;
    return [id, v];
  }

  public insertdot(d: [string, number], compactnow: boolean = true): void {
    // Set
    this.dc.add(d);
    if (compactnow) this.compact();
  }

  public join(o: DotContext): void {
    if (this === o) return; // Join is idempotent, but just dont do it.
    // CC
    for (const [k, v] of o.cc) {
      const u = this.cc.get(k);
      if (u === undefined) {
        // entry only at other
        this.cc.set(k, v);
      } else {
        // in both
        this.cc.set(k, Math.max(u, v));
      }
    }
    // DC
    // Set
    for (const e of o.dc) {
      this.insertdot(e, false);
    }

    this.compact();
  }
  public copy(): DotContext {
    // Create a new dot context
    let copy = new DotContext();
    // Copy the cc map
    for (const [k, v] of this.cc) {
      copy.cc.set(k, v);
    }
    // Copy the dc set
    for (const d of this.dc) {
      copy.dc.add(d);
    }
    // Compact the copied context
    copy.compact();
    // Return the copied context
    return copy;
  }
}

// Define a method to copy the dot context

export { DotContext };
