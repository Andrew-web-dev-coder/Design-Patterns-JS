"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentationFactory = exports.FeatureFactory = exports.BugFactory = exports.TaskFactory = exports.DocumentationTask = exports.FeatureTask = exports.BugTask = void 0;
const tasks_1 = require("./tasks");
class BugTask extends tasks_1.Task {
    execute() {
        console.log(`Fixing bug: ${this.name}`);
    }
}
exports.BugTask = BugTask;
class FeatureTask extends tasks_1.Task {
    execute() {
        console.log(`Developing feature: ${this.name}`);
    }
}
exports.FeatureTask = FeatureTask;
class DocumentationTask extends tasks_1.Task {
    execute() {
        console.log(`Writing documentation: ${this.name}`);
    }
}
exports.DocumentationTask = DocumentationTask;
class TaskFactory {
}
exports.TaskFactory = TaskFactory;
class BugFactory extends TaskFactory {
    createTask(name, complexity) {
        return new BugTask(name, complexity);
    }
}
exports.BugFactory = BugFactory;
class FeatureFactory extends TaskFactory {
    createTask(name, complexity) {
        return new FeatureTask(name, complexity);
    }
}
exports.FeatureFactory = FeatureFactory;
class DocumentationFactory extends TaskFactory {
    createTask(name, complexity) {
        return new DocumentationTask(name, complexity);
    }
}
exports.DocumentationFactory = DocumentationFactory;
