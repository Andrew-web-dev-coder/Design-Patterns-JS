"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamLead = exports.SeniorDev = exports.JuniorDev = exports.Handler = void 0;
class Handler {
    setNext(handler) {
        this.next = handler;
        return handler;
    }
    handle(task) {
        if (this.next) {
            this.next.handle(task);
        }
    }
}
exports.Handler = Handler;
class JuniorDev extends Handler {
    handle(task) {
        if (task.getComplexity() <= 3) {
            console.log(`Junior handled: ${task.getName()}`);
        }
        else {
            super.handle(task);
        }
    }
}
exports.JuniorDev = JuniorDev;
class SeniorDev extends Handler {
    handle(task) {
        if (task.getComplexity() <= 6) {
            console.log(`Senior handled: ${task.getName()}`);
        }
        else {
            super.handle(task);
        }
    }
}
exports.SeniorDev = SeniorDev;
class TeamLead extends Handler {
    handle(task) {
        console.log(`TeamLead handled: ${task.getName()}`);
    }
}
exports.TeamLead = TeamLead;
