export interface TaskComponent {
  getName(): string;
  getComplexity(): number;
  add(task: TaskComponent): void;
  execute(): void;
}

// =====================
// Leaf
// =====================
export abstract class Task implements TaskComponent {
  constructor(
    protected name: string,
    protected complexity: number
  ) {}

  getName(): string {
    return this.name;
  }

  getComplexity(): number {
    return this.complexity;
  }

  add(): void {
    throw new Error("Cannot add subtask to simple task.");
  }

  abstract execute(): void;
}

// =====================
// Composite
// =====================
export class Epic implements TaskComponent {
  private children: TaskComponent[] = [];

  constructor(private name: string) {}

  getName(): string {
    return this.name;
  }

  add(task: TaskComponent): void {
    this.children.push(task);
  }

  getComplexity(): number {
    return this.children.reduce(
      (sum, child) => sum + child.getComplexity(),
      0
    );
  }

  execute(): void {
    console.log(`Executing Epic: ${this.name}`);
    this.children.forEach((task) => task.execute());
  }
}
