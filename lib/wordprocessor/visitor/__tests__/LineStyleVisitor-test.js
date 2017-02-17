jest.autoMockOff();

let LineStyleVisitor = require("./../LineStyleVisitor.js");

let Node = require("./../../node/Node.js");

let LineNode = require("./../../node/container/LineNode.js");
let ListNode = require("./../../node/container/ListNode.js");
let ListItemNode = require("./../../node/container/ListItemNode.js");

let PictureNode = require("./../../node/content/PictureNode.js");

let TextNode = require("./../../node/content/TextNode.js");

let VisitRange = require("./../VisitRange.js");
let Style = require("./../../Style.js");

let Markup = require("./../../Markup.js");
let _byRef = Markup.findNodeByTestRef;

describe('LineStyleVisitor', function () {

    it("No selection", function () {
        let rootNode = Markup.parse(`
                <ContainerNode>
                        <LineNode pathRef='1'>
                            <TextNode pathRef='1_1'>xx</TextNode>
                        </LineNode>
                </ContainerNode>
            `);

        let startNode = _byRef(rootNode, "1.1_1");
        let startOffset = 0;

        let endNode = _byRef(rootNode, "1.1_1");
        let endOffset = 0;

        let visitRange = new VisitRange(startNode, startOffset, endNode, endOffset);

        let visitor = new LineStyleVisitor(visitRange, Style.TEXT_ALIGN_LEFT);
        visitor.perform();

        //console.log(Node.intendMarkup(rootNode.toMarkup(true, true)));
        expect(_byRef(rootNode, "1").hasStyle(Style.TEXT_ALIGN_LEFT)).toBeTruthy();

    });

    it("has text selection within a node", function () {
        let rootNode = Markup.parse(`
                <ContainerNode>
                        <LineNode pathRef='1'>
                            <TextNode pathRef='1_1'>xx</TextNode>
                        </LineNode>
                </ContainerNode>
            `);

        let startNode = _byRef(rootNode, "1.1_1");
        let startOffset = 0;

        let endNode = _byRef(rootNode, "1.1_1");
        let endOffset = endNode.size;

        let visitRange = new VisitRange(startNode, startOffset, endNode, endOffset);

        let visitor = new LineStyleVisitor(visitRange, Style.TEXT_ALIGN_LEFT);
        visitor.perform();

        //console.log(Node.intendMarkup(rootNode.toMarkup(true, true)));
        expect(_byRef(rootNode, "1").hasStyle(Style.TEXT_ALIGN_LEFT)).toBeTruthy();

    });

    it("should remove style if present", function () {
        let rootNode = Markup.parse(`
                <ContainerNode>
                        <LineNode pathRef='1' style="Style.TEXT_ALIGN_LEFT">
                            <TextNode pathRef='1_1'>xx</TextNode>
                        </LineNode>
                </ContainerNode>
            `);

        let startNode = _byRef(rootNode, "1.1_1");
        let startOffset = 0;

        let endNode = _byRef(rootNode, "1.1_1");
        let endOffset = endNode.size;

        let visitRange = new VisitRange(startNode, startOffset, endNode, endOffset);

        let visitor = new LineStyleVisitor(visitRange, Style.TEXT_ALIGN_LEFT);
        visitor.perform();

        //console.log(Node.intendMarkup(rootNode.toMarkup(true, true)));
        expect(_byRef(rootNode, "1").hasStyle(Style.TEXT_ALIGN_LEFT)).toBeFalsy();

    });

    it("should apply style if not present across selection", function () {
        let rootNode = Markup.parse(`
                <ContainerNode>
                        <LineNode pathRef='1' style="Style.TEXT_ALIGN_LEFT">
                            <TextNode pathRef='1_1'>xx</TextNode>
                        </LineNode>
                        <LineNode pathRef='2' style="Style.TEXT_ALIGN_RIGHT">
                            <TextNode pathRef='2_1'>xx</TextNode>
                        </LineNode>
                </ContainerNode>
            `);

        let startNode = _byRef(rootNode, "1.1_1");
        let startOffset = 0;

        let endNode = _byRef(rootNode, "2.2_1");
        let endOffset = endNode.size;

        let visitRange = new VisitRange(startNode, startOffset, endNode, endOffset);

        let visitor = new LineStyleVisitor(visitRange, Style.TEXT_ALIGN_LEFT);
        visitor.perform();

        //console.log(Node.intendMarkup(rootNode.toMarkup(true, true)));
        //console.log(Node.intendMarkup(_byRef(rootNode, "2").toMarkup(true, true)));
        expect(_byRef(rootNode, "1").hasStyle(Style.TEXT_ALIGN_LEFT)).toBeTruthy();
        expect(_byRef(rootNode, "2").hasStyle(Style.TEXT_ALIGN_RIGHT)).toBeFalsy();
        expect(_byRef(rootNode, "2").hasStyle(Style.TEXT_ALIGN_LEFT)).toBeTruthy();
    });

    it("should remove style if present across selection", function () {
        let rootNode = Markup.parse(`
                <ContainerNode>
                        <LineNode pathRef='1' style="Style.TEXT_ALIGN_RIGHT">
                            <TextNode pathRef='1_1'>xx</TextNode>
                        </LineNode>
                        <LineNode pathRef='2' style="Style.TEXT_ALIGN_RIGHT">
                            <TextNode pathRef='2_1'>xx</TextNode>
                        </LineNode>
                </ContainerNode>
            `);

        let startNode = _byRef(rootNode, "1.1_1");
        let startOffset = 0;

        let endNode = _byRef(rootNode, "2.2_1");
        let endOffset = endNode.size;

        let visitRange = new VisitRange(startNode, startOffset, endNode, endOffset);

        let visitor = new LineStyleVisitor(visitRange, Style.TEXT_ALIGN_RIGHT);
        visitor.perform();

        //console.log(Node.intendMarkup(rootNode.toMarkup(true, true)));
        expect(_byRef(rootNode, "1").hasStyle(Style.TEXT_ALIGN_RIGHT)).toBeFalsy();
        expect(_byRef(rootNode, "2").hasStyle(Style.TEXT_ALIGN_RIGHT)).toBeFalsy();
    });

    it("Selection span across multiple lines and a picture node in between", function () {
        let rootNode = Markup.parse(`
                <ContainerNode>
                        <LineNode pathRef='1'>
                            <TextNode pathRef='1_1'>aa</TextNode>
                        </LineNode>
                        <PictureNode pathRef='2'></PictureNode>
                        <LineNode pathRef='3'>
                            <TextNode pathRef='3_1'>bb</TextNode>
                        </LineNode>
                </ContainerNode>
            `);

        let startNode = _byRef(rootNode, "1.1_1");
        let startOffset = 1;

        let endNode = _byRef(rootNode, "3.3_1");
        let endOffset = endNode.length;

        let visitRange = new VisitRange(startNode, startOffset, endNode, endOffset);

        let visitor = new LineStyleVisitor(visitRange, Style.TEXT_ALIGN_RIGHT);
        visitor.perform();

        expect(_byRef(rootNode, "1").hasStyle(Style.TEXT_ALIGN_RIGHT)).toBeTruthy();
        expect(_byRef(rootNode, "2").hasStyle(Style.TEXT_ALIGN_RIGHT)).toBeFalsy();
        expect(_byRef(rootNode, "3").hasStyle(Style.TEXT_ALIGN_RIGHT)).toBeFalsy();
    });

    it("Selection span across multiple lines and a List in between", function () {
        let rootNode = Markup.parse(`
                <ContainerNode>
                        <LineNode pathRef='1'>
                            <TextNode pathRef='1_1'>aa</TextNode>
                        </LineNode>
                        <ListNode pathRef='2'>
                            <ListItemNode pathRef='2_1'>
                                <TextNode pathRef='2_1_1'>bb</TextNode>
                            </ListItemNode>
                            <ListItemNode pathRef='2_2'>
                                <TextNode pathRef='2_2_1'>cc</TextNode>
                            </ListItemNode>
                            <ListItemNode pathRef='2_3'>
                                <TextNode pathRef='2_3_1'>dd</TextNode>
                            </ListItemNode>
                        </ListNode>
                        <LineNode pathRef='3'>
                            <TextNode pathRef='3_1'>ee</TextNode>
                        </LineNode>
                        <ListNode pathRef='4'>
                            <ListItemNode pathRef='4_1'>
                                <TextNode pathRef='4_1_1'>ff</TextNode>
                            </ListItemNode>
                            <ListItemNode pathRef='4_2'>
                                <TextNode pathRef='4_2_1'>gg</TextNode>
                            </ListItemNode>
                            <ListItemNode pathRef='4_3'>
                                <TextNode pathRef='4_3_1'>hh</TextNode>
                            </ListItemNode>
                        </ListNode>
                        <LineNode pathRef='5'>
                            <TextNode pathRef='5_1'>ii</TextNode>
                        </LineNode>
                </ContainerNode>
            `);

        let startNode = _byRef(rootNode, "1.1_1");
        let startOffset = 1;

        let endNode = _byRef(rootNode, "4.4_1.4_1_1");
        let endOffset = endNode.length;

        let visitRange = new VisitRange(startNode, startOffset, endNode, endOffset);

        let visitor = new LineStyleVisitor(visitRange, Style.TEXT_ALIGN_RIGHT);
        visitor.perform();

        //console.log(Node.intendMarkup(rootNode.toMarkup(true, true)));

        expect(_byRef(rootNode, "1").hasStyle(Style.TEXT_ALIGN_RIGHT)).toBeTruthy();
        expect(_byRef(rootNode, "2").hasStyle(Style.TEXT_ALIGN_RIGHT)).toBeFalsy();
        expect(_byRef(rootNode, "2.2_1").hasStyle(Style.TEXT_ALIGN_RIGHT)).toBeTruthy();
        expect(_byRef(rootNode, "2.2_2").hasStyle(Style.TEXT_ALIGN_RIGHT)).toBeTruthy();
        expect(_byRef(rootNode, "2.2_3").hasStyle(Style.TEXT_ALIGN_RIGHT)).toBeTruthy();
        expect(_byRef(rootNode, "3").hasStyle(Style.TEXT_ALIGN_RIGHT)).toBeTruthy();
        expect(_byRef(rootNode, "4").hasStyle(Style.TEXT_ALIGN_RIGHT)).toBeFalsy();
        expect(_byRef(rootNode, "4.4_1").hasStyle(Style.TEXT_ALIGN_RIGHT)).toBeTruthy();
        expect(_byRef(rootNode, "4.4_2").hasStyle(Style.TEXT_ALIGN_RIGHT)).toBeFalsy();
    });

});