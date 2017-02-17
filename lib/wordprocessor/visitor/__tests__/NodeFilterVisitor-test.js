jest.autoMockOff();

let NodeFilterVisitor = require("./../NodeFilterVisitor.js");

let Node = require("./../../node/Node.js");

let LineNode = require("./../../node/container/LineNode.js");
let ListNode = require("./../../node/container/ListNode.js");
let ListItemNode = require("./../../node/container/ListItemNode.js");

let PictureNode = require("./../../node/content/PictureNode.js");

let TextNode = require("./../../node/content/TextNode.js");

let VisitRange = require("./../VisitRange.js");

let Markup = require("./../../Markup.js");
let _byRef = Markup.findNodeByTestRef;
describe('NodeFilterVisitor', function () {

    it("Shoule filter all listitem and text nodes", function () {
        let rootNode = Markup.parse(`
                <ContainerNode>
                        <ListNode pathRef='1'>
                            <ListItemNode pathRef='1_1'>
                                <TextNode pathRef='1_1_1'>xx</TextNode>
                            </ListItemNode>
                            <ListItemNode pathRef='1_2'>
                                <TextNode pathRef='1_2_1'>yy</TextNode>
                            </ListItemNode>
                            <ListItemNode pathRef='1_3'>
                                <TextNode pathRef='1_3_1'>zz</TextNode>
                            </ListItemNode>
                        </ListNode>
                </ContainerNode>
            `);

        let visitor = new NodeFilterVisitor(rootNode, [ListItemNode, TextNode]);
        let collectedNodes = visitor.perform();

        expect(collectedNodes[ListItemNode].length).toEqual(3);
        expect(collectedNodes[TextNode].length).toEqual(3);

        expect(collectedNodes[TextNode][0].text).toEqual(_byRef(rootNode, "1.1_1.1_1_1").text);
        expect(collectedNodes[TextNode][1].text).toEqual(_byRef(rootNode, "1.1_2.1_2_1").text);
        expect(collectedNodes[TextNode][2].text).toEqual(_byRef(rootNode, "1.1_3.1_3_1").text);
    });
});