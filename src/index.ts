import { Epic } from "./tasks";
import {
  BugFactory,
  FeatureFactory,
  DocumentationFactory,
} from "./factory";
import { JuniorDev, SeniorDev, TeamLead } from "./chain";

console.log("=== Factory + Composite + Chain of Responsibility ===\n");

// Factory
const bugFactory = new BugFactory();
const featureFactory = new FeatureFactory();
const docFactory = new DocumentationFactory();

const task1 = bugFactory.createTask("Fix login bug", 2);
const task2 = featureFactory.createTask("Add payment system", 5);
const task3 = docFactory.createTask("Update API docs", 7);

// Composite
const epic = new Epic("Release v1.0");
epic.add(task1);
epic.add(task2);
epic.add(task3);

console.log("Epic total complexity:", epic.getComplexity());
epic.execute();

console.log("\n--- Chain of Responsibility ---");

// Chain
const junior = new JuniorDev();
const senior = new SeniorDev();
const lead = new TeamLead();

junior.setNext(senior).setNext(lead);

junior.handle(task1);
junior.handle(task2);
junior.handle(task3);
