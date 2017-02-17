import ContainerNode from "./ContainerNode"
import PageNode from "./PageNode"

class LineNode extends ContainerNode {

    constructor(id) {
        super(id);
    }

    canBeAChildTo(toBeParentNode) {
        if(toBeParentNode instanceof PageNode) {
            return true;
        }
        return false;
    }
}

module.exports = LineNode;
