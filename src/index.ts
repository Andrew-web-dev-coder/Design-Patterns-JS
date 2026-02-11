import { AdjacencyListStorage, AdjacencyMatrixStorage } from "./strategies";
import { Graph, SubGraph, Vertex } from "./tasks";

console.log("=== Bridge + Composite: Graphs & Trees ===\n");

// Composite: граф + подграфы + вершины
const g = new Graph("MainGraph", new AdjacencyListStorage());

const core = new SubGraph("Core");
const ui = new SubGraph("UI");
const nested = new SubGraph("Nested");

core.add(new Vertex("A", "Alpha"));
core.add(new Vertex("B", "Beta"));

ui.add(new Vertex("C", "Gamma"));
nested.add(new Vertex("D", "Delta"));
nested.add(new Vertex("E", "Epsilon"));
ui.add(nested);

g.add(core);
g.add(ui);

// Bridge: хранилище
g.registerVertices();
g.connect("A", "B", 5);
g.connect("B", "C", 2);
g.connect("C", "D");
g.connect("D", "E", 7);

console.log("Composite structure:");
console.log(g.print());

console.log("\nStorage:", g.getStorageKind());
console.log(g.printAdjacency());

console.log("\nSwitch storage to MATRIX (Bridge):");
g.setStorage(new AdjacencyMatrixStorage());
console.log("Storage:", g.getStorageKind());
console.log(g.printAdjacency());

// Мини-дерево (как частный случай графа)
console.log("\nTree example:");
const tree = new Graph("Tree");
const root = new SubGraph("Root");
root.add(new Vertex("R", "RootV"));

const left = new SubGraph("Left");
left.add(new Vertex("L", "LeftV"));

const right = new SubGraph("Right");
right.add(new Vertex("RR", "RightV"));

root.add(left);
root.add(right);
tree.add(root);

tree.registerVertices();
tree.connect("R", "L");
tree.connect("R", "RR");

console.log(tree.print());
console.log(tree.printAdjacency());
