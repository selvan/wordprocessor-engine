jest.autoMockOff();

let Node = require("./../../../Node.js");
let ContainerNode = require("./../../ContainerNode.js");
let TextNode = require("./../../../content/TextNode.js");

let Markup = require("./../../../../Markup.js");
let _byRef = Markup.findNodeByTestRef;

describe("Should support forEachChild", function() {
    it("forEachChild", function () {
        let containerNode = new ContainerNode();

        let txtNode = new TextNode("World1");
        let txtNode2 = new TextNode("World2");
        let txtNode3 = new TextNode("World3");

        containerNode.push(txtNode);
        containerNode.push(txtNode2);
        containerNode.push(txtNode3);

        let nodes = [txtNode, txtNode2, txtNode3];

        containerNode.forEachChild(function (node, index) {
            expect(nodes[index].id).toEqual(node.id);
        });
    });
});