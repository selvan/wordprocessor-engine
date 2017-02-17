jest.autoMockOff();

let Node = require("./../../../Node.js");
let ContainerNode = require("./../../ContainerNode.js");
let TextNode = require("./../../../content/TextNode.js");

let Markup = require("./../../../../Markup.js");
let _byRef = Markup.findNodeByTestRef;

describe("Should support deleteChildById", function() {

    it("single node", function() {
        let containerNode = Markup.parse(`
                    <ContainerNode>
                        <TextNode>World1</TextNode>
                    </ContainerNode>
                `);

        let changeCallback = jest.genMockFunction();
        containerNode.addChangeListener(changeCallback);

        let extractedNode = containerNode.deleteChildById(containerNode.head.id);
        let expectedNode = Markup.parse(`
                     <ContainerNode>
                    </ContainerNode>
                `);

        expect(changeCallback).toBeCalled();
        expect(containerNode.toMarkup()).toEqual(expectedNode.toMarkup());
    });


    describe("Simple", function() {
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

        it('at head', function() {
            let extractedNode = containerNode.deleteChildById(containerNode.head.id);

            let expectedNode = Markup.parse(`
                     <ContainerNode>
                        <TextNode>World2</TextNode>
                        <TextNode>World3</TextNode>
                    </ContainerNode>
                `);

            expect(changeCallback).toBeCalled();
            expect(containerNode.toMarkup()).toEqual(expectedNode.toMarkup());
            expect(extractedNode.parent).toBeNull();
            expect(extractedNode.next).toBeNull();
            expect(extractedNode.prev).toBeNull();
        });

        it('at tail', function() {
            let extractedNode = containerNode.deleteChildById(containerNode.tail.id);

            let expectedNode = Markup.parse(`
                     <ContainerNode>
                        <TextNode>World1</TextNode>
                        <TextNode>World2</TextNode>
                    </ContainerNode>
                `);

            expect(changeCallback).toBeCalled();
            expect(containerNode.toMarkup()).toEqual(expectedNode.toMarkup());
            expect(extractedNode.parent).toBeNull();
            expect(extractedNode.next).toBeNull();
            expect(extractedNode.prev).toBeNull();
        });

        it('at mid', function() {
            let extractedNode = containerNode.deleteChildById(containerNode.head.next.id);

            let expectedNode = Markup.parse(`
                     <ContainerNode>
                        <TextNode>World1</TextNode>
                        <TextNode>World3</TextNode>
                    </ContainerNode>
                `);

            expect(changeCallback).toBeCalled();
            expect(containerNode.toMarkup()).toEqual(expectedNode.toMarkup());
            expect(extractedNode.parent).toBeNull();
            expect(extractedNode.next).toBeNull();
            expect(extractedNode.prev).toBeNull();
        });
    });

    it("single nested node", function() {
        let containerNode = Markup.parse(`
                    <ContainerNode>
                        <ContainerNode>
                            <TextNode>World1</TextNode>
                        </ContainerNode>
                    </ContainerNode>
                `);

        let changeCallback = jest.genMockFunction();
        containerNode.addChangeListener(changeCallback);

        let extractedNode = containerNode.head.deleteChildById(containerNode.head.head.id);
        let expectedNode = Markup.parse(`
                     <ContainerNode>
                    </ContainerNode>
                `);

        expect(changeCallback).toBeCalled();
        expect(containerNode.toMarkup()).toEqual(expectedNode.toMarkup());
    });

    describe("Nested", function() {
        let containerNode;
        let changeCallback;

        beforeEach(function() {
            containerNode = Markup.parse(`
                    <ContainerNode>
                        <ContainerNode>
                            <TextNode>World1</TextNode>
                        </ContainerNode>
                        <ContainerNode>
                            <TextNode>World2</TextNode>
                        </ContainerNode>
                        <ContainerNode>
                            <TextNode>World3</TextNode>
                        </ContainerNode>
                    </ContainerNode>
                `);

            changeCallback = jest.genMockFunction();
            containerNode.addChangeListener(changeCallback);

            expect(containerNode.childrenCount).toEqual(3);
        });

        it('at head', function() {
            let extractedNode = containerNode.deleteChildById(containerNode.head.id);

            let expectedNode = Markup.parse(`
                     <ContainerNode>
                        <ContainerNode>
                            <TextNode>World2</TextNode>
                        </ContainerNode>
                        <ContainerNode>
                            <TextNode>World3</TextNode>
                        </ContainerNode>
                    </ContainerNode>
                `);

            expect(changeCallback).toBeCalled();
            expect(containerNode.toMarkup()).toEqual(expectedNode.toMarkup());
            expect(extractedNode.parent).toBeNull();
            expect(extractedNode.next).toBeNull();
            expect(extractedNode.prev).toBeNull();
        });

        it('at tail', function() {
            let extractedNode = containerNode.deleteChildById(containerNode.tail.id);

            let expectedNode = Markup.parse(`
                     <ContainerNode>
                        <ContainerNode>
                            <TextNode>World1</TextNode>
                        </ContainerNode>
                        <ContainerNode>
                            <TextNode>World2</TextNode>
                        </ContainerNode>
                    </ContainerNode>
                `);

            expect(changeCallback).toBeCalled();
            expect(containerNode.toMarkup()).toEqual(expectedNode.toMarkup());
            expect(extractedNode.parent).toBeNull();
            expect(extractedNode.next).toBeNull();
            expect(extractedNode.prev).toBeNull();
        });

        it('at mid', function() {
            let extractedNode = containerNode.deleteChildById(containerNode.tail.prev.id);

            let expectedNode = Markup.parse(`
                     <ContainerNode>
                        <ContainerNode>
                            <TextNode>World1</TextNode>
                        </ContainerNode>
                        <ContainerNode>
                            <TextNode>World3</TextNode>
                        </ContainerNode>
                    </ContainerNode>
                `);

            expect(changeCallback).toBeCalled();
            expect(containerNode.toMarkup()).toEqual(expectedNode.toMarkup());
            expect(extractedNode.parent).toBeNull();
            expect(extractedNode.next).toBeNull();
            expect(extractedNode.prev).toBeNull();
        });
    });
});
