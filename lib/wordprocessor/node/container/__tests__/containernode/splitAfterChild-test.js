jest.autoMockOff();

let Node = require("./../../../Node.js");
let ContainerNode = require("./../../ContainerNode.js");
let TextNode = require("./../../../content/TextNode.js");

let Markup = require("./../../../../Markup.js");
let _byRef = Markup.findNodeByTestRef;

let _ = require('lodash');

describe("Should support splitAfterChild", function() {
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

    it('splitAfterChild at head', function () {
        let newNode = containerNode.splitAfterChild(containerNode.head);
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
        expect(_.filter(changeCallback.mock.calls, (c) => {return c[0].type === ContainerNode.EVENTS.SPLIT_AFTER_CHILD}).length).toBe(1);
        expect(containerNode.toMarkup()).toEqual(expectedOldNode.toMarkup());
        expect(newNode.toMarkup()).toEqual(expectedNewNode.toMarkup());
    });

    it('splitAfterChild at tail', function () {
        let newNode = containerNode.splitAfterChild(containerNode.tail);
        let expectedOldNode = Markup.parse(`
                     <ContainerNode>
                        <TextNode>World1</TextNode>
                        <TextNode>World2</TextNode>
                        <TextNode>World3</TextNode>
                    </ContainerNode>
                `);

        let expectedNewNode = Markup.parse(`
                     <ContainerNode>
                    </ContainerNode>
                `);

        expect(_.filter(changeCallback.mock.calls, (c) => {return c[0].type === ContainerNode.EVENTS.SPLIT_AFTER_CHILD}).length).toBe(1);
        expect(containerNode.toMarkup()).toEqual(expectedOldNode.toMarkup());
        expect(newNode.toMarkup()).toEqual(expectedNewNode.toMarkup());
    });

    it('splitAfterChild at middle', function () {
        let newNode = containerNode.splitAfterChild(containerNode.head.next);
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
        expect(_.filter(changeCallback.mock.calls, (c) => {return c[0].type === ContainerNode.EVENTS.SPLIT_AFTER_CHILD}).length).toBe(1);
        expect(containerNode.toMarkup()).toEqual(expectedOldNode.toMarkup());
        expect(newNode.toMarkup()).toEqual(expectedNewNode.toMarkup());
    });

    it('splitAfterChild invalid node', function () {
        let newNode = containerNode.splitAtChild(containerNode.tail.next);
        expect(containerNode.childrenCount).toEqual(3);
        expect(changeCallback).not.toBeCalled();
        expect(newNode).toBeUndefined();
    });
});
