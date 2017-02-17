jest.autoMockOff();

let Node = require("./../../../Node.js");
let ContainerNode = require("./../../ContainerNode.js");
let TextNode = require("./../../../content/TextNode.js");

let Markup = require("./../../../../Markup.js");
let _byRef = Markup.findNodeByTestRef;

let _ = require('lodash');

describe("Should support splitAtChild", function() {
    let containerNode;
    let changeCallback;

    beforeEach(function () {
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

    it('splitAtChild at head', function () {
        let newNode = containerNode.splitAtChild(containerNode.head);
        let expectedOldNode = Markup.parse(`
                     <ContainerNode>
                    </ContainerNode>
                `);

        let expectedNewNode = Markup.parse(`
                     <ContainerNode>
                        <TextNode>World1</TextNode>
                        <TextNode>World2</TextNode>
                        <TextNode>World3</TextNode>
                    </ContainerNode>
                `);

        expect(changeCallback).toBeCalled();
        expect(_.filter(changeCallback.mock.calls, (c) => {return c[0].type === ContainerNode.EVENTS.SPLIT_AT_CHILD}).length).toBe(1);
        expect(containerNode.toMarkup()).toEqual(expectedOldNode.toMarkup());
        expect(newNode.toMarkup()).toEqual(expectedNewNode.toMarkup());
    });

    it('splitAtChild at tail', function () {
        let newNode = containerNode.splitAtChild(containerNode.tail);
        let expectedOldNode = Markup.parse(`
                     <ContainerNode>
                        <TextNode>World1</TextNode>
                        <TextNode>World2</TextNode>
                    </ContainerNode>
                `);

        let expectedNewNode = Markup.parse(`
                     <ContainerNode>
                        <TextNode>World3</TextNode>
                    </ContainerNode>
                `);

        expect(changeCallback).toBeCalled();
        expect(_.filter(changeCallback.mock.calls, (c) => {return c[0].type === ContainerNode.EVENTS.SPLIT_AT_CHILD}).length).toBe(1);
        expect(containerNode.toMarkup()).toEqual(expectedOldNode.toMarkup());
        expect(newNode.toMarkup()).toEqual(expectedNewNode.toMarkup());
    });

    it('splitAtChild at middle', function () {
        let newNode = containerNode.splitAtChild(containerNode.head.next);
        let expectedOldNode = Markup.parse(`
                     <ContainerNode>
                        <TextNode>World1</TextNode>
                    </ContainerNode>
                `);

        let expectedNewNode = Markup.parse(`
                     <ContainerNode>
                        <TextNode>World2</TextNode>
                        <TextNode>World3</TextNode>
                    </ContainerNode>
                `);

        expect(changeCallback).toBeCalled();
        expect(_.filter(changeCallback.mock.calls, (c) => {return c[0].type === ContainerNode.EVENTS.SPLIT_AT_CHILD}).length).toBe(1);
        expect(containerNode.toMarkup()).toEqual(expectedOldNode.toMarkup());
        expect(newNode.toMarkup()).toEqual(expectedNewNode.toMarkup());
    });

    it('splitAtChild invalid node', function () {
        let newNode = containerNode.splitAtChild(containerNode.tail.next);
        expect(changeCallback).not.toBeCalled();
        expect(containerNode.childrenCount).toEqual(3);
        expect(newNode).toBeUndefined();
    });
});
