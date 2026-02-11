export type VertexId = string;

export class Edge {
  constructor(
    public from: VertexId,
    public to: VertexId,
    public weight?: number
  ) {}
}

export type Neighbor = { to: VertexId; weight?: number };

export interface GraphStorage {
  readonly kind: string;
  addVertex(id: VertexId): void;
  addEdge(from: VertexId, to: VertexId, weight?: number): void;
  getNeighbors(id: VertexId): Neighbor[];
  getEdges(): Edge[];
  toString(): string;
}

// =======================
// Adjacency List
// =======================
export class AdjacencyListStorage implements GraphStorage {
  readonly kind = "AdjacencyList";
  private adj = new Map<VertexId, Map<VertexId, number | undefined>>();

  addVertex(id: VertexId): void {
    if (!this.adj.has(id)) this.adj.set(id, new Map());
  }

  addEdge(from: VertexId, to: VertexId, weight?: number): void {
    this.addVertex(from);
    this.addVertex(to);
    this.adj.get(from)!.set(to, weight);
  }

  getNeighbors(id: VertexId): Neighbor[] {
    const m = this.adj.get(id);
    if (!m) return [];
    return [...m.entries()].map(([to, w]) => ({ to, weight: w }));
  }

  getEdges(): Edge[] {
  const edges: Edge[] = [];
  for (const [from, m] of this.adj) {
    for (const [to, w] of m) {
      edges.push(new Edge(from, to, w));
    }
  }
  return edges;
}

  toString(): string {
    const lines: string[] = [];
    for (const [v, m] of this.adj) {
      const list = [...m.entries()]
        .map(([to, w]) => (w === undefined ? to : `${to}(${w})`))
        .join(", ");
      lines.push(`${v}: [${list}]`);
    }
    return lines.join("\n");
  }
}

// =======================
// Adjacency Matrix
// =======================
export class AdjacencyMatrixStorage implements GraphStorage {
  readonly kind = "AdjacencyMatrix";
  private index = new Map<VertexId, number>();
  private vertices: VertexId[] = [];
  private matrix: Array<Array<number | undefined>> = [];

  addVertex(id: VertexId): void {
    if (this.index.has(id)) return;

    const idx = this.vertices.length;
    this.vertices.push(id);
    this.index.set(id, idx);

    for (const row of this.matrix) row.push(undefined);
    this.matrix.push(new Array(this.vertices.length).fill(undefined));
  }

  addEdge(from: VertexId, to: VertexId, weight?: number): void {
    this.addVertex(from);
    this.addVertex(to);
    const i = this.index.get(from)!;
    const j = this.index.get(to)!;
    this.matrix[i][j] = weight ?? 1;
  }

  getNeighbors(id: VertexId): Neighbor[] {
    const i = this.index.get(id);
    if (i === undefined) return [];
    const row = this.matrix[i];

    const res: Neighbor[] = [];
    for (let j = 0; j < row.length; j++) {
      const w = row[j];
      if (w !== undefined) {
        res.push({ to: this.vertices[j], weight: w === 1 ? undefined : w });
      }
    }
    return res;
  }

  getEdges(): Edge[] {
  const edges: Edge[] = [];
  for (let i = 0; i < this.vertices.length; i++) {
    for (let j = 0; j < this.vertices.length; j++) {
      const w = this.matrix[i][j];
      if (w !== undefined) {
        edges.push(
          new Edge(
            this.vertices[i],
            this.vertices[j],
            w === 1 ? undefined : w
          )
        );
      }
    }
  }
  return edges;
}


  toString(): string {
    const header = ["   ", ...this.vertices.map((v) => v.padStart(3, " "))].join("");
    const lines = [header];

    for (let i = 0; i < this.vertices.length; i++) {
      const row = this.matrix[i]
        .map((v) => (v === undefined ? "  ." : `${v}`.padStart(3, " ")))
        .join("");
      lines.push(`${this.vertices[i].padStart(3, " ")}${row}`);
    }
    return lines.join("\n");
  }
}
