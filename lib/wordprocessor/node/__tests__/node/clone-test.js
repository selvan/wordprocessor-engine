jest.autoMockOff();

let Node = require("./../../Node.js");
let Style = require("./../../../Style.js");
let ContainerNode = require("./../../container/ContainerNode.js");
let TextNode = require("./../../content/TextNode.js");

let Markup = require("./../../../Markup.js");


describe('Node', function() {
    it("should support clone", function() {
        let rootNode = Markup.parse(`
            <ContainerNode>
                <TextNode pathRef="1" style="Style.BOLD" />
            </ContainerNode>
        `);
        let _node = Markup.findNodeByTestRef(rootNode, "1");
        expect(_node.hasStyle(Style.BOLD)).toBeTruthy();

        let _clonedNode = _node.clone();
        expect(_clonedNode.hasStyle(Style.BOLD)).toBeTruthy();
        expect(_clonedNode.id).toEqual(_node.id);
    });
});