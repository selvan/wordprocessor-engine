import Visitor from './Visitor';

class NodeFilterVisitor extends Visitor {

    constructor(startNode, filterNodeTypes) {
        super();

        this._startNode = startNode;

        if(!filterNodeTypes) {
            filterNodeTypes=[];
        }

        this._collector= {};

        for(let i=0;i<filterNodeTypes.length;i++) {
            this.collector[filterNodeTypes[i]] = [];
        }
    }

    get startNode() {
        return this._startNode;
    }

    get visitRange() {
        return this._visitRange;
    }

    get collector() {
        return this._collector;
    }

    enter(node) {
        if(! (this.collector[node.constructor])) {
            return
        }

        this.collector[node.constructor].push(node);
    }

    exit(node) {
    }

    get iterationStartNode() {
        return this.startNode;
    }

    get iterationEndNode() {
        return null;
    }

    perform() {

        this.iterationStartNode.visitStart(this);

        let parentHierarchies = this.startNode.parentHierarchyTillRoot;
        parentHierarchies.forEach((node) => {
            node.visitNextNeighbour(this);
        });

        return this.collector;
    }
}

module.exports = NodeFilterVisitor;