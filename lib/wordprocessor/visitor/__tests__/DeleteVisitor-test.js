jest.autoMockOff();

let DeleteVisitor = require("./../DeleteVisitor.js");

let ContainerNode = require("./../../node/container/ContainerNode.js");
let ListNode = require("./../../node/container/ListNode.js");
let ListItemNode = require("./../../node/container/ListItemNode.js");

let TextNode = require("./../../node/content/TextNode.js");
let Style = require("./../../Style.js");

let VisitRange = require("./../VisitRange.js");

let Markup = require("./../../Markup.js");
let _byRef = Markup.findNodeByTestRef;

let Node = require("./../../node/Node.js");

describe('DeleteVisitor', function () {

    let rootNode;
    beforeEach(function () {
        rootNode = Markup.parse(`
                <PageNode>
                    <LineNode pathRef='1'>
                        <TextNode pathRef='1_1'>xx</TextNode><TextNode pathRef='1_2'>yy</TextNode><TextNode pathRef='1_3'>zz</TextNode>
                    </LineNode>
                    <LineNode pathRef='2'>
                        <TextNode pathRef='2_1'>xy</TextNode>
                    </LineNode>
                    <ListNode  pathRef='3'>
                        <ListItemNode pathRef='3_1'>
                            <TextNode pathRef='3_1_1'>aa</TextNode>
                        </ListItemNode>
                        <ListItemNode pathRef='3_2'>
                            <TextNode pathRef='3_2_1'>bb</TextNode>
                        </ListItemNode>
                    </ListNode>
                </PageNode>
            `);
    });

    it("no selection", function () {
        let rootMarkup = rootNode.toMarkup();

        let startNode = _byRef(rootNode, "1.1_1");
        let startOffset = 2;

        let endNode = startNode;
        let endOffset = startOffset;


        let visitRange = new VisitRange(startNode, startOffset, endNode, endOffset);
        let visitor = new DeleteVisitor(visitRange);
        visitor.perform();

        expect(rootNode.toMarkup()).toEqual(rootMarkup);
    });

    it("text selection within Text Node", function () {
        let startNode = _byRef(rootNode, "1.1_1");
        let startOffset = 0;

        let endNode = startNode;
        let endOffset = 2;


        let visitRange = new VisitRange(startNode, startOffset, endNode, endOffset);
        let visitor = new DeleteVisitor(visitRange);
        visitor.perform();

        let rootNodeAfterDelete = Markup.parse(`
            <PageNode>
              <LineNode>
                <TextNode>yy</TextNode>
                <TextNode>zz</TextNode>
              </LineNode>
              <LineNode>
                <TextNode>xy</TextNode>
              </LineNode>
              <ListNode>
                <ListItemNode>
                  <TextNode>aa</TextNode>
                </ListItemNode>
                <ListItemNode>
                  <TextNode>bb</TextNode>
                </ListItemNode>
              </ListNode>
            </PageNode>
        `);

        //console.log(Node.intendMarkup(rootNode.toMarkup()));
        expect(rootNode.toMarkup()).toEqual(rootNodeAfterDelete.toMarkup());
    });

    it("text selection across lines", function () {
        let startNode = _byRef(rootNode, "1.1_3");
        let startOffset = 0;

        let endNode = _byRef(rootNode, "2.2_1");
        let endOffset = 2;


        let visitRange = new VisitRange(startNode, startOffset, endNode, endOffset);
        let visitor = new DeleteVisitor(visitRange);
        visitor.perform();

        let rootNodeAfterDelete = Markup.parse(`
            <PageNode>
              <LineNode>
                <TextNode>xx</TextNode>
                <TextNode>yy</TextNode>
              </LineNode>
              <ListNode>
                <ListItemNode>
                  <TextNode>aa</TextNode>
                </ListItemNode>
                <ListItemNode>
                  <TextNode>bb</TextNode>
                </ListItemNode>
              </ListNode>
            </PageNode>
        `);

        //console.log(Node.intendMarkup(rootNode.toMarkup()));
        expect(rootNode.toMarkup()).toEqual(rootNodeAfterDelete.toMarkup());
    });

    it("text selection across line and list", function () {
        let startNode = _byRef(rootNode, "1.1_3");
        let startOffset = 1;

        let endNode = _byRef(rootNode, "3.3_1.3_1_1");
        let endOffset = 1;


        let visitRange = new VisitRange(startNode, startOffset, endNode, endOffset);
        let visitor = new DeleteVisitor(visitRange);
        visitor.perform();

        let rootNodeAfterDelete = Markup.parse(`
            <PageNode>
              <LineNode>
                <TextNode>xx</TextNode>
                <TextNode>yy</TextNode>
                <TextNode>z</TextNode>
              </LineNode>
              <ListNode>
                <ListItemNode>
                  <TextNode>a</TextNode>
                </ListItemNode>
                <ListItemNode>
                  <TextNode>bb</TextNode>
                </ListItemNode>
              </ListNode>
            </PageNode>
        `);

        //console.log(Node.intendMarkup(rootNode.toMarkup()));
        expect(rootNode.toMarkup()).toEqual(rootNodeAfterDelete.toMarkup());
    });

    it("text selection across list items", function () {
        let startNode = _byRef(rootNode, "3.3_1.3_1_1");
        let startOffset = 0;

        let endNode = _byRef(rootNode, "3.3_2.3_2_1");
        let endOffset = 2;


        let visitRange = new VisitRange(startNode, startOffset, endNode, endOffset);
        let visitor = new DeleteVisitor(visitRange);
        visitor.perform();

        let rootNodeAfterDelete = Markup.parse(`
            <PageNode>
              <LineNode>
                <TextNode>xx</TextNode>
                <TextNode>yy</TextNode>
                <TextNode>zz</TextNode>
              </LineNode>
              <LineNode>
                <TextNode>xy</TextNode>
              </LineNode>
            </PageNode>
        `);

        //console.log(Node.intendMarkup(rootNode.toMarkup()));
        expect(rootNode.toMarkup()).toEqual(rootNodeAfterDelete.toMarkup());
    });
});