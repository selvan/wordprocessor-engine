import ContentVisitor from './ContentVisitor.js';
import Style from './../Style.js';

import TextNode from './../node/content/TextNode.js';
import VisitRange from './VisitRange.js';


class TextStyleVisitor extends ContentVisitor {

    constructor(visitRange, style) {

        super(visitRange);
        this.style = style;
        this.removeStyle = true;
    }

    willPerform() {
        this._setIterationStartNode();
        this._setIterationEndNode();

        //console.log("===========================");
        //console.log(this.iterationStartNode.text);
        //console.log(this.iterationEndNode.text);
        //console.log(this.iterationStartNode.id);
        //console.log(this.iterationEndNode.id);
        //console.log(this.iterationStartNode.isStartAfter(this.iterationEndNode));
        //console.log("===========================");
    }

    isContentNodeAffected(node) {

        if (! (node instanceof TextNode)) {
            return false;
        }

        // When no text, style cant be applied.
        if(node.text.trim() === '') {
            return false;
        }

        if (this.removeStyle && (! node.hasStyle(this.style))) {
            this.removeStyle = false
        }

        return true;
    }

    shouldPerform() {
        return (! this._noSelection);
    }

    didPerform() {
        this.affectedContentNodes.forEach( (node) => {
            if (this.removeStyle) {
                node.removeStyle(this.style);
            } else {
                node.addStyle(this.style);
            }
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
        if(sn.id === en.id) {
            _endOffset =  (eo - so);
            _endNode = this.iterationStartNode;
        }

        let nextNode = _endNode.splitNodeAfter(_endOffset);
        this.iterationEndNode = _endNode;

        if(nextNode.length === 0) {
            nextNode.parent.deleteChildById(nextNode.id);
        }
    }
}

module.exports = TextStyleVisitor;