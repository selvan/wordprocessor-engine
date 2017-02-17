import ContainerNode from "./ContainerNode"

import UndoManager from "./../../UndoManager.js"

class DocumentNode extends ContainerNode {

    constructor(id) {
        super(id);
        this._undoManager = new UndoManager(this);
    }

    get undo() {
        this.undoManager.undo;
    }

    get redo() {
        this.undoManager.redo;
    }

    undoSnapshot() {
        this.undoManager.snapshot();
    }

    get undoManager() {
        return this._undoManager;
    }
}

module.exports = DocumentNode;
