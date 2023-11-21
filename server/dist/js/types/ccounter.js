"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CCounter = void 0;
const dotkernel_1 = require("./dotkernel");
// Causal counter, variation of Riak_dt_emcntr and lexcounter
class CCounter {
    constructor(k, jointc) {
        // Only for deltas and those should not be mutated
        // Mutable replicas need a unique id
        this.id = k !== null && k !== void 0 ? k : (Math.random() * 1000000).toString();
        this.dk = new dotkernel_1.DotKernel(jointc);
    }
    context() {
        return this.dk.c;
    }
    toString() {
        return `CausalCounter:${this.dk}`;
    }
    inc(val = 1) {
        let r = new CCounter();
        let dots = new Set(); // dots to remove, should be only 1
        let base = 0; // typically 0
        for (let dsit of this.dk.ds) {
            if (dsit[0][0] == this.id) {
                // there should be a single one such
                base = Math.max(base, dsit[1]);
                let dot = { first: this.id, second: dsit[1] };
                dots.add(dot);
            }
        }
        for (let dot of dots)
            r.dk.join(this.dk.rmv(dot.first, dot.second));
        r.dk.join(this.dk.add(this.id, base + val));
        return r;
    }
    dec(val) {
        let r = new CCounter();
        let dots = new Set(); // dots to remove, should be only 1
        let base = 0; // typically 0
        for (let dsit of this.dk.ds) {
            if (dsit[0][0] == this.id) {
                // there should be a single one such
                base = Math.max(base, dsit[1]);
                let dot = { first: this.id, second: dsit[1] };
                dots.add(dot);
            }
        }
        for (let dot of dots)
            r.dk.join(this.dk.rmv(dot.first, dot.second));
        r.dk.join(this.dk.add(this.id, base - val));
        return r;
    }
    reset() {
        // Other nodes might however upgrade their counts
        let r = new CCounter();
        r.dk = this.dk.rmv(this.id, 0);
        return r;
    }
    read() {
        let v = 0; // Usually 0
        for (let dse of this.dk.ds)
            v += dse[1];
        return v;
    }
    join(o) {
        this.dk.join(o.dk);
    }
}
exports.CCounter = CCounter;
