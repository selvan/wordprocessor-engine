import Node from './../Node.js';
import keyMirror from 'keymirror';

class ContainerNode extends Node {

    static EVENTS = keyMirror({
        PUSH_AN_ITEM: null,
        PUSH: null,
        POP: null,
        DELETE_CHILD: null,
        EXTRACT_CHILD: null,
        ADD_CHILD_AFTER: null,
        ADD_CHILD_BEFORE: null,
        MERGE: null,
        MERGE_AFTER_CHILD: null,
        SPLIT_AT_CHILD: null,
        SPLIT_AFTER_CHILD: null
    });

    constructor(id) {
        super(id);
        this.resetNode();
    };
    
    resetNode() {
        this._childrenCount = 0;
        this._head = null;
        this._tail= null;

        this._childrenMap = {};
        super.resetNode();
    };

    get childrenCount() {
        return this._childrenCount;
    };

    get head() {
        return this._head;
    };

    get tail() {
        return this._tail;
    };

    get isEmpty() {
        return this.childrenCount === 0;
    }

    deleteIfEmpty() {
        if(this.isEmpty && this.parent) {
            this.parent.deleteChildById(this.id);
        }
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

    push(childAndSiblings) {
        let _currChild = childAndSiblings;
        if(!_currChild) {
            return;
        }

        if(this._childrenMap.hasOwnProperty(_currChild.id)) {
            throw new Error("Cant re-add a child that already exist");
        }

        while(_currChild) {
            let _nextSibling = _currChild.next;
            if(_currChild.hasParent) {
                _currChild = _currChild.parent.extractChildById(_currChild.id);
            } else {
                this._delinkNode(_currChild);
            }
            this.addChildAfter(this.tail, _currChild);
            this.notifyChange({type: ContainerNode.EVENTS.PUSH_AN_ITEM, eventSource: this, node: _currChild});
            _currChild = _nextSibling;
        }
        this.notifyChange({type: ContainerNode.EVENTS.PUSH, eventSource: this});
    }

    pop() {
        if(!this.tail) {
            return null;
        }

        let child = this.deleteChildById(this._tail.id);
        this.notifyChange({type: ContainerNode.EVENTS.POP, eventSource: this, node: child});
        return child;
    };

    /*
     If node has children, its children are marked to null, thus make it available for GC.
     */
    deleteChildById(id, deleteSelfIfNoChildren=true) {
        let detachedNode = this.extractChildById(id);
        detachedNode.resetNode();
        if(deleteSelfIfNoChildren && (! this.hasChildren) && this.parent) {
            this.parent.deleteChildById(this.id);
        }

        this.notifyChange({type: ContainerNode.EVENTS.DELETE_CHILD, eventSource: this, node: detachedNode});
        return detachedNode;
    };

    /*
      If Node has children, all of its children are retained as it is.
     */
    extractChildById(id) {

        if(! (this.childrenCount > 0)) { 
            return null;    
        }

        if(this._childrenMap[id] == undefined ) {
            return null;
        }

        this._childrenCount--;
        let node = this._childrenMap[id];

        let prev = node.prev; 
        let next = node.next; 
        
        if(!prev) {
            this._head = next;
        }

        if(!next) {
            this._tail = prev;
        }
        
        this._delinkNode(node);

        delete this._childrenMap[id];
        this.notifyChange({type: ContainerNode.EVENTS.EXTRACT_CHILD, eventSource: this, node: node});
        return node;    
    };

    addChildAfter(refNode, childNode) {
        this._addChild(refNode, childNode, true);
        this.notifyChange({type: ContainerNode.EVENTS.ADD_CHILD_AFTER, eventSource: this, refNode: refNode, node: childNode});
        return this;
    };

    addChildBefore(refNode, childNode) {
        this._addChild(refNode, childNode, false);
        this.notifyChange({type: ContainerNode.EVENTS.ADD_CHILD_BEFORE, eventSource: this, refNode: refNode, node: childNode});
        return this;
    };    

    _addChild(refNode, childNode, shouldAddAfter=true) {

        if(!refNode) {
            refNode = this.tail;
        }

        if(! (childNode instanceof Node)) {
            throw new Error("Only type of Node is allowed");
        }

        let childId = childNode.id;

        if(!childId) {
            throw new Error(`id not defined for ${childNode}`);
        }

        if(this.childrenCount == 0) {
            this._head = this._tail = childNode;
            childNode.parent = this;
        } else {
            let node = this._childrenMap[refNode.id];
            if(node == undefined) {
                throw new Error(`Unable to find child with id ${refNode.id}. Was it deleted ?`);
            }

            if(childId == refNode.id) {
                return this;
            }

            if(this._childrenMap[childId] != undefined ) {
                this.extractChildById(childId);
            }

            if(shouldAddAfter) {
                this._linkAfterMe(node, childNode);

                if(! childNode.hasNext) {
                    this._tail = childNode;
                }
            } else {
                this._linkBeforeMe(node, childNode);

                if(! childNode.hasPrev) {
                    this._head = childNode;
                }
            }
        }

        this._childrenCount++;
        this._childrenMap[childId] = childNode;
        return this;        
    };

    getChildById(childId) {
        return this._childrenMap[childId];
    }

    merge(anotherNode) {
        this.mergeAfterChild(this.tail, anotherNode);
        this.notifyChange({type: ContainerNode.EVENTS.MERGE, eventSource: this, node: anotherNode});
        return this;
    };

    mergeAfterChild(childNode, anotherNode) {

        if(! (this.constructor === anotherNode.constructor )) {
            return;
        }

        if(anotherNode.id == this.id) {
            return;
        }


        let prevSibling = childNode;
        let headOfAnother = anotherNode.head;

        while(headOfAnother) {
            let _next = headOfAnother.next;
            if(headOfAnother.hasParent) {
                headOfAnother = headOfAnother.parent.extractChildById(headOfAnother.id);
            }
            this.addChildAfter(prevSibling, headOfAnother);
            this.notifyChange({type: ContainerNode.EVENTS.MERGE_AFTER_CHILD, eventSource: this, node: headOfAnother});
            prevSibling = headOfAnother;
            headOfAnother = _next;
        }

        if(anotherNode.parent) {
            anotherNode.parent.deleteChildById(anotherNode.id);
        } else {
            anotherNode.resetNode();
        }

        return this;
    };

    splitAtChild(_childNode) {
        if(! _childNode || (! this._childrenMap.hasOwnProperty(_childNode.id))) {
            return;
        }

        let newNode = new this.constructor();
        newNode.push(_childNode);

        this.notifyChange({type: ContainerNode.EVENTS.SPLIT_AT_CHILD, eventSource: this, node: _childNode, newNode: newNode});

        if(this.parent) {
            this.parent.addChildAfter(this, newNode);
        }

        return newNode;
    }

    splitAfterChild(_childNode) {
        if(! _childNode || (! this._childrenMap.hasOwnProperty(_childNode.id))) {
            return;
        }


        let newNode = new this.constructor();

        if(_childNode.hasNext) {
            newNode.push(_childNode.next);
        }

        this.notifyChange({type: ContainerNode.EVENTS.SPLIT_AFTER_CHILD, eventSource: this, node: _childNode, newNode: newNode});

        if(this.parent) {
            this.parent.addChildAfter(this, newNode);
        }

        return newNode;
    }


    forEachChild(callBackFn) {
        let i=0;
        let child = this.head;
        while(child) {
            let nextChild = child.next;
            callBackFn(child, i);
            i++;
            child = nextChild;
        }
    };

    _linkAfterMe(leftNode, anotherNode) {

        anotherNode.parent = leftNode.parent;
        if(leftNode.hasNext) {
            let nextNeighbor = leftNode.next;
            nextNeighbor.prev = anotherNode;
        }

        anotherNode.next = leftNode.next;
        anotherNode.prev = leftNode;        
        leftNode.next = anotherNode;
    }

    _linkBeforeMe(rightNode, anotherNode) {

        anotherNode.parent = rightNode.parent;
        if(rightNode.hasPrev) {
            let nextNeighbor = rightNode.prev;
            nextNeighbor.next = anotherNode;
        }

        anotherNode.prev = rightNode.prev;
        anotherNode.next = rightNode;        
        rightNode.prev = anotherNode;
    }    

    _delinkNode(node) {
        let prev = node.prev; 
        let next = node.next; 

        if(prev) {
            prev.next = next;   
        }

        if(next) {
            next.prev = prev;
        }

        node._prev = null;
        node._next = null;
        node._parent = null;
    }

    get hasChildren() {
        return (this.childrenCount > 0 ? true : false);
    }

    get firstChild() {
        return  this.head;
    }

    get lastChild() {
        return  this.tail;
    }

    visitorEnter(visitor) {
        visitor.enter(this);
        this.visitFirstChild(visitor);
    }

    visitFirstChild(visitor) {
        if(this.hasChildren) {
            this.firstChild.visitStart(visitor);
        }
    }

    deleteIfNoChildren() {
        if(! this.hasChildren) {
            if(this.parent) {
                this.parent.deleteChildById(this.id);
            }
        }
    }

    markupTagContent(include_id, include_style) {
        let childrenMarkUp = '';
        this.forEachChild((child, index) => (childrenMarkUp = childrenMarkUp + child.toMarkup(include_id, include_style)));
        return childrenMarkUp;
    }

    serializableData(collector) {
        let data = [];
        this.forEachChild(function(child, index) {
            data.push(child.serialize(collector));
        });
        return data;
    }

    clone() {
        let newNode = super.clone();
        this.forEachChild((child, index) => {
            let _child = child.clone();
            newNode.push(_child);
        });
        return newNode;
    }

    deserializeData(deserializer, dataAndMeta) {
        let data = dataAndMeta.data;
        data.forEach((child_data) => {
            let child = deserializer.deserialize(child_data);
            if(child) {
                this.push(child);
            }
        });
    }

    context() {
        let parent = this.parent;
        let prev = this.prev;
        return {parentNode: parent, prevNode: prev, node: this.clone()}
    }
}

module.exports = ContainerNode;
