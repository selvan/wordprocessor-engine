import ContentVisitor from './ContentVisitor.js';
import Style from './../Style.js';

import LineNode from './../node/container/LineNode.js';
import VisitRange from './VisitRange.js';

import TextNode from './../node/content/TextNode.js';

class LineStyleVisitor extends ContentVisitor {

    constructor(visitRange, style) {

        super(visitRange);
        this.style = style;
        this.removeStyle = true;
        this.ignoreAnyFurtherNodes = false;
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

        if(! node.isContentSelectable()) {
            this.ignoreAnyFurtherNodes = true;
        }

        if(this.ignoreAnyFurtherNodes) {
            return false;
        }

        let parent = node.parent;

        if (! (node instanceof TextNode && (parent instanceof LineNode))) {
            return false;
        }

        if (this.removeStyle && (! parent.hasStyle(this.style))) {
            this.removeStyle = false
        }

        return true;
    }

    didPerform() {

        if(this.affectedContainerNodes.length == 0) {
            return;
        }

        this.affectedContainerNodes.forEach( (node) => {
            if (this.removeStyle) {
                node.removeStyle(this.style);
            } else {
                this.removeClashingStyle(node, this.style);
                node.addStyle(this.style);
            }
        });
    }


    removeClashingStyle(node, insertStyle) {
        if(insertStyle.id === Style.TEXT_QUOTE_LEFT) {
            return
        }

        node.removeStyle(Style.TEXT_ALIGN_LEFT);
        node.removeStyle(Style.TEXT_ALIGN_RIGHT);
        node.removeStyle(Style.TEXT_ALIGN_CENTER);
        node.removeStyle(Style.TEXT_ALIGN_JUSTIFY);
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
        this.iterationStartNode = this.visitRange.selectionStartNode;
    }

    _setIterationEndNode() {
        this.iterationEndNode = this.visitRange.selectionEndNode;
    }
}

module.exports = LineStyleVisitor;