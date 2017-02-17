jest.autoMockOff();

let Node = require("./../../Node.js");
let Style = require("./../../../Style.js");
let ContainerNode = require("./../../container/ContainerNode.js");
let TextNode = require("./../../content/TextNode.js");

let Markup = require("./../../../Markup.js");


describe('Node', function() {
    it("Should support serialize", function() {
        let rootNode = Markup.parse(`
            <ContainerNode>
                <TextNode pathRef="1"/>
            </ContainerNode>
        `);
        let _node = Markup.findNodeByTestRef(rootNode, "1");
        let changeCallback = jest.genMockFunction();
        _node.addChangeListener(changeCallback);
        _node.addStyle(Style.BOLD);
        _node.addStyle(Style.ITALIC);

        expect(changeCallback).toBeCalled();
        expect(_node.hasStyle(Style.BOLD)).toBeTruthy();
        expect(_node.hasStyle(Style.ITALIC)).toBeTruthy();

        let serialized_parent = rootNode.serialize();


        expect(serialized_parent.meta.styles.length).toEqual(0);
        expect(serialized_parent.meta.nodeType).toEqual(rootNode.constructor.name);
        expect(serialized_parent.data.length).toEqual(1);

        let serialized_child = serialized_parent.data[0];
        expect(serialized_child.meta.styles.length).toEqual(2);
        expect(serialized_child.meta.nodeType).toEqual(rootNode.head.constructor.name);
        expect(serialized_child.data.text).toEqual(rootNode.head.text);
    });
});