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
        // CC
        this.c.join(o.c);
        o.c = this.c;
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
    rmv(id, val) {
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
    dotadd(id, val) {
        // get new dot
        let dot = this.c.makedot(id);
        // add under new dot
        this.ds.set(dot, val);
        return dot;
    }
}
exports.DotKernel = DotKernel;
