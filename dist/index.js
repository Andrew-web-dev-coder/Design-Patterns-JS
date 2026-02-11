"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tasks_1 = require("./tasks");
const factory_1 = require("./factory");
const chain_1 = require("./chain");
console.log("=== Factory + Composite + Chain of Responsibility ===\n");
// Factory
const bugFactory = new factory_1.BugFactory();
const featureFactory = new factory_1.FeatureFactory();
const docFactory = new factory_1.DocumentationFactory();
const task1 = bugFactory.createTask("Fix login bug", 2);
const task2 = featureFactory.createTask("Add payment system", 5);
const task3 = docFactory.createTask("Update API docs", 7);
// Composite
const epic = new tasks_1.Epic("Release v1.0");
epic.add(task1);
epic.add(task2);
epic.add(task3);
console.log("Epic total complexity:", epic.getComplexity());
epic.execute();
console.log("\n--- Chain of Responsibility ---");
// Chain
const junior = new chain_1.JuniorDev();
const senior = new chain_1.SeniorDev();
const lead = new chain_1.TeamLead();
junior.setNext(senior).setNext(lead);
junior.handle(task1);
junior.handle(task2);
junior.handle(task3);
