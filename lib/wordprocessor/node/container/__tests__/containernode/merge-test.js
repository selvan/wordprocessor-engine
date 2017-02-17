jest.autoMockOff();

let Node = require("./../../../Node.js");
let ContainerNode = require("./../../ContainerNode.js");
let TextNode = require("./../../../content/TextNode.js");

let Markup = require("./../../../../Markup.js");
let _byRef = Markup.findNodeByTestRef;

let _ = require('lodash');

describe("Should support merge", function() {

    it('merge two nodes without a root parent', function() {
        let containerNode1 = Markup.parse(`
                    <ContainerNode>
                        <TextNode>World1</TextNode>
                    </ContainerNode>
                `);

        let changeCallback1 = jest.genMockFunction();
        containerNode1.addChangeListener(changeCallback1);

        let containerNode2 = Markup.parse(`
                    <ContainerNode>
                        <TextNode>World2</TextNode>
                        <TextNode>World3</TextNode>
                    </ContainerNode>
                `);

        let changeCallback2 = jest.genMockFunction();
        containerNode2.addChangeListener(changeCallback2);

        containerNode1.merge(containerNode2);
        let expectedNode1 = Markup.parse(`
                     <ContainerNode>
                        <TextNode>World1</TextNode>
                        <TextNode>World2</TextNode>
                        <TextNode>World3</TextNode>
                    </ContainerNode>
                `);

        let expectedNode2 = Markup.parse(`
                     <ContainerNode>
                    </ContainerNode>
                `);


        expect(_.filter(changeCallback1.mock.calls, (c) => {return c[0].type === ContainerNode.EVENTS.MERGE}).length).toBe(1);
        expect(changeCallback1).toBeCalled();
        expect(containerNode1.toMarkup()).toEqual(expectedNode1.toMarkup());

        expect(changeCallback2.mock.calls.length).toBeGreaterThan(0);
        expect(changeCallback2).toBeCalled();
        expect(containerNode2.toMarkup()).toEqual(expectedNode2.toMarkup());

        expect(containerNode2.parent).toBeNull();

    });

    it('merge two nodes with a root parent', function() {
        let containerNode = Markup.parse(`
                    <ContainerNode>
                        <ContainerNode>
                            <TextNode>World1</TextNode>
                        </ContainerNode>
                        <ContainerNode>
                            <TextNode>World2</TextNode>
                        </ContainerNode>
                    </ContainerNode>
                `);

        let containerNode1 = containerNode.head;
        let containerNode2 = containerNode.tail;


        let changeCallbackParent = jest.genMockFunction();
        containerNode.addChangeListener(changeCallbackParent);

        let changeCallback1 = jest.genMockFunction();
        containerNode1.addChangeListener(changeCallback1);

        let changeCallback2 = jest.genMockFunction();
        containerNode2.addChangeListener(changeCallback2);

        containerNode1.merge(containerNode2);
        let expectedNode1 = Markup.parse(`
                     <ContainerNode>
                        <TextNode>World1</TextNode>
                        <TextNode>World2</TextNode>
                    </ContainerNode>
                `);

        let expectedNode2 = Markup.parse(`
                     <ContainerNode>
                    </ContainerNode>
                `);

        expect(changeCallback1).toBeCalled();
        expect(_.filter(changeCallback1.mock.calls, (c) => {return c[0].type === ContainerNode.EVENTS.MERGE}).length).toBe(1);
        expect(containerNode1.toMarkup()).toEqual(expectedNode1.toMarkup());

        expect(changeCallback2).toBeCalled();
        expect(changeCallback2.mock.calls.length).toBeGreaterThan(0);
        expect(containerNode2.toMarkup()).toEqual(expectedNode2.toMarkup());

        expect(containerNode2.parent).toBeNull();
        expect(changeCallbackParent).toBeCalled();
    });

    it('merge with self', function() {
        let containerNode1 = new ContainerNode();
        let txtNode1 = new TextNode("World1");
        containerNode1.push(txtNode1);

        let changeCallbackParent = jest.genMockFunction();
        containerNode1.addChangeListener(changeCallbackParent);

        containerNode1.merge(containerNode1);
        expect(_.filter(changeCallbackParent.mock.calls, (c) => {return c[0].type === ContainerNode.EVENTS.MERGE}).length).toBe(1);

    });
});