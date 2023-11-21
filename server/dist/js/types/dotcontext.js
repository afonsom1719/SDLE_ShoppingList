"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DotContext = void 0;
// Autonomous causal context, for context sharing in maps
class DotContext {
    constructor() {
        this.cc = new Map();
        this.dc = new Set();
    }
    equals(o) {
        if (this === o)
            return true;
        // Compare cc
        if (this.cc.size !== o.cc.size)
            return false;
        for (const [k, v] of this.cc) {
            if (o.cc.get(k) !== v)
                return false;
        }
        // Compare dc
        if (this.dc.size !== o.dc.size)
            return false;
        for (const d of this.dc) {
            if (!o.dc.has(d))
                return false;
        }
        return true;
    }
    toString() {
        let output = "Context:";
        output += " CC ( ";
        for (const [k, v] of this.cc) {
            output += k + ":" + v + " ";
        }
        output += ")";
        output += " DC ( ";
        for (const [k, v] of this.dc) {
            output += k + ":" + v + " ";
        }
        output += ")";
        return output;
    }
    dotin(d) {
        const v = this.cc.get(d[0]);
        if (v !== undefined && d[1] <= v)
            return true;
        if (this.dc.has(d))
            return true;
        return false;
    }
    compact() {
        // Compact DC to CC if possible
        //boolean flag; // may need to compact several times if ordering not best
        let flag; // may need to compact several times if ordering not best
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
                }
                else {
                    // there is a CC entry already
                    if (d[1] === v + 1) {
                        // Contiguous, can compact
                        this.cc.set(d[0], d[1]);
                        this.dc.delete(d);
                        flag = true;
                    }
                    else if (d[1] <= v) {
                        // dominated, so prune
                        this.dc.delete(d);
                        // no extra compaction oportunities so flag untouched
                    }
                }
            }
        } while (flag === true);
    }
    makedot(id) {
        // On a valid dot generator, all dots should be compact on the used id
        // Making the new dot, updates the dot generator and returns the dot
        // pair<typename map<K,int>::iterator,bool> ret;
        let v = this.cc.get(id);
        if (v === undefined) {
            // not there, so insert it
            this.cc.set(id, 1);
            v = 1;
        }
        else {
            // already there, so update it
            v++;
            this.cc.set(id, v);
        }
        //return dot;
        return [id, v];
    }
    insertdot(d, compactnow = true) {
        // Set
        this.dc.add(d);
        if (compactnow)
            this.compact();
    }
    join(o) {
        if (this === o)
            return; // Join is idempotent, but just dont do it.
        // CC
        for (const [k, v] of o.cc) {
            const u = this.cc.get(k);
            if (u === undefined) {
                // entry only at other
                this.cc.set(k, v);
            }
            else {
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
}
exports.DotContext = DotContext;
