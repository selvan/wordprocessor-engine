import ContentVisitor from './ContentVisitor.js';
import VisitRange from './VisitRange.js';
import Clipboard from './../Clipboard.js';

import ListItemNode from './../node/container/ListItemNode.js';
import ListNode from './../node/container/ListNode.js';

class CutCopyVisitor extends ContentVisitor {

    constructor(visitRange, doCut=true) {
        super(visitRange);
        this._doCut = doCut;
    }

    get doCut() {
        return this._doCut;
    }

    willPerform() {
        this._setIterationStartNode();
        this._setIterationEndNode();
    }

    shouldPerform() {
        return (!this._noSelection);
    }

    didPerform() {

        let newNodes = [];

        this.affectedContainerNodes.forEach((containerNode) => {

            let newContainer = containerNode.newInstance();
            let affectedContentNodes = this.affectedContentNodesInAContainer(containerNode);


            affectedContentNodes.forEach((contentNode) => {
                if(contentNode.hasContent) {
                    newContainer.push(contentNode.clone());
                }
            });

            if(! newContainer.hasChildren) {
                return;
            }

            if(newContainer instanceof ListItemNode) {
                let _tail = newNodes.pop();
                if(_tail instanceof ListNode) {
                    _tail.push(newContainer);
                    newNodes.push(_tail);
                } else {
                    let listNode = new ListNode();
                    listNode.push(newContainer);
                    newNodes.push(_tail);
                    newNodes.push(listNode);
                }
            } else {
                newNodes.push(newContainer);
            }
        });

        Clipboard.content = newNodes;

        if(this.doCut) {
            this._removeSelectedNodes();
        }

        this.iterationStartNode.deleteIfEmpty();
        this.iterationEndNode.deleteIfEmpty();
    }

    _removeSelectedNodes() {
        this.affectedContainerNodes.forEach((containerNode) => {
            let affectedContentNodes = this.affectedContentNodesInAContainer(containerNode);
            affectedContentNodes.forEach((contentNode) => {
                containerNode.deleteChildById(contentNode.id);
            });
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

module.exports = CutCopyVisitor;