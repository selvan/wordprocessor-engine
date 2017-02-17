

class Visitor {

    constructor() {

    }

    enter(node) {
        throw new Error("Should be implemented by sub class");
    }

    exit(node) {
        throw new Error("Should be implemented by sub class");
    }

    get iterationStartNode() {
        throw new Error("Should be implemented by sub class");
    }

    get iterationEndNode() {
        throw new Error("Should be implemented by sub class");
    }
}

module.exports = Visitor;