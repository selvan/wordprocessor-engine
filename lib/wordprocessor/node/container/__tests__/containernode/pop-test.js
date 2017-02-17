jest.autoMockOff();

let Node = require("./../../../Node.js");
let ContainerNode = require("./../../ContainerNode.js");
let TextNode = require("./../../../content/TextNode.js");

let Markup = require("./../../../../Markup.js");
let _byRef = Markup.findNodeByTestRef;

let _ = require('lodash');

describe("Should support pop", function() {
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
    });

    it('should allow poping tail node', function() {

        let expectedNode = Markup.parse(`
                     <ContainerNode>
                        <TextNode>World1</TextNode>
                        <TextNode>World2</TextNode>
                    </ContainerNode>
                `);

        let tailMarkup = containerNode.tail.toMarkup();
        let popedNode = containerNode.pop();

        expect(changeCallback).toBeCalled();
        expect(_.filter(changeCallback.mock.calls, (c) => {return c[0].type === ContainerNode.EVENTS.POP}).length).toBe(1);
        expect(containerNode.toMarkup()).toEqual(expectedNode.toMarkup());
        expect(popedNode.toMarkup()).toEqual(tailMarkup);

        changeCallback.mockClear();

        expectedNode = Markup.parse(`
                     <ContainerNode>
                        <TextNode>World1</TextNode>
                    </ContainerNode>
                `);

        tailMarkup = containerNode.tail.toMarkup();
        popedNode = containerNode.pop();

        expect(changeCallback).toBeCalled();
        expect(containerNode.toMarkup()).toEqual(expectedNode.toMarkup());
        expect(popedNode.toMarkup()).toEqual(tailMarkup);
        expect(_.filter(changeCallback.mock.calls, (c) => {return c[0].type === ContainerNode.EVENTS.POP}).length).toBe(1);
    });
});
