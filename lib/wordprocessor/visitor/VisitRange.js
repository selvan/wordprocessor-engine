class VisitRange {

    constructor(selectionStartNode, selectionStartOffset, selectionEndNode, selectionEndOffset) {

        this._selectionStartNode = selectionStartNode;
        this._selectionStartOffset = selectionStartOffset;
        this._selectionEndNode = selectionEndNode;
        this._selectionEndOffset = selectionEndOffset;
    }

    get selectionStartNode() {
        return this._selectionStartNode;
    }

    get selectionStartOffset(){
        return this._selectionStartOffset;
    }

    get selectionEndNode() {
        return this._selectionEndNode;
    }

    get selectionEndOffset(){
        return this._selectionEndOffset;
    }
}

module.exports = VisitRange;