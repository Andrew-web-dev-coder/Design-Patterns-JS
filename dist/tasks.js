"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Epic = exports.Task = void 0;
// =====================
// Leaf
// =====================
class Task {
    constructor(name, complexity) {
        this.name = name;
        this.complexity = complexity;
    }
    getName() {
        return this.name;
    }
    getComplexity() {
        return this.complexity;
    }
    add() {
        throw new Error("Cannot add subtask to simple task.");
    }
}
exports.Task = Task;
// =====================
// Composite
// =====================
class Epic {
    constructor(name) {
        this.name = name;
        this.children = [];
    }
    getName() {
        return this.name;
    }
    add(task) {
        this.children.push(task);
    }
    getComplexity() {
        return this.children.reduce((sum, child) => sum + child.getComplexity(), 0);
    }
    execute() {
        console.log(`Executing Epic: ${this.name}`);
        this.children.forEach((task) => task.execute());
    }
}
exports.Epic = Epic;
