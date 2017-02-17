jest.autoMockOff();

let CutCopyVisitor = require("./../CutCopyVisitor.js");
let Clipboard = require("./../../Clipboard.js");

let ContainerNode = require("./../../node/container/ContainerNode.js");
let ListNode = require("./../../node/container/ListNode.js");
let ListItemNode = require("./../../node/container/ListItemNode.js");

let TextNode = require("./../../node/content/TextNode.js");
let Style = require("./../../Style.js");

let VisitRange = require("./../VisitRange.js");

let Markup = require("./../../Markup.js");
let _byRef = Markup.findNodeByTestRef;

let Node = require("./../../node/Node.js");

describe('CutCopyVisitor', function () {
    describe("Should support copy", function () {
        describe("empty selection", function () {
            let rootNode;
            beforeEach(function () {
                rootNode = Markup.parse(`
                <ContainerNode>
                    <ContainerNode pathRef='1'>
                        <ContainerNode pathRef='1_1'>
                            <TextNode pathRef='1_1_1'>x</TextNode><TextNode pathRef='1_1_2'>y</TextNode><TextNode pathRef='1_1_3'>z</TextNode>
                        </ContainerNode>
                        <ListNode  pathRef='1_2'>
                            <ListItemNode pathRef='1_2_1'>
                                <TextNode pathRef='1_2_1_1'>a</TextNode>
                            </ListItemNode>
                        </ListNode>
                     </ContainerNode>
                </ContainerNode>
            `);
            });

            it("within a container", function () {
                let rootMarkup = rootNode.toMarkup();

                let startNode = _byRef(rootNode, "1.1_1.1_1_1");
                let startOffset = 1;

                let endNode = _byRef(rootNode, "1.1_1.1_1_2");
                let endOffset = 0;

                Clipboard.content = [];

                let visitRange = new VisitRange(startNode, startOffset, endNode, endOffset);
                let visitor = new CutCopyVisitor(visitRange, false);
                visitor.perform();

                expect(rootNode.toMarkup()).toEqual(rootMarkup);
                expect(Clipboard.content.length).toEqual(0);
            });

            it("across containers", function () {
                let rootMarkup = rootNode.toMarkup();

                let startNode = _byRef(rootNode, "1.1_1.1_1_3");
                let startOffset = 1;

                let endNode = _byRef(rootNode, "1.1_2.1_2_1.1_2_1_1");
                let endOffset = 0;

                Clipboard.content = [];

                let visitRange = new VisitRange(startNode, startOffset, endNode, endOffset);
                let visitor = new CutCopyVisitor(visitRange, false);
                visitor.perform();

                expect(rootNode.toMarkup()).toEqual(rootMarkup);
                expect(Clipboard.content.length).toEqual(0);
            });
        });

        describe("make selection", function () {
            let rootNode;
            beforeEach(function () {
                rootNode = Markup.parse(`
                <ContainerNode>
                    <ContainerNode pathRef='1'>
                        <ContainerNode pathRef='1_1'>
                            <TextNode pathRef='1_1_1'>xx</TextNode><TextNode pathRef='1_1_2'>yy</TextNode><TextNode pathRef='1_1_3'>zz</TextNode>
                        </ContainerNode>
                        <ListNode  pathRef='1_2'>
                            <ListItemNode pathRef='1_2_1'>
                                <TextNode pathRef='1_2_1_1'>aa</TextNode>
                            </ListItemNode>
                        </ListNode>
                     </ContainerNode>
                </ContainerNode>
            `);
            });

            it("within a container", function () {
                let startNode = _byRef(rootNode, "1.1_1.1_1_1");
                let startOffset = 1;

                let endNode = _byRef(rootNode, "1.1_1.1_1_3");
                let endOffset = 1;

                Clipboard.content = [];

                let visitRange = new VisitRange(startNode, startOffset, endNode, endOffset);
                let visitor = new CutCopyVisitor(visitRange, false);
                visitor.perform();

                let rootNodeAfterCopy = Markup.parse(`
                <ContainerNode>
                    <ContainerNode pathRef='1'>
                        <ContainerNode pathRef='1_1'>
                            <TextNode>x</TextNode><TextNode>x</TextNode><TextNode>yy</TextNode><TextNode>z</TextNode><TextNode>z</TextNode>
                        </ContainerNode>
                        <ListNode  pathRef='1_2'>
                            <ListItemNode pathRef='1_2_1'>
                                <TextNode pathRef='1_2_1_1'>aa</TextNode>
                            </ListItemNode>
                        </ListNode>
                     </ContainerNode>
                </ContainerNode>
            `);
                expect(rootNode.toMarkup()).toEqual(rootNodeAfterCopy.toMarkup());
                expect(Clipboard.content.length).toEqual(1);

                let copiedNode = Markup.parse(`
                    <ContainerNode>
                      <TextNode>x</TextNode>
                      <TextNode>yy</TextNode>
                      <TextNode>z</TextNode>
                    </ContainerNode>
                `);

                expect(copiedNode.toMarkup()).toEqual(Clipboard.content[0].toMarkup());
            });

            it("across containers", function () {
                let startNode = _byRef(rootNode, "1.1_1.1_1_3");
                let startOffset = 1;

                let endNode = _byRef(rootNode, "1.1_2.1_2_1.1_2_1_1");
                let endOffset = 1;

                Clipboard.content = [];

                let visitRange = new VisitRange(startNode, startOffset, endNode, endOffset);
                let visitor = new CutCopyVisitor(visitRange, false);
                visitor.perform();

                let rootNodeAfterCopy = Markup.parse(`
                <ContainerNode>
                    <ContainerNode pathRef='1'>
                        <ContainerNode pathRef='1_1'>
                            <TextNode>xx</TextNode><TextNode>yy</TextNode><TextNode>z</TextNode><TextNode>z</TextNode>
                        </ContainerNode>
                        <ListNode>
                            <ListItemNode>
                                <TextNode>a</TextNode><TextNode>a</TextNode>
                            </ListItemNode>
                        </ListNode>
                     </ContainerNode>
                </ContainerNode>
            `);
                expect(rootNode.toMarkup()).toEqual(rootNodeAfterCopy.toMarkup());
                expect(Clipboard.content.length).toEqual(2);

                //console.log(Node.intendMarkup(Clipboard.content[0].toMarkup()));
                //console.log(Node.intendMarkup(Clipboard.content[1].toMarkup()));

                let copiedNode1 = Markup.parse(`
                    <ContainerNode>
                    <TextNode>z</TextNode>
                    </ContainerNode>
                `);

                let copiedNode2 = Markup.parse(`
                    <ListNode>
                      <ListItemNode>
                        <TextNode>a</TextNode>
                      </ListItemNode>
                    </ListNode>
                `);

                expect(copiedNode1.toMarkup()).toEqual(Clipboard.content[0].toMarkup());
                expect(copiedNode2.toMarkup()).toEqual(Clipboard.content[1].toMarkup());
            });
        });
    });
    describe("Should support cut", function () {
        describe("empty selection", function () {
            let rootNode;
            beforeEach(function () {
                rootNode = Markup.parse(`
                <ContainerNode>
                    <ContainerNode pathRef='1'>
                        <ContainerNode pathRef='1_1'>
                            <TextNode pathRef='1_1_1'>x</TextNode><TextNode pathRef='1_1_2'>y</TextNode><TextNode pathRef='1_1_3'>z</TextNode>
                        </ContainerNode>
                        <ListNode  pathRef='1_2'>
                            <ListItemNode pathRef='1_2_1'>
                                <TextNode pathRef='1_2_1_1'>a</TextNode>
                            </ListItemNode>
                        </ListNode>
                     </ContainerNode>
                </ContainerNode>
            `);
            });

            it("within a container", function () {
                let rootMarkup = rootNode.toMarkup();

                let startNode = _byRef(rootNode, "1.1_1.1_1_1");
                let startOffset = 1;

                let endNode = _byRef(rootNode, "1.1_1.1_1_2");
                let endOffset = 0;

                Clipboard.content = [];

                let visitRange = new VisitRange(startNode, startOffset, endNode, endOffset);
                let visitor = new CutCopyVisitor(visitRange);
                visitor.perform();

                expect(rootNode.toMarkup()).toEqual(rootMarkup);
                expect(Clipboard.content.length).toEqual(0);
            });

            it("across containers", function () {
                let rootMarkup = rootNode.toMarkup();

                let startNode = _byRef(rootNode, "1.1_1.1_1_3");
                let startOffset = 1;

                let endNode = _byRef(rootNode, "1.1_2.1_2_1.1_2_1_1");
                let endOffset = 0;

                Clipboard.content = [];

                let visitRange = new VisitRange(startNode, startOffset, endNode, endOffset);
                let visitor = new CutCopyVisitor(visitRange);
                visitor.perform();

                expect(rootNode.toMarkup()).toEqual(rootMarkup);
                expect(Clipboard.content.length).toEqual(0);
            });
        });

        describe("make selection", function () {
            let rootNode;
            beforeEach(function () {
                rootNode = Markup.parse(`
                <ContainerNode>
                    <ContainerNode pathRef='1'>
                        <ContainerNode pathRef='1_1'>
                            <TextNode pathRef='1_1_1'>xx</TextNode><TextNode pathRef='1_1_2'>yy</TextNode><TextNode pathRef='1_1_3'>zz</TextNode>
                        </ContainerNode>
                        <ListNode  pathRef='1_2'>
                            <ListItemNode pathRef='1_2_1'>
                                <TextNode pathRef='1_2_1_1'>aa</TextNode>
                            </ListItemNode>
                        </ListNode>
                     </ContainerNode>
                </ContainerNode>
            `);
            });

            it("within a container", function () {
                let startNode = _byRef(rootNode, "1.1_1.1_1_1");
                let startOffset = 1;

                let endNode = _byRef(rootNode, "1.1_1.1_1_3");
                let endOffset = 1;

                Clipboard.content = [];

                let visitRange = new VisitRange(startNode, startOffset, endNode, endOffset);
                let visitor = new CutCopyVisitor(visitRange);
                visitor.perform();

                let rootNodeAfterCopy = Markup.parse(`
                <ContainerNode>
                    <ContainerNode pathRef='1'>
                        <ContainerNode pathRef='1_1'>
                            <TextNode>x</TextNode><TextNode>z</TextNode>
                        </ContainerNode>
                        <ListNode  pathRef='1_2'>
                            <ListItemNode pathRef='1_2_1'>
                                <TextNode pathRef='1_2_1_1'>aa</TextNode>
                            </ListItemNode>
                        </ListNode>
                     </ContainerNode>
                </ContainerNode>
            `);
                expect(rootNode.toMarkup()).toEqual(rootNodeAfterCopy.toMarkup());
                expect(Clipboard.content.length).toEqual(1);

                let copiedNode = Markup.parse(`
                    <ContainerNode>
                      <TextNode>x</TextNode>
                      <TextNode>yy</TextNode>
                      <TextNode>z</TextNode>
                    </ContainerNode>
                `);

                expect(copiedNode.toMarkup()).toEqual(Clipboard.content[0].toMarkup());
            });

            it("across containers", function () {
                let startNode = _byRef(rootNode, "1.1_1.1_1_3");
                let startOffset = 1;

                let endNode = _byRef(rootNode, "1.1_2.1_2_1.1_2_1_1");
                let endOffset = 1;

                Clipboard.content = [];

                let visitRange = new VisitRange(startNode, startOffset, endNode, endOffset);
                let visitor = new CutCopyVisitor(visitRange);
                visitor.perform();

                let rootNodeAfterCopy = Markup.parse(`
                <ContainerNode>
                    <ContainerNode pathRef='1'>
                        <ContainerNode pathRef='1_1'>
                            <TextNode>xx</TextNode><TextNode>yy</TextNode><TextNode>z</TextNode>
                        </ContainerNode>
                        <ListNode>
                            <ListItemNode>
                                <TextNode>a</TextNode>
                            </ListItemNode>
                        </ListNode>
                     </ContainerNode>
                </ContainerNode>
            `);

                //console.log(Node.intendMarkup(rootNode.toMarkup()));
                expect(rootNode.toMarkup()).toEqual(rootNodeAfterCopy.toMarkup());
                expect(Clipboard.content.length).toEqual(2);

                //console.log(Node.intendMarkup(Clipboard.content[0].toMarkup()));
                //console.log(Node.intendMarkup(Clipboard.content[1].toMarkup()));

                let copiedNode1 = Markup.parse(`
                    <ContainerNode>
                    <TextNode>z</TextNode>
                    </ContainerNode>
                `);

                let copiedNode2 = Markup.parse(`
                    <ListNode>
                      <ListItemNode>
                        <TextNode>a</TextNode>
                      </ListItemNode>
                    </ListNode>
                `);

                expect(copiedNode1.toMarkup()).toEqual(Clipboard.content[0].toMarkup());
                expect(copiedNode2.toMarkup()).toEqual(Clipboard.content[1].toMarkup());
            });
        });
    });
});