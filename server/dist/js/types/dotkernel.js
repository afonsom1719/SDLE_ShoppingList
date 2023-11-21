"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DotKernel = void 0;
const dotcontext_1 = require("./dotcontext");
// Implement the dotkernel class
class DotKernel {
    constructor(jointc) {
        this.ds = new Map();
        this.cbase = new dotcontext_1.DotContext();
        this.c = jointc !== null && jointc !== void 0 ? jointc : this.cbase; // Use the shared context or the base one
    }
    toString() {
        let output = "Kernel: DS ( ";
        for (const [dot, val] of this.ds) {
            output += `${dot[0]}:${dot[1]}->${val} `;
        }
        output += ") ";
        output += this.c.toString();
        return output;
    }
    join(o) {
        if (this === o)
            return; // Join is idempotent, but just dont do it.
        // DS
        console.log("Joining DS");
        console.log("Ds1: " + this.ds);
        console.log("Ds2: " + o.ds);
        this.ds.forEach((val, dot) => {
            if (o.c.dotin(dot)) {
                // other knows dot, must delete here
                this.ds.delete(dot);
            }
        });
        o.ds.forEach((val, dot) => {
            if (!this.c.dotin(dot)) {
                // If I dont know, import
                this.ds.set(dot, val);
            }
        });
        console.log("Ds1: " + this.ds);
        console.log("Ds2: " + o.ds);
        // CC
        this.c.join(o.c);
    }
    add(id, val) {
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
    rmv(val) {
        let res = new DotKernel;
        //typename  map<pair<K,int>,T>::iterator dsit;
        for (let dsit of this.ds) {
            if (dsit[1] == val) // match
             {
                res.c.insertdot(dsit[0], false); // result knows removed dots
                this.ds.delete(dsit[0]);
            }
        }
        res.c.compact(); // Maybe several dots there, so atempt compactation
        return res;
    }
    // Remove a dot by its key
    rmvDot(dot) {
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
    rmvAll() {
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
    dotadd(id, val) {
        // get new dot
        let dot = this.c.makedot(id);
        // add under new dot
        this.ds.set(dot, val);
        return dot;
    }
}
exports.DotKernel = DotKernel;
