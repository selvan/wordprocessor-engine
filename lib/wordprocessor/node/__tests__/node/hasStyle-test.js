jest.autoMockOff();

let Node = require("./../../Node.js");
let Style = require("./../../../Style.js");
let ContainerNode = require("./../../container/ContainerNode.js");
let TextNode = require("./../../content/TextNode.js");

let Markup = require("./../../../Markup.js");


describe('Node', function() {

    describe("style", function() {
        it("Should support has style", function() {
            let rootNode = Markup.parse(`
                <ContainerNode>
                    <TextNode pathRef="1" style="Style.BOLD" />
                </ContainerNode>
            `);
            let _node = Markup.findNodeByTestRef(rootNode, "1");
            expect(_node.hasStyle(Style.BOLD)).toBeTruthy();
        });
    });
});