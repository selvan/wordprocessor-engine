jest.autoMockOff();

let TextNode = require("./../../TextNode.js");
let ContainerNode = require("./../../../container/ContainerNode.js");
let Style = require("./../../../../Style.js");
let Markup = require("./../../../../Markup.js");
let _byRef = Markup.findNodeByTestRef;

describe("handleDeleteAt", function() {

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

    it("when at end of text node, no sibling, no next parent", function() {
        let txtNode = _byRef(rootNode, "1.1_2.1_2_1");
        let changeCallback = jest.genMockFunction();
        txtNode.addChangeListener(changeCallback);

        let {node, offset} = txtNode.handleDeleteAt(txtNode.size);

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

        expect(changeCallback).not.toBeCalled();
        //console.log(Node.intendMarkup(rootNode.toMarkup(true)));
        expect(offset).toEqual(txtNode.size);
        expect(node.id).toEqual(txtNode.id);
        expect(rootNode.toMarkup()).toEqual(expectedNode.toMarkup());
    });

    it("when at start of node", function() {
        let txtNode = _byRef(rootNode, "1.1_1.1_1_1");
        let changeCallback = jest.genMockFunction();
        txtNode.addChangeListener(changeCallback);

        let {node, offset} = txtNode.handleDeleteAt(0);

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

        expect(changeCallback).toBeCalled();
        //console.log(Node.intendMarkup(rootNode.toMarkup(true)));
        expect(rootNode.toMarkup()).toEqual(expectedNode.toMarkup());
        expect(node.id).toEqual(txtNode.id);
        expect(offset).toEqual(0);
    });

    it("when at end of text node, with next sibling", function() {
        let txtNode = _byRef(rootNode, "1.1_1.1_1_1");
        let txtNode2 = _byRef(rootNode, "1.1_1.1_1_2");
        let txtNode3 = _byRef(rootNode, "1.1_1.1_1_3");

        let parent = _byRef(rootNode, "1.1_1");
        let changeCallback = jest.genMockFunction();
        parent.addChangeListener(changeCallback);

        expect(parent.childrenCount).toEqual(3);
        let {node, offset} = txtNode.handleDeleteAt(txtNode.size);

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

        expect(changeCallback).toBeCalled();
        expect(node.id).toEqual(txtNode3.id);
        expect(offset).toEqual(0);
        expect(rootNode.toMarkup()).toEqual(expectedNode.toMarkup());
    });

    it("when at end of text node, no sibling, next parent", function() {
        let txtNode = _byRef(rootNode, "1.1_1.1_1_3");
        let txtNode2 = _byRef(rootNode, "1.1_2.1_2_1");

        let r1 = _byRef(rootNode, "1");
        let changeCallbackR1 = jest.genMockFunction();
        r1.addChangeListener(changeCallbackR1);

        let r111 = _byRef(rootNode, "1.1_1");
        let changeCallbackR111 = jest.genMockFunction();
        r111.addChangeListener(changeCallbackR111);

        expect(_byRef(rootNode, "1").childrenCount).toEqual(2);
        expect(_byRef(rootNode, "1.1_1").childrenCount).toEqual(3);

        let {node, offset} = txtNode.handleDeleteAt(txtNode.size);
        expect(node.id).toEqual(txtNode2.id);
        expect(offset).toEqual(0);

        let expectedNode = Markup.parse(`
                <ContainerNode>
                    <ContainerNode>
                        <ContainerNode>
                            <TextNode>xx</TextNode><TextNode>y</TextNode><TextNode>z</TextNode><TextNode>a</TextNode>
                        </ContainerNode>
                     </ContainerNode>
                </ContainerNode>
            `);

        expect(changeCallbackR1).toBeCalled();
        expect(changeCallbackR111).toBeCalled();

        //console.log(Node.intendMarkup(rootNode.toMarkup(true)));
        expect(rootNode.toMarkup()).toEqual(expectedNode.toMarkup());
    });

    it("when at end of text node, next parent, no children", function() {
        let containerNode = _byRef(rootNode, "1.1_2");
        containerNode.forEachChild(function(child) {
            containerNode.deleteChildById(child.id);
        });

        expect(_byRef(rootNode, "1").childrenCount).toEqual(1);

        let txtNode = _byRef(rootNode, "1.1_1.1_1_3");
        let changeCallback = jest.genMockFunction();
        txtNode.addChangeListener(changeCallback);

        let {node, offset} = txtNode.handleDeleteAt(txtNode.size);

        expect(node.id).toEqual(txtNode.id);
        expect(offset).toEqual(txtNode.size);

        let expectedNode = Markup.parse(`
                <ContainerNode>
                    <ContainerNode>
                        <ContainerNode>
                            <TextNode>xx</TextNode><TextNode>y</TextNode><TextNode>z</TextNode>
                        </ContainerNode>
                     </ContainerNode>
                </ContainerNode>
            `);

        expect(changeCallback).not.toBeCalled();
        //console.log(Node.intendMarkup(rootNode.toMarkup(true)));
        expect(rootNode.toMarkup()).toEqual(expectedNode.toMarkup());
    });

});