// Import the CCounter class from the file where it is defined
import { CCounter } from "./types/ccounter";

// Create two instances of CCounter with different ids
let c1 = new CCounter("c1");
let c2 = new CCounter("c2");

// Increment c1 by 3 and c2 by 5
c1.inc(3);
c2.inc(5);

// Print the values of c1 and c2
console.log("c1 = " + c1.read()); // c1 = 3
console.log("c2 = " + c2.read()); // c2 = 5

// Join c1 and c2
c1.join(c2);

// Print the values of c1 and c2 after joining
console.log("c1 = " + c1.read()); // c1 = 8
console.log("c2 = " + c2.read()); // c2 = 8

// Decrement c1 by 2 and c2 by 4
c1.dec(2);
c2.dec(4);

// Print the values of c1 and c2 after decrementing
console.log("c1 = " + c1.read()); // c1 = 6
console.log("c2 = " + c2.read()); // c2 = 4

// Reset c1
c1.reset();

// Print the value of c1 after resetting
console.log("c1 = " + c1.read()); // c1 = 0
