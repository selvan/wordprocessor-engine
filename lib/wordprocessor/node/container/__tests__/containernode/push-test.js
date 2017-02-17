jest.autoMockOff();

let Node = require("./../../../Node.js");
let ContainerNode = require("./../../ContainerNode.js");
let TextNode = require("./../../../content/TextNode.js");

let Markup = require("./../../../../Markup.js");
let _byRef = Markup.findNodeByTestRef;

describe("Should support push", function() {
    let containerNode;
    let changeCallback;

    beforeEach(function() {
        containerNode = Markup.parse(`
                <ContainerNode>
                </ContainerNode>
            `);
        changeCallback = jest.genMockFunction();
        containerNode.addChangeListener(changeCallback);
    });

    it('When it is empty', function() {
        expect(containerNode.childrenCount).toEqual(0);
        let txtNode = new TextNode("World");
        containerNode.push(txtNode);
        let expectedNode = Markup.parse(`
                    <ContainerNode>
                        <TextNode>World</TextNode>
                    </ContainerNode>
                `);

        expect(changeCallback).toBeCalled();
        expect(containerNode.toMarkup()).toEqual(expectedNode.toMarkup());
    });

    it('When nodes already exist', function() {
        let txtNode = new TextNode("World");
        containerNode.push(txtNode);

        let txtNode2 = new TextNode("World2");
        containerNode.push(txtNode2);

        let expectedNode = Markup.parse(`
                    <ContainerNode>
                        <TextNode>World</TextNode>
                        <TextNode>World2</TextNode>
                    </ContainerNode>
                `);
        expect(changeCallback).toBeCalled();
        expect(containerNode.toMarkup()).toEqual(expectedNode.toMarkup());
    });

    it('should allow re-adding a child node', function() {
        expect(containerNode.childrenCount).toEqual(0);

        let txtNode = new TextNode("World");
        containerNode.push(txtNode);

        /* push node that already exist */
        expect(() => { containerNode.push(txtNode) }).toThrow();
    });

});
