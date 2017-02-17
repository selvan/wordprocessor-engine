jest.autoMockOff();

let TextStyleVisitor = require("./../TextStyleVisitor.js");

let ContainerNode = require("./../../node/container/ContainerNode.js");
let TextNode = require("./../../node/content/TextNode.js");
let Style = require("./../../Style.js");

let VisitRange = require("./../VisitRange.js");

let Markup = require("./../../Markup.js");
let _byRef = Markup.findNodeByTestRef;

describe('TextStyleVisitor', function () {


    describe("Within a text node", function () {
        describe("Empty selection", function () {
            it("Should handle empty when start and end offset at the beginning", function () {
                let rootNode = Markup.parse(`
                <ContainerNode>
                    <ContainerNode pathRef='1'>
                        <ContainerNode pathRef='1_1'>
                            <TextNode pathRef='1_1_1'>xx</TextNode>
                        </ContainerNode>
                     </ContainerNode>
                </ContainerNode>
            `);

                let startNode = _byRef(rootNode, "1.1_1.1_1_1");
                let startOffset = 0;

                let endNode = _byRef(rootNode, "1.1_1.1_1_1");
                let endOffset = 0;

                let visitRange = new VisitRange(startNode, startOffset, endNode, endOffset);

                let visitor = new TextStyleVisitor(visitRange, Style.BOLD);
                visitor.perform();

                expect(_byRef(rootNode, "1.1_1.1_1_1").hasStyle(Style.BOLD)).toBeFalsy();
            });

            it("Should handle empty when start and end offset at the end", function () {
                let rootNode = Markup.parse(`
                <ContainerNode>
                    <ContainerNode pathRef='1'>
                        <ContainerNode pathRef='1_1'>
                            <TextNode pathRef='1_1_1'>xx</TextNode>
                        </ContainerNode>
                     </ContainerNode>
                </ContainerNode>
            `);

                let startNode = _byRef(rootNode, "1.1_1.1_1_1");
                let startOffset = startNode.size;

                let endNode = _byRef(rootNode, "1.1_1.1_1_1");
                let endOffset = endNode.size;

                let visitRange = new VisitRange(startNode, startOffset, endNode, endOffset);

                let visitor = new TextStyleVisitor(visitRange, Style.BOLD);
                visitor.perform();

                expect(_byRef(rootNode, "1.1_1.1_1_1").hasStyle(Style.BOLD)).toBeFalsy();
            });

            it("Should handle empty when start and end offset at the middle", function () {
                let rootNode = Markup.parse(`
                <ContainerNode>
                    <ContainerNode pathRef='1'>
                        <ContainerNode pathRef='1_1'>
                            <TextNode pathRef='1_1_1'>xx</TextNode>
                        </ContainerNode>
                     </ContainerNode>
                </ContainerNode>
            `);

                let startNode = _byRef(rootNode, "1.1_1.1_1_1");
                let startOffset = 1;

                let endNode = _byRef(rootNode, "1.1_1.1_1_1");
                let endOffset = 1;

                let visitRange = new VisitRange(startNode, startOffset, endNode, endOffset);

                let visitor = new TextStyleVisitor(visitRange, Style.BOLD);
                visitor.perform();

                expect(_byRef(rootNode, "1.1_1.1_1_1").hasStyle(Style.BOLD)).toBeFalsy();
            });
        });
        describe("Selection within a node", function () {
            it("Should handle range from start", function () {
                let rootNode = Markup.parse(`
                <ContainerNode>
                    <ContainerNode pathRef='1'>
                        <ContainerNode pathRef='1_1'>
                            <TextNode pathRef='1_1_1'>123456789</TextNode>
                        </ContainerNode>
                     </ContainerNode>
                </ContainerNode>
            `);

                let startNode = _byRef(rootNode, "1.1_1.1_1_1");
                let startOffset = 0;

                let endNode = _byRef(rootNode, "1.1_1.1_1_1");
                let endOffset = 5;

                let visitRange = new VisitRange(startNode, startOffset, endNode, endOffset);

                let visitor = new TextStyleVisitor(visitRange, Style.BOLD);
                visitor.perform();

                expect(_byRef(rootNode, "1.1_1").childrenCount).toEqual(2);
                expect(_byRef(rootNode, "1.1_1").head.hasStyle(Style.BOLD)).toBeTruthy();
                expect(_byRef(rootNode, "1.1_1").head.text).toEqual('12345');
                expect(_byRef(rootNode, "1.1_1").tail.hasStyle(Style.BOLD)).toBeFalsy();
                expect(_byRef(rootNode, "1.1_1").tail.text).toEqual('6789');
            });

            it("Should handle range at end", function () {
                let rootNode = Markup.parse(`
                <ContainerNode>
                    <ContainerNode pathRef='1'>
                        <ContainerNode pathRef='1_1'>
                            <TextNode pathRef='1_1_1'>123456789</TextNode>
                        </ContainerNode>
                     </ContainerNode>
                </ContainerNode>
            `);

                let startNode = _byRef(rootNode, "1.1_1.1_1_1");
                let startOffset = 5;

                let endNode = _byRef(rootNode, "1.1_1.1_1_1");
                let endOffset = endNode.size;

                let visitRange = new VisitRange(startNode, startOffset, endNode, endOffset);

                let visitor = new TextStyleVisitor(visitRange, Style.BOLD);
                visitor.perform();

                expect(_byRef(rootNode, "1.1_1").childrenCount).toEqual(2);
                expect(_byRef(rootNode, "1.1_1").head.hasStyle(Style.BOLD)).toBeFalsy();
                expect(_byRef(rootNode, "1.1_1").head.text).toEqual('12345');
                expect(_byRef(rootNode, "1.1_1").tail.hasStyle(Style.BOLD)).toBeTruthy();
                expect(_byRef(rootNode, "1.1_1").tail.text).toEqual('6789');
            });

            it("Should handle mid range", function () {
                let rootNode = Markup.parse(`
                <ContainerNode>
                    <ContainerNode pathRef='1'>
                        <ContainerNode pathRef='1_1'>
                            <TextNode pathRef='1_1_1'>123456789</TextNode>
                        </ContainerNode>
                     </ContainerNode>
                </ContainerNode>
            `);

                let startNode = _byRef(rootNode, "1.1_1.1_1_1");
                let startOffset = 2;

                let endNode = _byRef(rootNode, "1.1_1.1_1_1");
                let endOffset = 5;

                let visitRange = new VisitRange(startNode, startOffset, endNode, endOffset);

                let visitor = new TextStyleVisitor(visitRange, Style.BOLD);
                visitor.perform();

                expect(_byRef(rootNode, "1.1_1").childrenCount).toEqual(3);
                expect(_byRef(rootNode, "1.1_1").head.hasStyle(Style.BOLD)).toBeFalsy();
                expect(_byRef(rootNode, "1.1_1").head.text).toEqual('12');
                expect(_byRef(rootNode, "1.1_1").head.next.hasStyle(Style.BOLD)).toBeTruthy();
                expect(_byRef(rootNode, "1.1_1").head.next.text).toEqual('345');
                expect(_byRef(rootNode, "1.1_1").tail.hasStyle(Style.BOLD)).toBeFalsy();
                expect(_byRef(rootNode, "1.1_1").tail.text).toEqual('6789');
            });


        });
    });


    describe("Across text nodes", function () {
        describe("Empty selection", function () {
            it("Should handle empty selection across two nodes", function () {
                let rootNode = Markup.parse(`
                <ContainerNode>
                    <ContainerNode pathRef='1'>
                        <ContainerNode pathRef='1_1'>
                            <TextNode pathRef='1_1_1'>xx</TextNode><TextNode pathRef='1_1_2'>yy</TextNode>
                        </ContainerNode>
                     </ContainerNode>
                </ContainerNode>
            `);

                let startNode = _byRef(rootNode, "1.1_1.1_1_1");
                let startOffset = startNode.size;

                let endNode = _byRef(rootNode, "1.1_1.1_1_2");
                let endOffset = 0;

                let visitRange = new VisitRange(startNode, startOffset, endNode, endOffset);

                let visitor = new TextStyleVisitor(visitRange, Style.BOLD);
                visitor.perform();

                expect(_byRef(rootNode, "1.1_1").childrenCount).toEqual(2);
                expect(_byRef(rootNode, "1.1_1").head.hasStyle(Style.BOLD)).toBeFalsy();
                expect(_byRef(rootNode, "1.1_1").head.text).toEqual('xx');

                expect(_byRef(rootNode, "1.1_1").tail.hasStyle(Style.BOLD)).toBeFalsy();
                expect(_byRef(rootNode, "1.1_1").tail.text).toEqual('yy');
            });
        });


        describe("Text Style - when no node style exist among selection", function () {
            it("selection begin at start of a text node, end at end of a text node", function () {
                let rootNode = Markup.parse(`
                <ContainerNode>
                    <ContainerNode pathRef='1'>
                        <ContainerNode pathRef='1_1'>
                            <TextNode pathRef='1_1_1'>x</TextNode><TextNode pathRef='1_1_2'>y</TextNode><TextNode pathRef='1_1_3'>z</TextNode>
                        </ContainerNode>
                        <ContainerNode  pathRef='1_2'>
                            <TextNode pathRef='1_2_1'>a</TextNode>
                        </ContainerNode>
                     </ContainerNode>
                </ContainerNode>
            `);


                let startNode = _byRef(rootNode, "1.1_1.1_1_1");
                let startOffset = 0;

                let endNode = _byRef(rootNode, "1.1_2.1_2_1");
                let endOffset = endNode.size;

                let visitRange = new VisitRange(startNode, startOffset, endNode, endOffset);

                let visitor = new TextStyleVisitor(visitRange, Style.BOLD);
                visitor.perform();


                expect(_byRef(rootNode, "1").childrenCount).toEqual(2);
                expect(_byRef(rootNode, "1.1_1").childrenCount).toEqual(3);
                expect(_byRef(rootNode, "1.1_2").childrenCount).toEqual(1);

                expect(_byRef(rootNode, "1.1_1").head.hasStyle(Style.BOLD)).toBeTruthy();
                expect(_byRef(rootNode, "1.1_1").head.text).toEqual('x');

                expect(_byRef(rootNode, "1.1_1").head.next.hasStyle(Style.BOLD)).toBeTruthy();
                expect(_byRef(rootNode, "1.1_1").head.next.text).toEqual('y');

                expect(_byRef(rootNode, "1.1_1").tail.hasStyle(Style.BOLD)).toBeTruthy();
                expect(_byRef(rootNode, "1.1_1").tail.text).toEqual('z');

                expect(_byRef(rootNode, "1.1_2").tail.hasStyle(Style.BOLD)).toBeTruthy();
                expect(_byRef(rootNode, "1.1_2").tail.text).toEqual('a');
            });

            it("selection begin at end of a text node, end at start of a text node", function () {
                let rootNode = Markup.parse(`
                <ContainerNode>
                    <ContainerNode pathRef='1'>
                        <ContainerNode pathRef='1_1'>
                            <TextNode pathRef='1_1_1'>x</TextNode><TextNode pathRef='1_1_2'>y</TextNode><TextNode pathRef='1_1_3'>z</TextNode>
                        </ContainerNode>
                        <ContainerNode  pathRef='1_2'>
                            <TextNode pathRef='1_2_1'>a</TextNode>
                        </ContainerNode>
                     </ContainerNode>
                </ContainerNode>
            `);


                let startNode = _byRef(rootNode, "1.1_1.1_1_1");
                let startOffset = startNode.size;

                let endNode = _byRef(rootNode, "1.1_2.1_2_1");
                let endOffset = 0;

                let visitRange = new VisitRange(startNode, startOffset, endNode, endOffset);

                let visitor = new TextStyleVisitor(visitRange, Style.BOLD);
                visitor.perform();

                expect(_byRef(rootNode, "1").childrenCount).toEqual(2);
                expect(_byRef(rootNode, "1.1_1").childrenCount).toEqual(3);
                expect(_byRef(rootNode, "1.1_2").childrenCount).toEqual(1);

                expect(_byRef(rootNode, "1.1_1").head.hasStyle(Style.BOLD)).toBeFalsy();
                expect(_byRef(rootNode, "1.1_1").head.text).toEqual('x');

                expect(_byRef(rootNode, "1.1_1").head.next.hasStyle(Style.BOLD)).toBeTruthy();
                expect(_byRef(rootNode, "1.1_1").head.next.text).toEqual('y');

                expect(_byRef(rootNode, "1.1_1").tail.hasStyle(Style.BOLD)).toBeTruthy();
                expect(_byRef(rootNode, "1.1_1").tail.text).toEqual('z');

                expect(_byRef(rootNode, "1.1_2").tail.hasStyle(Style.BOLD)).toBeFalsy();
                expect(_byRef(rootNode, "1.1_2").tail.text).toEqual('a');
            });

            it("selection begin at mid of a text node, end at mid of a text node", function () {
                let rootNode = Markup.parse(`
                <ContainerNode>
                    <ContainerNode pathRef='1'>
                        <ContainerNode pathRef='1_1'>
                            <TextNode pathRef='1_1_1'>xx</TextNode><TextNode pathRef='1_1_2'>y</TextNode><TextNode pathRef='1_1_3'>z</TextNode>
                        </ContainerNode>
                        <ContainerNode  pathRef='1_2'>
                            <TextNode pathRef='1_2_1'>ab</TextNode>
                        </ContainerNode>
                     </ContainerNode>
                </ContainerNode>
            `);


                let startNode = _byRef(rootNode, "1.1_1.1_1_1");
                let startOffset = 1;

                let endNode = _byRef(rootNode, "1.1_2.1_2_1");
                let endOffset = 1;

                let visitRange = new VisitRange(startNode, startOffset, endNode, endOffset);


                let visitor = new TextStyleVisitor(visitRange, Style.BOLD);
                visitor.perform();

                expect(_byRef(rootNode, "1").childrenCount).toEqual(2);
                expect(_byRef(rootNode, "1.1_1").childrenCount).toEqual(4);
                expect(_byRef(rootNode, "1.1_2").childrenCount).toEqual(2);

                expect(_byRef(rootNode, "1.1_1").head.hasStyle(Style.BOLD)).toBeFalsy();
                expect(_byRef(rootNode, "1.1_1").head.text).toEqual('x');

                expect(_byRef(rootNode, "1.1_1").head.next.hasStyle(Style.BOLD)).toBeTruthy();
                expect(_byRef(rootNode, "1.1_1").head.next.text).toEqual('x');

                expect(_byRef(rootNode, "1.1_1").tail.prev.hasStyle(Style.BOLD)).toBeTruthy();
                expect(_byRef(rootNode, "1.1_1").tail.prev.text).toEqual('y');

                expect(_byRef(rootNode, "1.1_1").tail.hasStyle(Style.BOLD)).toBeTruthy();
                expect(_byRef(rootNode, "1.1_1").tail.text).toEqual('z');

                expect(_byRef(rootNode, "1.1_2").tail.hasStyle(Style.BOLD)).toBeFalsy();
                expect(_byRef(rootNode, "1.1_2").tail.text).toEqual('b');

                expect(_byRef(rootNode, "1.1_2").tail.prev.hasStyle(Style.BOLD)).toBeTruthy();
                expect(_byRef(rootNode, "1.1_2").tail.prev.text).toEqual('a');
            });
        });

        describe("Text Style - when node style exist in all nodes in selection", function () {
            it("selection begin at start of a text node, end at end of a text node", function () {
                let rootNode = Markup.parse(`
                <ContainerNode>
                    <ContainerNode pathRef='1'>
                        <ContainerNode pathRef='1_1'>
                            <TextNode pathRef='1_1_1' style="Style.BOLD">x</TextNode><TextNode pathRef='1_1_2' style="Style.BOLD">y</TextNode><TextNode pathRef='1_1_3' style="Style.BOLD">z</TextNode>
                        </ContainerNode>
                        <ContainerNode  pathRef='1_2'>
                            <TextNode pathRef='1_2_1' style="Style.BOLD">a</TextNode>
                        </ContainerNode>
                     </ContainerNode>
                </ContainerNode>
            `);


                let startNode = _byRef(rootNode, "1.1_1.1_1_1");
                let startOffset = 0;

                let endNode = _byRef(rootNode, "1.1_2.1_2_1");
                let endOffset = endNode.size;

                let visitRange = new VisitRange(startNode, startOffset, endNode, endOffset);

                let visitor = new TextStyleVisitor(visitRange, Style.BOLD);
                visitor.perform();

                expect(_byRef(rootNode, "1").childrenCount).toEqual(2);
                expect(_byRef(rootNode, "1.1_1").childrenCount).toEqual(3);
                expect(_byRef(rootNode, "1.1_2").childrenCount).toEqual(1);

                expect(_byRef(rootNode, "1.1_1").head.hasStyle(Style.BOLD)).toBeFalsy();
                expect(_byRef(rootNode, "1.1_1").head.text).toEqual('x');

                expect(_byRef(rootNode, "1.1_1").tail.prev.hasStyle(Style.BOLD)).toBeFalsy();
                expect(_byRef(rootNode, "1.1_1").tail.prev.text).toEqual('y');

                expect(_byRef(rootNode, "1.1_1").tail.hasStyle(Style.BOLD)).toBeFalsy();
                expect(_byRef(rootNode, "1.1_1").tail.text).toEqual('z');

                expect(_byRef(rootNode, "1.1_2").tail.hasStyle(Style.BOLD)).toBeFalsy();
                expect(_byRef(rootNode, "1.1_2").tail.text).toEqual('a');
            });

            it("selection begin at end of a text node, end at start of a text node", function () {
                let rootNode = Markup.parse(`
                <ContainerNode>
                    <ContainerNode pathRef='1'>
                        <ContainerNode pathRef='1_1'>
                            <TextNode pathRef='1_1_1' style="Style.BOLD">x</TextNode><TextNode pathRef='1_1_2' style="Style.BOLD">y</TextNode><TextNode pathRef='1_1_3' style="Style.BOLD">z</TextNode>
                        </ContainerNode>
                        <ContainerNode  pathRef='1_2'>
                            <TextNode pathRef='1_2_1' style="Style.BOLD">a</TextNode>
                        </ContainerNode>
                     </ContainerNode>
                </ContainerNode>
            `);


                let startNode = _byRef(rootNode, "1.1_1.1_1_1");
                let startOffset = startNode.size;

                let endNode = _byRef(rootNode, "1.1_2.1_2_1");
                let endOffset = 0;

                let visitRange = new VisitRange(startNode, startOffset, endNode, endOffset);

                let visitor = new TextStyleVisitor(visitRange, Style.BOLD);
                visitor.perform();

                expect(_byRef(rootNode, "1").childrenCount).toEqual(2);
                expect(_byRef(rootNode, "1.1_1").childrenCount).toEqual(3);
                expect(_byRef(rootNode, "1.1_2").childrenCount).toEqual(1);

                expect(_byRef(rootNode, "1.1_1").head.hasStyle(Style.BOLD)).toBeTruthy();
                expect(_byRef(rootNode, "1.1_1").head.text).toEqual('x');

                expect(_byRef(rootNode, "1.1_1").tail.prev.hasStyle(Style.BOLD)).toBeFalsy();
                expect(_byRef(rootNode, "1.1_1").tail.prev.text).toEqual('y');

                expect(_byRef(rootNode, "1.1_1").tail.hasStyle(Style.BOLD)).toBeFalsy();
                expect(_byRef(rootNode, "1.1_1").tail.text).toEqual('z');

                expect(_byRef(rootNode, "1.1_2").tail.hasStyle(Style.BOLD)).toBeTruthy();
                expect(_byRef(rootNode, "1.1_2").tail.text).toEqual('a');
            });

            it("selection begin at mid of a text node, end at mid of a text node", function () {
                let rootNode = Markup.parse(`
                <ContainerNode>
                    <ContainerNode pathRef='1'>
                        <ContainerNode pathRef='1_1'>
                            <TextNode pathRef='1_1_1' style="Style.BOLD">xx</TextNode><TextNode pathRef='1_1_2' style="Style.BOLD">y</TextNode><TextNode pathRef='1_1_3' style="Style.BOLD">z</TextNode>
                        </ContainerNode>
                        <ContainerNode  pathRef='1_2'>
                            <TextNode pathRef='1_2_1' style="Style.BOLD">ab</TextNode>
                        </ContainerNode>
                     </ContainerNode>
                </ContainerNode>
            `);


                let startNode = _byRef(rootNode, "1.1_1.1_1_1");
                let startOffset = 1;

                let endNode = _byRef(rootNode, "1.1_2.1_2_1");
                let endOffset = 1;

                let visitRange = new VisitRange(startNode, startOffset, endNode, endOffset);

                let visitor = new TextStyleVisitor(visitRange, Style.BOLD);
                visitor.perform();

                expect(_byRef(rootNode, "1").childrenCount).toEqual(2);
                expect(_byRef(rootNode, "1.1_1").childrenCount).toEqual(4);
                expect(_byRef(rootNode, "1.1_2").childrenCount).toEqual(2);

                expect(_byRef(rootNode, "1.1_1").head.hasStyle(Style.BOLD)).toBeTruthy();
                expect(_byRef(rootNode, "1.1_1").head.text).toEqual('x');

                expect(_byRef(rootNode, "1.1_1").head.next.hasStyle(Style.BOLD)).toBeFalsy();
                expect(_byRef(rootNode, "1.1_1").head.next.text).toEqual('x');

                expect(_byRef(rootNode, "1.1_1").tail.prev.hasStyle(Style.BOLD)).toBeFalsy();
                expect(_byRef(rootNode, "1.1_1").tail.prev.text).toEqual('y');

                expect(_byRef(rootNode, "1.1_1").tail.hasStyle(Style.BOLD)).toBeFalsy();
                expect(_byRef(rootNode, "1.1_1").tail.text).toEqual('z');

                expect(_byRef(rootNode, "1.1_2").tail.hasStyle(Style.BOLD)).toBeTruthy();
                expect(_byRef(rootNode, "1.1_2").tail.text).toEqual('b');

                expect(_byRef(rootNode, "1.1_2").tail.prev.hasStyle(Style.BOLD)).toBeFalsy();
                expect(_byRef(rootNode, "1.1_2").tail.prev.text).toEqual('a');
            });
        });

        describe("Text Style - when node style exist among some nodes in selection", function () {
            it("selection begin at start of a text node, end at end of a text node", function () {
                let rootNode = Markup.parse(`
                <ContainerNode>
                    <ContainerNode pathRef='1'>
                        <ContainerNode pathRef='1_1'>
                            <TextNode pathRef='1_1_1'>x</TextNode><TextNode pathRef='1_1_2' style="Style.BOLD">y</TextNode><TextNode pathRef='1_1_3' style="Style.BOLD">z</TextNode>
                        </ContainerNode>
                        <ContainerNode  pathRef='1_2'>
                            <TextNode pathRef='1_2_1' style="Style.BOLD">a</TextNode>
                        </ContainerNode>
                     </ContainerNode>
                </ContainerNode>
            `);


                let startNode = _byRef(rootNode, "1.1_1.1_1_1");
                let startOffset = 0;

                let endNode = _byRef(rootNode, "1.1_2.1_2_1");
                let endOffset = endNode.size;

                let visitRange = new VisitRange(startNode, startOffset, endNode, endOffset);

                let visitor = new TextStyleVisitor(visitRange, Style.BOLD);
                visitor.perform();

                expect(_byRef(rootNode, "1").childrenCount).toEqual(2);
                expect(_byRef(rootNode, "1.1_1").childrenCount).toEqual(3);
                expect(_byRef(rootNode, "1.1_2").childrenCount).toEqual(1);

                expect(_byRef(rootNode, "1.1_1").head.hasStyle(Style.BOLD)).toBeTruthy();
                expect(_byRef(rootNode, "1.1_1").head.text).toEqual('x');

                expect(_byRef(rootNode, "1.1_1").tail.prev.hasStyle(Style.BOLD)).toBeTruthy();
                expect(_byRef(rootNode, "1.1_1").tail.prev.text).toEqual('y');

                expect(_byRef(rootNode, "1.1_1").tail.hasStyle(Style.BOLD)).toBeTruthy();
                expect(_byRef(rootNode, "1.1_1").tail.text).toEqual('z');

                expect(_byRef(rootNode, "1.1_2").tail.hasStyle(Style.BOLD)).toBeTruthy();
                expect(_byRef(rootNode, "1.1_2").tail.text).toEqual('a');
            });

            it("selection begin at end of a text node, end at start of a text node", function () {
                let rootNode = Markup.parse(`
                <ContainerNode>
                    <ContainerNode pathRef='1'>
                        <ContainerNode pathRef='1_1'>
                            <TextNode pathRef='1_1_1' style="Style.BOLD">x</TextNode><TextNode pathRef='1_1_2'>y</TextNode><TextNode pathRef='1_1_3' style="Style.BOLD">z</TextNode>
                        </ContainerNode>
                        <ContainerNode  pathRef='1_2'>
                            <TextNode pathRef='1_2_1'>a</TextNode>
                        </ContainerNode>
                     </ContainerNode>
                </ContainerNode>
            `);

                let startNode = _byRef(rootNode, "1.1_1.1_1_1");
                let startOffset = startNode.size;

                let endNode = _byRef(rootNode, "1.1_2.1_2_1");
                let endOffset = 0;

                let visitRange = new VisitRange(startNode, startOffset, endNode, endOffset);

                let visitor = new TextStyleVisitor(visitRange, Style.BOLD);
                visitor.perform();

                expect(_byRef(rootNode, "1").childrenCount).toEqual(2);
                expect(_byRef(rootNode, "1.1_1").childrenCount).toEqual(3);
                expect(_byRef(rootNode, "1.1_2").childrenCount).toEqual(1);

                expect(_byRef(rootNode, "1.1_1").head.hasStyle(Style.BOLD)).toBeTruthy();
                expect(_byRef(rootNode, "1.1_1").head.text).toEqual('x');

                expect(_byRef(rootNode, "1.1_1").tail.prev.hasStyle(Style.BOLD)).toBeTruthy();
                expect(_byRef(rootNode, "1.1_1").tail.prev.text).toEqual('y');

                expect(_byRef(rootNode, "1.1_1").tail.hasStyle(Style.BOLD)).toBeTruthy();
                expect(_byRef(rootNode, "1.1_1").tail.text).toEqual('z');

                expect(_byRef(rootNode, "1.1_2").tail.hasStyle(Style.BOLD)).toBeFalsy();
                expect(_byRef(rootNode, "1.1_2").tail.text).toEqual('a');
            });

            it("selection begin at mid of a text node, end at mid of a text node", function () {
                let rootNode = Markup.parse(`
                <ContainerNode>
                    <ContainerNode pathRef='1'>
                        <ContainerNode pathRef='1_1'>
                            <TextNode pathRef='1_1_1' style="Style.BOLD">xx</TextNode><TextNode pathRef='1_1_2'>y</TextNode><TextNode pathRef='1_1_3' style="Style.BOLD">z</TextNode>
                        </ContainerNode>
                        <ContainerNode  pathRef='1_2'>
                            <TextNode pathRef='1_2_1'>ab</TextNode>
                        </ContainerNode>
                     </ContainerNode>
                </ContainerNode>
            `);


                let startNode = _byRef(rootNode, "1.1_1.1_1_1");
                let startOffset = 1;

                let endNode = _byRef(rootNode, "1.1_2.1_2_1");
                let endOffset = 1;

                let visitRange = new VisitRange(startNode, startOffset, endNode, endOffset);

                let visitor = new TextStyleVisitor(visitRange, Style.BOLD);
                visitor.perform();

                expect(_byRef(rootNode, "1").childrenCount).toEqual(2);
                expect(_byRef(rootNode, "1.1_1").childrenCount).toEqual(4);
                expect(_byRef(rootNode, "1.1_2").childrenCount).toEqual(2);

                expect(_byRef(rootNode, "1.1_1").head.hasStyle(Style.BOLD)).toBeTruthy();
                expect(_byRef(rootNode, "1.1_1").head.text).toEqual('x');

                expect(_byRef(rootNode, "1.1_1").head.next.hasStyle(Style.BOLD)).toBeTruthy();
                expect(_byRef(rootNode, "1.1_1").head.next.text).toEqual('x');

                expect(_byRef(rootNode, "1.1_1").tail.prev.hasStyle(Style.BOLD)).toBeTruthy();
                expect(_byRef(rootNode, "1.1_1").tail.prev.text).toEqual('y');

                expect(_byRef(rootNode, "1.1_1").tail.hasStyle(Style.BOLD)).toBeTruthy();
                expect(_byRef(rootNode, "1.1_1").tail.text).toEqual('z');

                expect(_byRef(rootNode, "1.1_2").tail.hasStyle(Style.BOLD)).toBeFalsy();
                expect(_byRef(rootNode, "1.1_2").tail.text).toEqual('b');

                expect(_byRef(rootNode, "1.1_2").tail.prev.hasStyle(Style.BOLD)).toBeTruthy();
                expect(_byRef(rootNode, "1.1_2").tail.prev.text).toEqual('a');
            });
        });
    });
});