import Node from './../Node.js';

class ContentNode extends Node {
    constructor(id) {
        super(id);
    }

    isContentSelectable() {
        return false;
    }

    get hasContent() {
        return true;
    }

    clone() {
        return super.clone();
    }

    deleteIfEmpty() {
        return;
    }

    get isOnlyChild() {
        let parent = this.parent;
        if(parent) {
            return (parent.childrenCount === 1)
        }
        return false;
    }

    get isHeadNode() {
        let parent = this.parent;
        if(parent) {
            return parent.head.id === this.id
        }
        return false;
    }

    get isTailNode() {
        let parent = this.parent;
        if(parent) {
            return (parent.tail.id === this.id)
        }
        return false;
    }
}

module.exports = ContentNode;