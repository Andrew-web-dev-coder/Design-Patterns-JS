import { Task } from "./tasks";

export class BugTask extends Task {
  execute(): void {
    console.log(`Fixing bug: ${this.name}`);
  }
}

export class FeatureTask extends Task {
  execute(): void {
    console.log(`Developing feature: ${this.name}`);
  }
}

export class DocumentationTask extends Task {
  execute(): void {
    console.log(`Writing documentation: ${this.name}`);
  }
}

export abstract class TaskFactory {
  abstract createTask(name: string, complexity: number): Task;
}

export class BugFactory extends TaskFactory {
  createTask(name: string, complexity: number): Task {
    return new BugTask(name, complexity);
  }
}

export class FeatureFactory extends TaskFactory {
  createTask(name: string, complexity: number): Task {
    return new FeatureTask(name, complexity);
  }
}

export class DocumentationFactory extends TaskFactory {
  createTask(name: string, complexity: number): Task {
    return new DocumentationTask(name, complexity);
  }
}
