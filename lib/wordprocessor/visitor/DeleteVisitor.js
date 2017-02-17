import ContentVisitor from './ContentVisitor.js';
import VisitRange from './VisitRange.js';

class DeleteVisitor extends ContentVisitor {

    constructor(visitRange) {
        super(visitRange);
    }

    willPerform() {
        this._setIterationStartNode();
        this._setIterationEndNode();
    }

    shouldPerform() {
        return (!this._noSelection);
    }

    didPerform() {
        this.affectedContainerNodes.forEach((containerNode) => {
            let affectedContentNodes = this.affectedContentNodesInAContainer(containerNode);
            affectedContentNodes.forEach((contentNode) => {
                containerNode.deleteChildById(contentNode.id);
            });
        });

        this.iterationStartNode.deleteIfEmpty();
        this.iterationEndNode.deleteIfEmpty();
    }


    get iterationStartNode() {
        return this._iterationStartNode;
    }

    get iterationEndNode() {
        return this._iterationEndNode;
    }

    set iterationStartNode(iterationStartNode) {
        this._iterationStartNode = iterationStartNode;
    }

    set iterationEndNode(iterationEndNode) {
        this._iterationEndNode = iterationEndNode;
    }

    get _noSelection() {
        let _range = this.visitRange;
        return (_range.selectionStartNode.id === _range.selectionEndNode.id && _range.selectionStartOffset === _range.selectionEndOffset)
    }

    _setIterationStartNode() {
        let sn = this.visitRange.selectionStartNode;
        let so = this.visitRange.selectionStartOffset;
        this.iterationStartNode = sn.splitNodeAfter(so);

        if(sn.length === 0) {
            sn.parent.deleteChildById(sn.id);
        }
    }

    _setIterationEndNode() {
        let sn = this.visitRange.selectionStartNode;
        let so = this.visitRange.selectionStartOffset;

        let en = this.visitRange.selectionEndNode;
        let eo = this.visitRange.selectionEndOffset;

        let _endNode = en;
        let _endOffset = eo;

        /* selection was within a node */
        if (sn.id === en.id) {
            _endOffset = (eo - so);
            _endNode = this.iterationStartNode;
        }

        let nextNode = _endNode.splitNodeAfter(_endOffset);
        this.iterationEndNode = _endNode;

        if(nextNode.length === 0) {
            nextNode.parent.deleteChildById(nextNode.id);
        }
    }

}

module.exports = DeleteVisitor;