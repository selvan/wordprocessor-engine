jest.autoMockOff();

let PasteVisitor = require("./../PasteVisitor.js");
let Clipboard = require("./../../Clipboard.js");

let PageNode = require("./../../node/container/PageNode.js");
let LineNode = require("./../../node/container/LineNode.js");
let ListNode = require("./../../node/container/ListNode.js");
let ListItemNode = require("./../../node/container/ListItemNode.js");

let TextNode = require("./../../node/content/TextNode.js");
let Style = require("./../../Style.js");

let VisitRange = require("./../VisitRange.js");

let Markup = require("./../../Markup.js");
let _byRef = Markup.findNodeByTestRef;

let Node = require("./../../node/Node.js");

describe('PasteVisitor', function () {
    let rootNode;
    beforeEach(function () {
        rootNode = Markup.parse(`
                <PageNode>
                    <LineNode pathRef='1'>
                        <TextNode pathRef='1_1'>xx</TextNode><TextNode pathRef='1_2'>yy</TextNode><TextNode pathRef='1_3'>zz</TextNode>
                    </LineNode>
                    <ListNode  pathRef='2'>
                        <ListItemNode pathRef='2_1'>
                            <TextNode pathRef='2_1_1'>aa</TextNode>
                        </ListItemNode>
                        <ListItemNode pathRef='2_2'>
                            <TextNode pathRef='2_2_1'>bb</TextNode>
                        </ListItemNode>
                    </ListNode>
                </PageNode>
            `);
    });

    it("clipboard is empty", function() {
        let rootMarkup = rootNode.toMarkup();

        let startNode = _byRef(rootNode, "1.1_1");
        let startOffset = 2;

        let endNode = startNode;
        let endOffset = startOffset;

        let visitRange = new VisitRange(startNode, startOffset, endNode, endOffset);
        let visitor = new PasteVisitor(visitRange);
        visitor.perform();

        expect(rootNode.toMarkup()).toEqual(rootMarkup);
        //console.log(Node.intendMarkup(rootNode.toMarkup()));
    });

    it("paste a line within a line", function() {

        let startNode = _byRef(rootNode, "1.1_1");
        let startOffset = 1;

        let endNode = startNode;
        let endOffset = startOffset;

        let pasteNode = Markup.parse(`
                    <LineNode>
                        <TextNode>paste</TextNode>
                    </LineNode>
                `);

        Clipboard.content = [pasteNode];

        let visitRange = new VisitRange(startNode, startOffset, endNode, endOffset);
        let visitor = new PasteVisitor(visitRange);
        visitor.perform();

        let expectedNode = Markup.parse(`
                <PageNode>
                  <LineNode>
                    <TextNode>x</TextNode>
                    <TextNode>paste</TextNode>
                    <TextNode>x</TextNode>
                    <TextNode>yy</TextNode>
                    <TextNode>zz</TextNode>
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
        expect(rootNode.toMarkup()).toEqual(expectedNode.toMarkup());

        //console.log(Node.intendMarkup(rootNode.toMarkup()));
    });

    it("paste a list within a list", function() {

        let startNode = _byRef(rootNode, "2.2_1.2_1_1");
        let startOffset = 1;

        let endNode = startNode;
        let endOffset = startOffset;

        let pasteNode = Markup.parse(`
                    <ListNode>
                        <ListItemNode>
                            <TextNode>paste</TextNode>
                        </ListItemNode>
                    </ListNode>
                `);

        Clipboard.content = [pasteNode];

        let visitRange = new VisitRange(startNode, startOffset, endNode, endOffset);
        let visitor = new PasteVisitor(visitRange);
        visitor.perform();

        let expectedNode = Markup.parse(`
                <PageNode>
                    <LineNode pathRef='1'>
                        <TextNode pathRef='1_1'>xx</TextNode><TextNode pathRef='1_2'>yy</TextNode><TextNode pathRef='1_3'>zz</TextNode>
                    </LineNode>
                    <ListNode  pathRef='2'>
                        <ListItemNode pathRef='2_1'>
                            <TextNode pathRef='2_1_1'>a</TextNode>
                            <TextNode>paste</TextNode>
                            <TextNode>a</TextNode>
                        </ListItemNode>
                        <ListItemNode pathRef='2_2'>
                            <TextNode pathRef='2_2_1'>bb</TextNode>
                        </ListItemNode>
                    </ListNode>
                </PageNode>
            `);
        expect(rootNode.toMarkup()).toEqual(expectedNode.toMarkup());
        //console.log(Node.intendMarkup(rootNode.toMarkup()));
    });

    it("paste a line within a line", function() {

        let startNode = _byRef(rootNode, "2.2_1.2_1_1");
        let startOffset = 1;

        let endNode = startNode;
        let endOffset = startOffset;

        let pasteNode = Markup.parse(`
                    <LineNode>
                        <TextNode>paste</TextNode>
                    </LineNode>
                `);

        Clipboard.content = [pasteNode];

        let visitRange = new VisitRange(startNode, startOffset, endNode, endOffset);
        let visitor = new PasteVisitor(visitRange);
        visitor.perform();

        let expectedNode = Markup.parse(`
            <PageNode>
              <LineNode>
                <TextNode>xx</TextNode>
                <TextNode>yy</TextNode>
                <TextNode>zz</TextNode>
              </LineNode>
              <ListNode>
                <ListItemNode>
                  <TextNode>a</TextNode>
                </ListItemNode>
              </ListNode>
              <LineNode>
                <TextNode>paste</TextNode>
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
        expect(rootNode.toMarkup()).toEqual(expectedNode.toMarkup());

        //console.log(Node.intendMarkup(rootNode.toMarkup()));
    });

    it("paste a list within a line", function() {

        let startNode = _byRef(rootNode, "1.1_1");
        let startOffset = 1;

        let endNode = startNode;
        let endOffset = startOffset;

        let pasteNode = Markup.parse(`
                    <ListNode>
                        <ListItemNode>
                            <TextNode>paste</TextNode>
                        </ListItemNode>
                    </ListNode>
                `);

        Clipboard.content = [pasteNode];

        let visitRange = new VisitRange(startNode, startOffset, endNode, endOffset);
        let visitor = new PasteVisitor(visitRange);
        visitor.perform();

        let expectedNode = Markup.parse(`
                <PageNode>
                    <LineNode>
                        <TextNode>x</TextNode>
                    </LineNode>
                    <ListNode>
                        <ListItemNode>
                            <TextNode>paste</TextNode>
                        </ListItemNode>
                    </ListNode>
                    <LineNode>
                        <TextNode>x</TextNode><TextNode>yy</TextNode><TextNode>zz</TextNode>
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
        expect(rootNode.toMarkup()).toEqual(expectedNode.toMarkup());
        //console.log(Node.intendMarkup(rootNode.toMarkup()));
    });

});