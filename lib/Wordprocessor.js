let Node = {
    Container: {
        ContainerNode: require("./wordprocessor/node/container/ContainerNode.js"),
        DocumentNode: require("./wordprocessor/node/container/DocumentNode.js"),
        PageNode: require("./wordprocessor/node/container/PageNode.js"),
        LineNode: require("./wordprocessor/node/container/LineNode.js"),
        HBoxNode: require("./wordprocessor/node/container/HBoxNode.js"),
        ListNode: require("./wordprocessor/node/container/ListNode.js"),
        ListItemNode: require("./wordprocessor/node/container/ListItemNode.js")
    },
    Content: {
        ContentNode: require("./wordprocessor/node/content/ContentNode.js"),
        TextNode: require("./wordprocessor/node/content/TextNode.js"),
        PictureNode: require("./wordprocessor/node/content/PictureNode.js"),
        ChartNode: require("./wordprocessor/node/content/ChartNode.js")
    },
    Node: require("./wordprocessor/node/Node.js")
};

let Visitor = {
    VisitRange: require("./wordprocessor/visitor/VisitRange.js"),
    ContentVisitor: require("./wordprocessor/visitor/ContentVisitor.js"),
    TextStyleVisitor: require("./wordprocessor/visitor/TextStyleVisitor.js"),
    LineStyleVisitor: require("./wordprocessor/visitor/LineStyleVisitor.js"),
    ListStyleVisitor: require("./wordprocessor/visitor/ListStyleVisitor.js"),
    CutCopyVisitor: require("./wordprocessor/visitor/CutCopyVisitor.js"),
    DeleteVisitor: require("./wordprocessor/visitor/DeleteVisitor.js"),
    PasteVisitor: require("./wordprocessor/visitor/PasteVisitor.js"),
    NodeFilterVisitor: require("./wordprocessor/visitor/NodeFilterVisitor.js")
};

let Style = require("./wordprocessor/Style.js");
let Clipboard  = require("./wordprocessor/Clipboard.js");
let Markup = require("./wordprocessor/Markup.js");
let UndoManager = require("./wordprocessor/UndoManager.js");
let SerializerAndDeserializer = require("./wordprocessor/SerializerAndDeserializer.js");

let ComputeBookNativeUtil = require("./computebook/ComputeBookNativeUtil.js");

module.exports = {
    Node: Node,
    Visitor: Visitor,
    Style: Style,
    Clipboard: Clipboard,
    Markup: Markup,
    UndoManager: UndoManager,
    SerializerAndDeserializer: SerializerAndDeserializer,
    ComputeBookNativeUtil: ComputeBookNativeUtil
};
