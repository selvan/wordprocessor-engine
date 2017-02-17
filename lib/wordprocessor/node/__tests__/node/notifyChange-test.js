jest.autoMockOff();

let Node = require("./../../Node.js");
let Style = require("./../../../Style.js");
let ContainerNode = require("./../../container/ContainerNode.js");
let TextNode = require("./../../content/TextNode.js");

let Markup = require("./../../../Markup.js");


describe('Node', function() {
    it("should support notification", function() {
        let rootNode = Markup.parse(`
                <ContainerNode>
                    <ContainerNode pathRef='1'>
                     </ContainerNode>
                </ContainerNode>
            `);
        let node = Markup.findNodeByTestRef(rootNode, "1");
        let callback = jest.genMockFunction();
        let callback2 = jest.genMockFunction();

        node.addChangeListener(callback);
        node.addChangeListener(callback2);
        node.notifyChange();

        expect(callback).toBeCalled();
        expect(callback2).toBeCalled();
    });
});