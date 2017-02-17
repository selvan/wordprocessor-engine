jest.autoMockOff();

let TextNode = require("./../../TextNode.js");
let ContainerNode = require("./../../../container/ContainerNode.js");
let Style = require("./../../../../Style.js");
let Markup = require("./../../../../Markup.js");
let _byRef = Markup.findNodeByTestRef;

describe("handleBackspace", function() {

    let rootNode = null;

    beforeEach(function() {
        rootNode = Markup.parse(`
                <ContainerNode>
                    <ContainerNode pathRef='1'>
                        <ContainerNode pathRef='1_1'>
                            <TextNode pathRef='1_1_1'>xx</TextNode><TextNode pathRef='1_1_2'>y</TextNode><TextNode pathRef='1_1_3'>z</TextNode>
                        </ContainerNode>
                        <ContainerNode pathRef='1_2'>
                            <TextNode pathRef='1_2_1'>a</TextNode>
                        </ContainerNode>
                     </ContainerNode>
                </ContainerNode>
            `);
    });

    it("when at start of text node, no sibling, no previous parent", function() {
        let txtNode = _byRef(rootNode, "1.1_1.1_1_1");
        let changeCallback = jest.genMockFunction();
        txtNode.addChangeListener(changeCallback);

        let {node, offset} = txtNode.handleBackspaceAt(0);

        expect(changeCallback).not.toBeCalled();
        expect(node.id).toEqual(txtNode.id);
        expect(offset).toEqual(0);

        let expectedNode = Markup.parse(`
                <ContainerNode>
                    <ContainerNode>
                        <ContainerNode>
                            <TextNode>xx</TextNode><TextNode>y</TextNode><TextNode>z</TextNode>
                        </ContainerNode>
                        <ContainerNode>
                            <TextNode>a</TextNode>
                        </ContainerNode>
                     </ContainerNode>
                </ContainerNode>
            `);

        expect(rootNode.toMarkup()).toEqual(expectedNode.toMarkup());
    });

    it("when at end of node", function() {
        let txtNode = _byRef(rootNode, "1.1_1.1_1_2");
        let txtNode2 = _byRef(rootNode, "1.1_1.1_1_3");
        let txtNode3 = _byRef(rootNode, "1.1_1.1_1_1");

        let changeCallback = jest.genMockFunction();
        txtNode.addChangeListener(changeCallback);
        let {node, offset} = txtNode.handleBackspaceAt(txtNode.size);

        expect(changeCallback).toBeCalled();
        expect(node.id).toEqual(txtNode3.id);
        expect(offset).toEqual(txtNode3.size);

        let expectedNode = Markup.parse(`
                <ContainerNode>
                    <ContainerNode>
                        <ContainerNode>
                            <TextNode>xx</TextNode><TextNode>z</TextNode>
                        </ContainerNode>
                        <ContainerNode>
                            <TextNode>a</TextNode>
                        </ContainerNode>
                     </ContainerNode>
                </ContainerNode>
            `);

        expect(rootNode.toMarkup()).toEqual(expectedNode.toMarkup());
    });

    it("when at start of text node, with previous sibling", function() {

        let txtNode = _byRef(rootNode, "1.1_1.1_1_1");
        let changeCallback = jest.genMockFunction();
        txtNode.addChangeListener(changeCallback);

        let txtNode2 = _byRef(rootNode, "1.1_1.1_1_2");
        let changeCallback2 = jest.genMockFunction();
        txtNode2.addChangeListener(changeCallback);

        let {node, offset} = txtNode2.handleBackspaceAt(0);
        expect(changeCallback).toBeCalled();

        expect(node.id).toEqual(txtNode.id);
        expect(offset).toEqual(txtNode.size);

        expect(changeCallback2).not.toBeCalled();

        let expectedNode = Markup.parse(`
                <ContainerNode>
                    <ContainerNode>
                        <ContainerNode>
                            <TextNode>x</TextNode><TextNode>y</TextNode><TextNode>z</TextNode>
                        </ContainerNode>
                        <ContainerNode>
                            <TextNode>a</TextNode>
                        </ContainerNode>
                     </ContainerNode>
                </ContainerNode>
            `);

        expect(rootNode.toMarkup()).toEqual(expectedNode.toMarkup());
    });

    it("when at start of text node, no sibling, previous parent", function() {
        let txtNode = _byRef(rootNode, "1.1_1.1_1_3");
        let txtNode2 = _byRef(rootNode, "1.1_2.1_2_1");

        expect(_byRef(rootNode, "1").childrenCount).toEqual(2);
        expect(_byRef(rootNode, "1.1_1").childrenCount).toEqual(3);

        let parent111 = _byRef(rootNode, "1.1_1");
        let changeCallback = jest.genMockFunction();
        parent111.addChangeListener(changeCallback);

        let {node, offset} = txtNode2.handleBackspaceAt(0);
        expect(node.id).toEqual(txtNode.id);
        expect(offset).toEqual(txtNode.size);

        let expectedNode = Markup.parse(`
                <ContainerNode>
                    <ContainerNode>
                        <ContainerNode>
                            <TextNode>xx</TextNode><TextNode>y</TextNode><TextNode>z</TextNode><TextNode>a</TextNode>
                        </ContainerNode>
                     </ContainerNode>
                </ContainerNode>
            `);

        expect(changeCallback).toBeCalled();
        expect(rootNode.toMarkup()).toEqual(expectedNode.toMarkup());
    });

    it("when at start of text node, previous parent, no children", function() {
        let containerNode = _byRef(rootNode, "1.1_1");
        containerNode.forEachChild(function(child) {
            containerNode.deleteChildById(child.id);
        });

        expect(_byRef(rootNode, "1").childrenCount).toEqual(1);
        let txtNode = _byRef(rootNode, "1.1_2.1_2_1");

        let parent112 = _byRef(rootNode, "1.1_2");
        let changeCallback = jest.genMockFunction();
        parent112.addChangeListener(changeCallback);

        let {node, offset} = txtNode.handleBackspaceAt(0);

        expect(node.id).toEqual(txtNode.id);
        expect(offset).toEqual(0);

        let expectedNode = Markup.parse(`
                <ContainerNode>
                    <ContainerNode>
                        <ContainerNode>
                            <TextNode>a</TextNode>
                        </ContainerNode>
                     </ContainerNode>
                </ContainerNode>
            `);

        expect(changeCallback).not.toBeCalled();
        expect(rootNode.toMarkup()).toEqual(expectedNode.toMarkup());
    });
});