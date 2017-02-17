let Node = require("./node/Node.js");

class UndoManager {
    constructor(document) {
        this._stack = [];
        this._stackPointer = 0;
        this.document = document;
        this.latest = null;
    }

    set stack(stack) {
        this._stack = stack;
    }

    get stack() {
        return this._stack;
    }

    set stackPointer(stackPointer) {
        this._stackPointer = stackPointer;
    }

    get stackPointer() {
        return this._stackPointer;
    }

    incrementStackPointer() {
        this.stackPointer = this.stackPointer + 1;
    }

    decrementStackPointer() {
        this.stackPointer = this.stackPointer - 1;
    }

    get undo() {
        let a_document = this.stack[this.stackPointer-1];
        if (!a_document) {
            return;
        }

        if (!this.latest) {
            this.latest = this.document.clone();
        }

        this.decrementStackPointer();
        this._set_document(a_document);

    }


    get redo() {
        let a_document = this.stack[this.stackPointer+1];

        if (!a_document) {
            if (!this.latest) {
                return
            }
            this._set_document(this.latest);
            this.latest = null;
            return
        }

        this.incrementStackPointer();
        this._set_document(a_document);
    }

    snapshot() {
        this.stack = this.stack.slice(0, this.stackPointer+1);
        this.stack.push(this.document.clone());
        this.incrementStackPointer();
    }

    _set_document(a_document) {
        this.document.resetNode();
        a_document.forEachChild((child) => {
            this.document.push(child.clone());
        });
    }
}

module.exports = UndoManager;