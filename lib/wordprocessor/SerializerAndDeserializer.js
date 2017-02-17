import assign from 'object-assign';

let NODE_MAP_MAP = {};

let Node = require("./node/Node.js");
NODE_MAP_MAP[Node.name] = Node;

let ContainerNode = require("./node/container/ContainerNode.js");
NODE_MAP_MAP[ContainerNode.name] = ContainerNode;

let DocumentNode = require("./node/container/DocumentNode.js");
NODE_MAP_MAP[DocumentNode.name] = DocumentNode;

let PageNode = require("./node/container/PageNode.js");
NODE_MAP_MAP[PageNode.name] = PageNode;

let HBoxNode = require("./node/container/HBoxNode.js");
NODE_MAP_MAP[HBoxNode.name] = HBoxNode;

let LineNode = require("./node/container/LineNode.js");
NODE_MAP_MAP[LineNode.name] = LineNode;

let ListNode = require("./node/container/ListNode.js");
NODE_MAP_MAP[ListNode.name] = ListNode;

let ListItemNode = require("./node/container/ListItemNode.js");
NODE_MAP_MAP[ListItemNode.name] = ListItemNode;

let ContentNode = require("./node/content/ContentNode.js");
NODE_MAP_MAP[ContentNode.name] = ContentNode;

let PictureNode = require("./node/content/PictureNode.js");
NODE_MAP_MAP[PictureNode.name] = PictureNode;

let ChartNode = require("./node/content/ChartNode.js");
NODE_MAP_MAP[ChartNode.name] = ChartNode;

let TextNode = require("./node/content/TextNode.js");
NODE_MAP_MAP[TextNode.name] = TextNode;

let Style = require("./Style.js");
NODE_MAP_MAP[Style.name] = Style;


class Serializer {
    constructor(_rootNode) {
        this._rootNode = _rootNode;
    }

    get rootNode() {
        return this._rootNode;
    }

    serialize() {
        let wordBook = {};
        let refItems = {};

        let serializedRoot = this.rootNode.serialize(refItems);
        wordBook.root = serializedRoot;
        wordBook.refItems = refItems;
        return wordBook;
    }
}


class Deserializer {
    constructor(_wordbookSerializedData) {
        this._wordbookSerializedData = _wordbookSerializedData;
    }

    get wordbookSerializedData() {
        return this._wordbookSerializedData;
    }

    deserialize(root = this.wordbookSerializedData.root) {
        let meta = root.meta;
        let nodeType = meta.nodeType;
        let styles = meta.styles;

        let klass = NODE_MAP_MAP[nodeType];

        if(!klass) {
            return;
        }

        let newNode = new klass();
        styles.forEach(function(style) {
            newNode.addStyle(Style[style]);
        });

        newNode.deserializeData(this, root);
        return newNode;
    }
}



module.exports = {
    Serializer: Serializer,
    Deserializer: Deserializer
};