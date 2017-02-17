import Visitor from './Visitor';
import ContentNode from './../node/content/ContentNode.js';

class ContentVisitor extends Visitor {

    constructor(visitRange) {
        super();
        this._visitRange = visitRange;

        this._affectedContainerNodes = [];
        this._affectedContainerNodesDict = {};
        this._affectedContentNodesInAContainer = {};

        this._affectedContentNodes = [];
    }

    get affectedContentNodes() {
        return this._affectedContentNodes;
    }

    get affectedContainerNodes() {
        return this._affectedContainerNodes;
    }

    affectedContentNodesInAContainer(container) {
        if(! container) {
            return [];
        }
        return this._affectedContentNodesInAContainer[container.id];
    }

    get visitRange() {
        return this._visitRange;
    }

    enter(node) {
        if(! (node instanceof ContentNode)) {
            return
        }

        if(this.isContentNodeAffected(node)) {
            this._setAffectedNode(node);
        }
    }


    isContentNodeAffected(node) {
        return true;
    }

    exit(node) {
        if(! (node instanceof ContentNode)) {
            return
        }
    }

    get iterationStartNode() {
        throw new Error("Should be implemented by sub class");
    }

    get iterationEndNode() {
        throw new Error("Should be implemented by sub class");
    }

    perform() {

        if(! this.shouldPerform()) {
            return;
        }

        this.willPerform();

        let iterationStartNode = this.iterationStartNode;
        iterationStartNode.visitStart(this);

        let parentHierarchies = iterationStartNode.parentHierarchyTillRoot;
        parentHierarchies.forEach((node) => {
            node.visitNextNeighbour(this);
        });

        this.didPerform();
    }

    shouldPerform() {
        return true;
    }

    willPerform() {
    }

    didPerform() {
    }

    _setAffectedNode(contentNode) {

        this._affectedContentNodes.push(contentNode);

        let containerNode = contentNode.parent;

        if(! containerNode) {
            return
        }

        if(! this._affectedContainerNodesDict[containerNode.id]) {
            this._affectedContainerNodesDict[containerNode.id] = containerNode.id;
            this._affectedContainerNodes.push(containerNode);
        }

        if(! this._affectedContentNodesInAContainer[containerNode.id]) {
            this._affectedContentNodesInAContainer[containerNode.id] = [];
        }

        this._affectedContentNodesInAContainer[containerNode.id].push(contentNode);
    }
}

module.exports = ContentVisitor;