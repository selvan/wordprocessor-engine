jest.autoMockOff();

let Markup = require("./../Markup.js");
let Node = require("./../node/Node");
let LineNode = require("./../node/container/LineNode");
let PageNode = require("./../node/container/PageNode");

let TextNode = require("./../node/content/TextNode");
let _byRef = Markup.findNodeByTestRef;

describe('Undo', function() {
    let rootNode;
    beforeEach(function() {
        rootNode = Markup.parse(`
            <DocumentNode>
                <PageNode pathRef='0'>
                    <LineNode pathRef='1'>
                        <TextNode pathRef='1_1'>abc</TextNode><TextNode pathRef='1_2'>abcd</TextNode>
                    </LineNode>
                </PageNode>
            </DocumentNode>
        `);

        let firstLine = _byRef(rootNode, "0.1");
        let txtNode = _byRef(rootNode, "0.1.1_2");

        rootNode.undoSnapshot();
        txtNode.handleReturnAt(0);

        let nextLine = firstLine.next;
        let txtNode2 = nextLine.head;

        rootNode.undoSnapshot();
        txtNode2.handleReturnAt(2);

        let expectedNode = Markup.parse(`
            <DocumentNode>
              <PageNode>
                <LineNode>
                  <TextNode>abc</TextNode>
                </LineNode>
                <LineNode>
                  <TextNode>ab</TextNode>
                </LineNode>
                <LineNode>
                  <TextNode>cd</TextNode>
                </LineNode>
              </PageNode>
            </DocumentNode>
        `);

        //console.log(Node.intendMarkup(rootNode.toMarkup()));
        expect(rootNode.toMarkup()).toEqual(expectedNode.toMarkup());
    });

    it("Should support undo", function() {

        rootNode.undo;
        let expectedNode = Markup.parse(`
            <DocumentNode>
              <PageNode>
                <LineNode>
                  <TextNode>abc</TextNode>
                </LineNode>
                <LineNode>
                  <TextNode>abcd</TextNode>
                </LineNode>
              </PageNode>
            </DocumentNode>
        `);
        //console.log(Node.intendMarkup(rootNode.toMarkup()));
        expect(rootNode.toMarkup()).toEqual(expectedNode.toMarkup());

        rootNode.undo;
        expectedNode = Markup.parse(`
            <DocumentNode>
              <PageNode>
                <LineNode>
                  <TextNode>abc</TextNode>
                  <TextNode>abcd</TextNode>
                </LineNode>
              </PageNode>
            </DocumentNode>
        `);
        //console.log(Node.intendMarkup(rootNode.toMarkup()));
        expect(rootNode.toMarkup()).toEqual(expectedNode.toMarkup());

        rootNode.undo;
        rootNode.undo;
        rootNode.undo;
        expect(rootNode.toMarkup()).toEqual(expectedNode.toMarkup());
    });

    it("Should support redo", function() {
        rootNode.undo;
        rootNode.undo;

        rootNode.redo;
        let expectedNode = Markup.parse(`
            <DocumentNode>
              <PageNode>
                <LineNode>
                  <TextNode>abc</TextNode>
                </LineNode>
                <LineNode>
                  <TextNode>abcd</TextNode>
                </LineNode>
              </PageNode>
            </DocumentNode>
        `);
        //console.log(Node.intendMarkup(rootNode.toMarkup()));
        expect(rootNode.toMarkup()).toEqual(expectedNode.toMarkup());

        rootNode.redo;
        expectedNode = Markup.parse(`
            <DocumentNode>
              <PageNode>
                <LineNode>
                  <TextNode>abc</TextNode>
                </LineNode>
                <LineNode>
                  <TextNode>ab</TextNode>
                </LineNode>
                <LineNode>
                  <TextNode>cd</TextNode>
                </LineNode>
              </PageNode>
            </DocumentNode>
        `);
        //console.log(Node.intendMarkup(rootNode.toMarkup()));
        expect(rootNode.toMarkup()).toEqual(expectedNode.toMarkup());

        rootNode.redo;
        rootNode.redo;
        rootNode.redo;
        expect(rootNode.toMarkup()).toEqual(expectedNode.toMarkup());
    });
});