import ContentVisitor from './ContentVisitor.js';
import Style from './../Style.js';

import Node from './../node/Node.js';

import LineNode from './../node/container/LineNode.js';
import ListItemNode from './../node/container/ListItemNode.js';
import ListNode from './../node/container/ListNode.js';

import TextNode from './../node/content/TextNode.js';

import VisitRange from './VisitRange.js';

class ListStyleVisitor extends ContentVisitor {

    constructor(visitRange) {
        super(visitRange);
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

        if(! (node instanceof TextNode)) {
            return false;
        }

        return true;
    }

    didPerform() {
        if(this.affectedContainerNodes.length == 0) {
            return;
        }

        let iterationStartContainer = this.iterationStartNode.parent;
        let newNodes = [];

        this._constructNodes(newNodes);
        this._insertNodes(iterationStartContainer, newNodes);
    }

    _insertNodes=function(iterationStartContainer, newNodes) {

        if (iterationStartContainer instanceof ListItemNode) {
            let listNode = iterationStartContainer.parent;
            let pageNode = listNode.parent;
            let newSplittedListNode = listNode.splitAfterChild(iterationStartContainer);

            pageNode.addChildAfter(listNode, newSplittedListNode);

            let insertAfterNode = listNode;
            newNodes.forEach((newNode) => {
                insertAfterNode.parent.addChildAfter(insertAfterNode, newNode);
                insertAfterNode = newNode;
            });

            listNode.deleteIfNoChildren();
            newSplittedListNode.deleteIfNoChildren();
        } else if (iterationStartContainer instanceof LineNode) {
            let pageNode = iterationStartContainer.parent;

            let insertAfterNode = iterationStartContainer;
            newNodes.forEach((newNode) => {
                pageNode.addChildAfter(insertAfterNode, newNode);
                insertAfterNode = newNode;
            });
        }

        this.affectedContainerNodes.forEach((containerNode) => {
            containerNode.deleteIfNoChildren();
        });
    };

     _constructNodes = function(newNodes) {
        this.affectedContainerNodes.forEach((containerNode) => {
            if (containerNode instanceof ListItemNode) {
                let lineNode = new LineNode();
                lineNode.push(containerNode.head);
                newNodes.push(lineNode);
            } else if (containerNode instanceof LineNode) {
                let tailNode = newNodes[newNodes.length - 1];
                if (!(tailNode instanceof ListNode)) {
                    tailNode = new ListNode();
                    newNodes.push(tailNode);
                }

                let listItem = new ListItemNode();
                listItem.push(containerNode.head);

                tailNode.push(listItem);
            }
        });
    };

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

module.exports = ListStyleVisitor;