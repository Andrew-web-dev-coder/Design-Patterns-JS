import { TaskComponent } from "./tasks";

export abstract class Handler {
  protected next?: Handler;

  setNext(handler: Handler): Handler {
    this.next = handler;
    return handler;
  }

  handle(task: TaskComponent): void {
    if (this.next) {
      this.next.handle(task);
    }
  }
}

export class JuniorDev extends Handler {
  handle(task: TaskComponent): void {
    if (task.getComplexity() <= 3) {
      console.log(`Junior handled: ${task.getName()}`);
    } else {
      super.handle(task);
    }
  }
}

export class SeniorDev extends Handler {
  handle(task: TaskComponent): void {
    if (task.getComplexity() <= 6) {
      console.log(`Senior handled: ${task.getName()}`);
    } else {
      super.handle(task);
    }
  }
}

export class TeamLead extends Handler {
  handle(task: TaskComponent): void {
    console.log(`TeamLead handled: ${task.getName()}`);
  }
}
