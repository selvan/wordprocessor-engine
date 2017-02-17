import SeqGen from 'seqgen';
let EventEmitter = require('events').EventEmitter;
import assign from 'object-assign';

let NODE_CHANGE_EVENT = 'node_change';

class Node extends EventEmitter {
    constructor(_id) {
        super();
        if(!_id) {
            _id = SeqGen.next();
        }
        this._id = _id;
        this.resetNode();
    }

    get id() {
        return this._id;
    };

    get style() {
        return this._style;
    };

    set prev(prev) {
        this._prev = prev;
    };

    get prev() {
        return this._prev;
    };

    get hasPrev() {
        return (this.prev != null);
    };    

	get next() {
        return this._next;
    };

	set next(next) {
        this._next = next;
    };    

	get hasNext() {
        return (this.next != null);
    };    

    get parent() {
        return this._parent;
    };

    set parent(parent) {
        this._parent = parent;
    };    

    get hasParent() {
        if(this.parent) {
            return true;
        }
        return false;
    };

    get isRoot() {
        return (!this.hasParent);
    };

    get position() {

        if(this.prev) {
            return this.prev.position + 1;
        }

        return 0;
    }

    /*
     -1 if this child1 is before child2
     0 if this child1 & child2 are same
     1 if this child1 is after child2
     */
    compareChildPosition(child1, child2) {
        if(child1.parent.id !== this.id || child2.parent.id !== this.id) {
            throw new Error("Cant compare children. Am not a parent.")
        }

        if(child1.id === child2.id) {
            return 0;
        }

        return (child1.position < child2.position ? -1 : 1)
    }

    /*
        -1 if this nodeX is before nodeY
        0 if this nodeX & nodeY are same
        1 if this nodeX is after nodeY
     */
    static compareNodeStartPosition(nodeX, nodeY) {

        if((!nodeX) || (!nodeY)) {
            throw new Error("Can't compare, invalid node");
        }

        let compareResult = 0;

        if(nodeX.id === nodeY.id) {
            return compareResult;
        }

        let nodeXHierarchies =  nodeX.hierarchyFromRootToSelf;
        let nodeYHierarchies =  nodeY.hierarchyFromRootToSelf;

        let iterationCount = Math.min(nodeXHierarchies.length, nodeYHierarchies.length);

        for(let i=0; i < iterationCount; i++) {
            let xHierarchy = nodeXHierarchies[i];
            let yHierarchy = nodeYHierarchies[i];

            if(xHierarchy.id === yHierarchy.id) {
                continue;
            }

            if(xHierarchy.position < yHierarchy.position) {
                compareResult = -1;
                break;
            } else {
                compareResult = 1;
                break;
            }
        }

        if(compareResult === 0 ) {
            compareResult = (nodeXHierarchies.length < nodeYHierarchies.length ? -1 : 1);
        }

        return compareResult;
    }

    get hierarchyFromRootToSelf() {
        let hierarchies =  [];
        let _node = this;
        while(_node) {
            hierarchies.unshift(_node);
            _node = _node.parent;
        }

        return hierarchies;
    }

    get hierarchyFromSelfToRoot() {
        return this.hierarchyFromRootToSelf.reverse();
    }

    get parentHierarchyTillRoot() {
        let hierarchies = this.hierarchyFromSelfToRoot;
        //remove self
        hierarchies.shift();
        return hierarchies;
    }

    hasStyle(style) {
        return this.style.hasOwnProperty(style.id);
    }

    addStyle(style) {
        this.style[style.id] = style;
        this.notifyChange();
    }

    removeStyle(style) {
        delete this.style[style.id];
        this.notifyChange();
    }

    styleTypes() {
        let _styleTypes = [];
        for (var k in this.style) {
            _styleTypes.push(this.style[k].type);
        }
        return _styleTypes;
    }

    get styleStr() {
        let _styleContainer = [];
        for (var k in this.style){
            _styleContainer.push(this.style[k].styleDefinition);
        }
        return JSON.stringify(_styleContainer);
    }

    isStartAfter(anotherNode) {
        return (Node.compareNodeStartPosition(this, anotherNode) === 1)  ? true : false;
    }

    resetNode() {
        this._parent = null;
        this._next = null;
        this._prev = null;
        this.resetStyle();

        this.changeEmitter = new EventEmitter();
    }

    resetStyle() {
        this._style = {};
    }

    visitorEnter(visitor) {
        visitor.enter(this);
    }

    visitorExit(visitor) {
        visitor.exit(this);
    }

    visitNextNeighbour(visitor) {
        if(this.next != null) {
            this.next.visitStart(visitor);
        }
    }

    visitStart(visitor) {
        if(visitor.iterationEndNode && this.isStartAfter(visitor.iterationEndNode)) {
            return
        }

        this.visitorEnter(visitor);
        this.visitorExit(visitor);
        this.visitNextNeighbour(visitor);
    }

    addChangeListener(callback) {
        this.on(NODE_CHANGE_EVENT, callback);
    }

    removeChangeListener(callback) {
        this.removeListener(NODE_CHANGE_EVENT, callback);
    }

    notifyChange(payload={}) {
        this.emit(NODE_CHANGE_EVENT, payload);
    }

    clone() {
        let newNode = this.cloneSelf();
        this.cloneStyle(newNode);
        return newNode;
    }

    cloneSelf() {
        return new this.constructor(this.id);
    }

    cloneStyle(node) {
        for(let styleId in this.style) {
            node.addStyle(this.style[styleId]);
        }
    }

    newInstance() {
        return new this.constructor();
    }

    serialize(collector) {
        let _meta_and_data = {
            meta: this.serializableMeta(),
            data: this.serializableData(collector)
        };

        return _meta_and_data;
    }

    serializableMeta() {
        let meta = {
            nodeType: this.constructor.name,
            styles: this.styleTypes()
        };
        return meta;
    }

    serializableData(collector) {
        return "Override in subclass?";
    }

    deserializeData(deserializedCollection, dataAndMeta) {
        return "Override in subclass?";
    }

    toMarkup(include_id, include_style) {
        let _idVal= '';
        let _styleStrVal = '';

        if(include_id) {
            _idVal = `id='${this.id}'`;
        }

        if(include_style) {
            _styleStrVal = `style='${this.styleStr}'`;
        }

        let startTagValues = `${this.constructor.name}`;
        if(_idVal !== '') {
            startTagValues = `${startTagValues} ${_idVal}`;
        }

        if(_styleStrVal !== '') {
            startTagValues = `${startTagValues} ${_styleStrVal}`;
        }
        return `<${startTagValues}>${this.markupTagContent(include_id, include_style)}</${this.constructor.name}>`;
    }

    markupTagContent(include_id, include_style) {
        return "Override in subclass?";
    }

    canBeAChildTo(toBeParentNode) {
        return false;
    }

    pp(markupStr) {
        console.log(Node.intendMarkup(markupStr));
    }

    static intendMarkup(markupStr) {

        //https://gist.github.com/sente/1083506
        let formatted = '';
        let reg = /(>)(<)(\/*)/g;
        markupStr = markupStr.replace(reg, '$1\r\n$2$3');
        let pad = 0;
        markupStr.split('\r\n').forEach((node, index) => {
            let indent = 0;
            if (node.match( /.+<\/\w[^>]*>$/ )) {
                indent = 0;
            } else if (node.match( /^<\/\w/ )) {
                if (pad != 0) {
                    pad -= 1;
                }
            } else if (node.match( /^<\w[^>]*[^\/]>.*$/ )) {
                indent = 1;
            } else {
                indent = 0;
            }

            let padding = '';
            for (let i = 0; i < pad; i++) {
                padding += '  ';
            }

            formatted += padding + node + '\r\n';
            pad += indent;
        });
        return formatted;
    }
}

module.exports = Node;