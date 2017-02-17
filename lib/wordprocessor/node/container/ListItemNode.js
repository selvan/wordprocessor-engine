import LineNode from "./LineNode"
import ListNode from "./ListNode"

class ListItemNode extends LineNode {

    constructor(id) {
        super(id);
    }

    deleteIfNoChildren() {
        let _parent = this.parent;
        super.deleteIfNoChildren();
        if(_parent) {
            _parent.deleteIfNoChildren();
        }
    }

    canBeAChildTo(toBeParentNode) {
        if(toBeParentNode instanceof ListNode) {
            return true;
        }
        return false;
    }
}

module.exports = ListItemNode;
