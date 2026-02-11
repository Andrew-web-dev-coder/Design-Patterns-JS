import { GraphStorage, VertexId, AdjacencyListStorage } from "./graphStorage";

// =======================
// COMPOSITE
// =======================
export interface GraphComponent {
  getName(): string;
  add(child: GraphComponent): void;
  getChildren(): GraphComponent[];
  getVertices(): Vertex[];
  print(indent?: number): string;
}

export class Vertex implements GraphComponent {
  constructor(private id: VertexId, private label?: string) {}

  getId(): VertexId {
    return this.id;
  }

  getName(): string {
    return this.label ? `${this.label}(${this.id})` : `Vertex(${this.id})`;
  }

  add(): void {
    throw new Error("Vertex is a leaf.");
  }

  getChildren(): GraphComponent[] {
    return [];
  }

  getVertices(): Vertex[] {
    return [this];
  }

  print(indent: number = 0): string {
    return `${" ".repeat(indent)}- ${this.getName()}`;
  }
}

export class SubGraph implements GraphComponent {
  protected children: GraphComponent[] = [];
  constructor(private name: string) {}

  getName(): string {
    return this.name;
  }

  add(child: GraphComponent): void {
    this.children.push(child);
  }

  getChildren(): GraphComponent[] {
    return [...this.children];
  }

  getVertices(): Vertex[] {
    return this.children.flatMap((c) => c.getVertices());
  }

  print(indent: number = 0): string {
    const head = `${" ".repeat(indent)}+ ${this.getName()}`;
    const body = this.children.map((c) => c.print(indent + 2)).join("\n");
    return body ? `${head}\n${body}` : head;
  }
}

// =======================
// BRIDGE (Abstraction)
// =======================
export class Graph extends SubGraph {
  constructor(name: string, private storage: GraphStorage = new AdjacencyListStorage()) {
    super(name);
  }

  // Bridge: переключение реализации хранения
  setStorage(storage: GraphStorage) {
    const vertices = this.getVertices().map((v) => v.getId());
    const edges = this.storage.getEdges();

    this.storage = storage;

    for (const id of vertices) this.storage.addVertex(id);
    for (const e of edges) this.storage.addEdge(e.from, e.to, e.weight);
  }

  getStorageKind(): string {
    return this.storage.kind;
  }

  // подтягиваем вершины из Composite-дерева в storage
  registerVertices(): void {
    for (const v of this.getVertices()) this.storage.addVertex(v.getId());
  }

  connect(a: VertexId, b: VertexId, weight?: number): void {
  const existing = new Set(this.getVertices().map(v => v.getId()));

  if (!existing.has(a) || !existing.has(b)) {
    throw new Error(`Cannot connect ${a} -> ${b}. Vertex does not exist in graph.`);
  }

  this.storage.addEdge(a, b, weight);
}


  neighbors(id: VertexId) {
    return this.storage.getNeighbors(id);
  }

  printAdjacency(): string {
    return this.storage.toString();
  }
}
