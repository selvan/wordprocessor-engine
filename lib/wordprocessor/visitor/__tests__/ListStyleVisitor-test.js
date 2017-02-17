jest.autoMockOff();

let ListStyleVisitor = require("./../ListStyleVisitor.js");

let Node = require("./../../node/Node.js");

let LineNode = require("./../../node/container/LineNode.js");
let ListNode = require("./../../node/container/ListNode.js");
let ListItemNode = require("./../../node/container/ListItemNode.js");

let PictureNode = require("./../../node/content/PictureNode.js");

let TextNode = require("./../../node/content/TextNode.js");

let VisitRange = require("./../VisitRange.js");

let Markup = require("./../../Markup.js");
let _byRef = Markup.findNodeByTestRef;

describe('ListStyleVisitor', function () {

    it("Simple Line to List Item", function () {
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
        let endOffset = endNode.length;

        let visitRange = new VisitRange(startNode, startOffset, endNode, endOffset);

        let visitor = new ListStyleVisitor(visitRange);
        visitor.perform();

        let expectedNode = Markup.parse(`
            <ContainerNode>
              <ListNode>
                <ListItemNode>
                  <TextNode>xx</TextNode>
                </ListItemNode>
              </ListNode>
            </ContainerNode>
        `);

        //console.log(Node.intendMarkup(rootNode.toMarkup(true)));
        expect(rootNode.toMarkup()).toEqual(expectedNode.toMarkup());
    });

    it("Simple List item to Line", function () {
        let rootNode = Markup.parse(`
                <ContainerNode>
                  <ListNode pathRef='1'>
                    <ListItemNode pathRef='1_1'>
                      <TextNode pathRef='1_1_1'>xx</TextNode>
                    </ListItemNode>
                  </ListNode>
                </ContainerNode>
        `);

        let startNode = _byRef(rootNode, "1.1_1.1_1_1");
        let startOffset = 0;

        let endNode = _byRef(rootNode, "1.1_1.1_1_1");
        let endOffset = endNode.length;

        let visitRange = new VisitRange(startNode, startOffset, endNode, endOffset);

        let visitor = new ListStyleVisitor(visitRange);
        visitor.perform();

        let expectedNode = Markup.parse(`
            <ContainerNode>
                <LineNode>
                    <TextNode>xx</TextNode>
                </LineNode>
            </ContainerNode>
        `);

        //console.log(Node.intendMarkup(rootNode.toMarkup(true)));
        expect(rootNode.toMarkup()).toEqual(expectedNode.toMarkup());
    });



    it("Multiple ListItems to Lines - selection starts at top", function () {
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

        let startNode = _byRef(rootNode, "1.1_1.1_1_1");
        let startOffset = 0;

        let endNode = _byRef(rootNode, "1.1_2.1_2_1");
        let endOffset = endNode.length;

        let visitRange = new VisitRange(startNode, startOffset, endNode, endOffset);

        let visitor = new ListStyleVisitor(visitRange);
        visitor.perform();

        let expectedNode = Markup.parse(`
            <ContainerNode>
              <LineNode>
                <TextNode>xx</TextNode>
              </LineNode>
              <LineNode>
                <TextNode>yy</TextNode>
              </LineNode>
              <ListNode>
                <ListItemNode>
                  <TextNode>zz</TextNode>
                </ListItemNode>
              </ListNode>
            </ContainerNode>
        `);

        //console.log(Node.intendMarkup(rootNode.toMarkup()));
        expect(rootNode.toMarkup()).toEqual(expectedNode.toMarkup());
    });

    it("Multiple ListItems to Lines - selection starts and ends at middle", function () {
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

        let startNode = _byRef(rootNode, "1.1_2.1_2_1");
        let startOffset = 0;

        let endNode = _byRef(rootNode, "1.1_2.1_2_1");
        let endOffset = endNode.length;

        let visitRange = new VisitRange(startNode, startOffset, endNode, endOffset);

        let visitor = new ListStyleVisitor(visitRange);
        visitor.perform();

        let expectedNode = Markup.parse(`
            <ContainerNode>
              <ListNode>
                <ListItemNode>
                  <TextNode>xx</TextNode>
                </ListItemNode>
              </ListNode>
              <LineNode>
                <TextNode>yy</TextNode>
              </LineNode>
              <ListNode>
                <ListItemNode>
                  <TextNode>zz</TextNode>
                </ListItemNode>
              </ListNode>
            </ContainerNode>
        `);

        //console.log(Node.intendMarkup(rootNode.toMarkup()));
        expect(rootNode.toMarkup()).toEqual(expectedNode.toMarkup());

    });

    it("Multiple ListItems to Lines - selection ends at bottom", function () {
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

        let startNode = _byRef(rootNode, "1.1_2.1_2_1");
        let startOffset = 0;

        let endNode = _byRef(rootNode, "1.1_3.1_3_1");
        let endOffset = endNode.length;

        let visitRange = new VisitRange(startNode, startOffset, endNode, endOffset);

        let visitor = new ListStyleVisitor(visitRange);
        visitor.perform();

        let expectedNode = Markup.parse(`
            <ContainerNode>
              <ListNode>
                <ListItemNode>
                  <TextNode>xx</TextNode>
                </ListItemNode>
              </ListNode>
              <LineNode>
                <TextNode>yy</TextNode>
              </LineNode>
              <LineNode>
                <TextNode>zz</TextNode>
              </LineNode>
            </ContainerNode>
        `);

        //console.log(Node.intendMarkup(rootNode.toMarkup()));
        expect(rootNode.toMarkup()).toEqual(expectedNode.toMarkup());

    });

    it("Selection span across multiple list and a Line in between", function () {
        let rootNode = Markup.parse(`
                <ContainerNode>
                        <ListNode pathRef='1'>
                            <ListItemNode pathRef='1_1'>
                                <TextNode pathRef='1_1_1'>aa</TextNode>
                            </ListItemNode>
                            <ListItemNode pathRef='1_2'>
                                <TextNode pathRef='1_2_1'>bb</TextNode>
                            </ListItemNode>
                            <ListItemNode pathRef='1_3'>
                                <TextNode pathRef='1_3_1'>cc</TextNode>
                            </ListItemNode>
                        </ListNode>
                        <LineNode pathRef='2'>
                            <TextNode pathRef='2_1'>dd</TextNode>
                        </LineNode>
                        <ListNode pathRef='3'>
                            <ListItemNode pathRef='3_1'>
                                <TextNode pathRef='3_1_1'>ee</TextNode>
                            </ListItemNode>
                            <ListItemNode pathRef='3_2'>
                                <TextNode pathRef='3_2_1'>ff</TextNode>
                            </ListItemNode>
                            <ListItemNode pathRef='3_3'>
                                <TextNode pathRef='3_3_1'>gg</TextNode>
                            </ListItemNode>
                        </ListNode>
                </ContainerNode>
            `);

        let startNode = _byRef(rootNode, "1.1_3.1_3_1");
        let startOffset = 1;

        let endNode = _byRef(rootNode, "3.3_1.3_1_1");
        let endOffset = endNode.length-1;

        let visitRange = new VisitRange(startNode, startOffset, endNode, endOffset);

        let visitor = new ListStyleVisitor(visitRange);
        visitor.perform();

        let expectedNode = Markup.parse(`
            <ContainerNode>
              <ListNode>
                <ListItemNode>
                  <TextNode>aa</TextNode>
                </ListItemNode>
                <ListItemNode>
                  <TextNode>bb</TextNode>
                </ListItemNode>
              </ListNode>
              <LineNode>
                <TextNode>cc</TextNode>
              </LineNode>
              <ListNode>
                <ListItemNode>
                  <TextNode>dd</TextNode>
                </ListItemNode>
              </ListNode>
              <LineNode>
                <TextNode>ee</TextNode>
              </LineNode>
              <ListNode>
                <ListItemNode>
                  <TextNode>ff</TextNode>
                </ListItemNode>
                <ListItemNode>
                  <TextNode>gg</TextNode>
                </ListItemNode>
              </ListNode>
            </ContainerNode>
        `);

        //console.log(Node.intendMarkup(rootNode.toMarkup()));
        expect(rootNode.toMarkup()).toEqual(expectedNode.toMarkup());

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

        let visitor = new ListStyleVisitor(visitRange);
        visitor.perform();

        let expectedNode = Markup.parse(`
            <ContainerNode>
              <ListNode>
                <ListItemNode>
                  <TextNode>aa</TextNode>
                </ListItemNode>
              </ListNode>
              <LineNode>
                <TextNode>bb</TextNode>
              </LineNode>
              <LineNode>
                <TextNode>cc</TextNode>
              </LineNode>
              <LineNode>
                <TextNode>dd</TextNode>
              </LineNode>
              <ListNode>
                <ListItemNode>
                  <TextNode>ee</TextNode>
                </ListItemNode>
              </ListNode>
              <LineNode>
                <TextNode>ff</TextNode>
              </LineNode>
              <ListNode>
                <ListItemNode>
                  <TextNode>gg</TextNode>
                </ListItemNode>
                <ListItemNode>
                  <TextNode>hh</TextNode>
                </ListItemNode>
              </ListNode>
              <LineNode>
                <TextNode>ii</TextNode>
              </LineNode>
            </ContainerNode>
        `);

        //console.log(Node.intendMarkup(rootNode.toMarkup()));
        expect(rootNode.toMarkup()).toEqual(expectedNode.toMarkup());
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

        let visitor = new ListStyleVisitor(visitRange);
        visitor.perform();

        let expectedNode = Markup.parse(`
            <ContainerNode>
              <ListNode>
                <ListItemNode>
                  <TextNode>aa</TextNode>
                </ListItemNode>
              </ListNode>
              <PictureNode>
              </PictureNode>
              <LineNode>
                <TextNode>bb</TextNode>
              </LineNode>
            </ContainerNode>
        `);

        //console.log(Node.intendMarkup(rootNode.toMarkup()));
        expect(rootNode.toMarkup()).toEqual(expectedNode.toMarkup());
    });
});