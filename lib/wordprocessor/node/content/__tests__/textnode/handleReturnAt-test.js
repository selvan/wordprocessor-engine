jest.autoMockOff();

let TextNode = require("./../../TextNode.js");
let ContainerNode = require("./../../../container/ContainerNode.js");
let Style = require("./../../../../Style.js");
let Markup = require("./../../../../Markup.js");
let _byRef = Markup.findNodeByTestRef;

describe("handleReturnAt", function() {

    let rootNode = null;

    beforeEach(function() {
        rootNode = Markup.parse(`
                <ContainerNode>
                    <ContainerNode pathRef='1'>
                        <LineNode pathRef='1_1'>
                            <TextNode pathRef='1_1_1'>xx</TextNode><TextNode pathRef='1_1_2'>xyz</TextNode><TextNode pathRef='1_1_3'>z</TextNode>
                        </LineNode>
                        <LineNode pathRef='1_2'>
                            <TextNode pathRef='1_2_1'>a</TextNode>
                        </LineNode>
                     </ContainerNode>
                </ContainerNode>
            `);
    });

    it("when at start of text node", function() {
        expect(_byRef(rootNode, "1").childrenCount).toEqual(2);
        let txtNode = _byRef(rootNode, "1.1_1.1_1_1");

        let changeCallback = jest.genMockFunction();
        txtNode.parent.addChangeListener(changeCallback);

        let {node, offset} = txtNode.handleReturnAt(0);

        let expectedNode = Markup.parse(`
                <ContainerNode>
                    <ContainerNode>
                        <LineNode>
                            <TextNode></TextNode>
                        </LineNode>
                        <LineNode>
                            <TextNode>xx</TextNode><TextNode>xyz</TextNode><TextNode>z</TextNode>
                        </LineNode>
                        <LineNode>
                            <TextNode>a</TextNode>
                        </LineNode>
                     </ContainerNode>
                </ContainerNode>
            `);

        expect(changeCallback).toBeCalled();
        expect(rootNode.toMarkup()).toEqual(expectedNode.toMarkup());
    });

    it("when at end of text node, with sibling", function() {
        expect(_byRef(rootNode, "1").childrenCount).toEqual(2);
        let txtNode = _byRef(rootNode, "1.1_1.1_1_1");

        let parentNode111 = _byRef(rootNode, "1.1_1");
        let parentNode1 = _byRef(rootNode, "1");

        let changeCallback111 = jest.genMockFunction();
        parentNode111.addChangeListener(changeCallback111);

        let changeCallback1 = jest.genMockFunction();
        parentNode1.addChangeListener(changeCallback1);

        let {node, offset} = txtNode.handleReturnAt(txtNode.size);

        let expectedNode = Markup.parse(`
                <ContainerNode>
                    <ContainerNode>
                        <LineNode>
                            <TextNode>xx</TextNode>
                        </LineNode>
                        <LineNode>
                            <TextNode>xyz</TextNode><TextNode>z</TextNode>
                        </LineNode>
                        <LineNode>
                            <TextNode>a</TextNode>
                        </LineNode>
                     </ContainerNode>
                </ContainerNode>
            `);

        expect(changeCallback1).toBeCalled();
        expect(changeCallback111).toBeCalled();
        expect(rootNode.toMarkup()).toEqual(expectedNode.toMarkup());
    });

    it("when at end of text node, no sibling", function() {
        expect(_byRef(rootNode, "1").childrenCount).toEqual(2);
        let txtNode = _byRef(rootNode, "1.1_1.1_1_3");

        let parentNode1 = _byRef(rootNode, "1");
        let changeCallback = jest.genMockFunction();
        parentNode1.addChangeListener(changeCallback);

        let {node, offset} = txtNode.handleReturnAt(txtNode.size);

        let expectedNode = Markup.parse(`
                <ContainerNode>
                    <ContainerNode>
                        <LineNode>
                            <TextNode>xx</TextNode><TextNode>xyz</TextNode><TextNode>z</TextNode>
                        </LineNode>
                        <LineNode>
                            <TextNode></TextNode>
                        </LineNode>
                        <LineNode>
                            <TextNode>a</TextNode>
                        </LineNode>
                     </ContainerNode>
                </ContainerNode>
            `);

        expect(changeCallback).toBeCalled();
        expect(rootNode.toMarkup()).toEqual(expectedNode.toMarkup());
    });

    it("when at middle of text node", function() {
        expect(_byRef(rootNode, "1").childrenCount).toEqual(2);
        let txtNode = _byRef(rootNode, "1.1_1.1_1_2");

        let parentNode111 = _byRef(rootNode, "1.1_1");
        let parentNode1 = _byRef(rootNode, "1");

        let changeCallback111 = jest.genMockFunction();
        parentNode111.addChangeListener(changeCallback111);

        let changeCallback1 = jest.genMockFunction();
        parentNode1.addChangeListener(changeCallback1);

        let changeCallback = jest.genMockFunction();
        txtNode.addChangeListener(changeCallback);

        let {node, offset} = txtNode.handleReturnAt(1);

        let expectedNode = Markup.parse(`
                <ContainerNode>
                    <ContainerNode>
                        <LineNode>
                            <TextNode>xx</TextNode><TextNode>x</TextNode>
                        </LineNode>
                        <LineNode>
                            <TextNode>yz</TextNode><TextNode>z</TextNode>
                        </LineNode>
                        <LineNode>
                            <TextNode>a</TextNode>
                        </LineNode>
                     </ContainerNode>
                </ContainerNode>
            `);

        expect(changeCallback).toBeCalled();
        expect(changeCallback1).toBeCalled();
        expect(changeCallback111).toBeCalled();
        expect(rootNode.toMarkup()).toEqual(expectedNode.toMarkup());
    });

})