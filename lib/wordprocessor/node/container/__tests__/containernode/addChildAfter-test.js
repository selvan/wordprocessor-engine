jest.autoMockOff();

let Node = require("./../../../Node.js");
let ContainerNode = require("./../../ContainerNode.js");
let TextNode = require("./../../../content/TextNode.js");

let Markup = require("./../../../../Markup.js");
let _byRef = Markup.findNodeByTestRef;

describe("Should support addChildAfter", function() {
    let containerNode;
    let changeCallback;

    beforeEach(function() {
        containerNode = Markup.parse(`
                    <ContainerNode>
                        <TextNode>World1</TextNode>
                        <TextNode>World2</TextNode>
                        <TextNode>World3</TextNode>
                    </ContainerNode>
                `);
        changeCallback = jest.genMockFunction();
        containerNode.addChangeListener(changeCallback);

        expect(containerNode.childrenCount).toEqual(3);
    });

    it('after head', function() {
        let newTxtNode = new TextNode("WorldNew");
        containerNode.addChildAfter(containerNode.head, newTxtNode);
        let expectedNode = Markup.parse(`
                     <ContainerNode>
                        <TextNode>World1</TextNode>
                        <TextNode>WorldNew</TextNode>
                        <TextNode>World2</TextNode>
                        <TextNode>World3</TextNode>
                    </ContainerNode>
                `);
        expect(changeCallback).toBeCalled();
        expect(containerNode.toMarkup()).toEqual(expectedNode.toMarkup());
    });

    it('after tail', function() {
        let newTxtNode = new TextNode("WorldNew");
        containerNode.addChildAfter(containerNode.tail, newTxtNode);
        let expectedNode = Markup.parse(`
                     <ContainerNode>
                        <TextNode>World1</TextNode>
                        <TextNode>World2</TextNode>
                        <TextNode>World3</TextNode>
                        <TextNode>WorldNew</TextNode>
                    </ContainerNode>
                `);
        expect(changeCallback).toBeCalled();
        expect(containerNode.toMarkup()).toEqual(expectedNode.toMarkup());
    });

    it('after mid', function() {
        let newTxtNode = new TextNode("WorldNew");
        containerNode.addChildAfter(containerNode.head.next, newTxtNode);
        let expectedNode = Markup.parse(`
                     <ContainerNode>
                        <TextNode>World1</TextNode>
                        <TextNode>World2</TextNode>
                        <TextNode>WorldNew</TextNode>
                        <TextNode>World3</TextNode>
                    </ContainerNode>
                `);
        expect(changeCallback).toBeCalled();
        expect(containerNode.toMarkup()).toEqual(expectedNode.toMarkup());
    });
});
