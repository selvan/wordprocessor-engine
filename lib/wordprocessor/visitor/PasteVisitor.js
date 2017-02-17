import ContentVisitor from './ContentVisitor.js';
import VisitRange from './VisitRange.js';
import Clipboard from './../Clipboard.js';

import ListNode from './../node/container/ListNode.js';
import ListItemNode from './../node/container/ListItemNode.js';
import LineNode from './../node/container/LineNode.js';

class PasteVisitor extends ContentVisitor {

    constructor(visitRange) {
        super(visitRange);
    }

    willPerform() {
        this._setIterationStartNode();
        this._setIterationEndNode();
    }

    didPerform() {
        this._insertNodesAtIterationStart();

        this.iterationStartNode.deleteIfEmpty();
        this.iterationEndNode.deleteIfEmpty();
    }

    _splitAtIterationStartNode() {
        let iterationStartContainer = this.iterationStartNode.parent;
        if (iterationStartContainer instanceof ListItemNode) {
            iterationStartContainer.splitAfterChild(this.iterationStartNode);
            let listNode = iterationStartContainer.parent;
            listNode.splitAfterChild(iterationStartContainer);
        } else if (iterationStartContainer instanceof LineNode) {
            iterationStartContainer.splitAfterChild(this.iterationStartNode);
        }
    }

    _insertNodesAtIterationStart() {

        let clipBoardNodes = Clipboard.content;
        if(! (clipBoardNodes && clipBoardNodes.constructor === [].constructor && clipBoardNodes.length > 0)) {
            return;
        }

        let firstNode = clipBoardNodes.shift();
        let iterationStartContainer = this.iterationStartNode.parent;

        if((iterationStartContainer instanceof ListItemNode) && (firstNode instanceof ListNode)) {
            iterationStartContainer.mergeAfterChild(this.iterationStartNode, firstNode.head);
            let listNode = iterationStartContainer.parent;
            listNode.mergeAfterChild(iterationStartContainer, firstNode);
        } else if(!(iterationStartContainer.mergeAfterChild(this.iterationStartNode, firstNode))) {
            clipBoardNodes.unshift(firstNode);
        }

        if(clipBoardNodes.length > 0) {
            this._splitAtIterationStartNode();
        }

        let insertAfter = iterationStartContainer;
        let parentNode = insertAfter.parent;
        if(parentNode instanceof ListNode) {
            insertAfter = parentNode;
            parentNode = parentNode.parent;
        }

        clipBoardNodes.forEach(function(node) {
            parentNode.addChildAfter(insertAfter, node);
        });
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

module.exports = PasteVisitor;