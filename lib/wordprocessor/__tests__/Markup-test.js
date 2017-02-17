jest.autoMockOff();

let Markup = require("./../Markup.js");
let Style = require("./../Style.js");

let Node = require("./../node/Node.js");

let ContainerNode = require("./../node/container/ContainerNode.js");
let TextNode = require("./../node/content/TextNode.js");

describe('Markup', function() {

    it("Should convert tags to Object", function() {
        let rootNode = Markup.parse(`
            <ContainerNode>
                <TextNode/>
            </ContainerNode>
        `);
        expect(rootNode instanceof ContainerNode).toBeTruthy();
        expect(rootNode.firstChild instanceof TextNode).toBeTruthy();
    });

    describe("support pathRef attribute", function() {
        it("Should support find node by pathRef attribute - simple", function() {
            let rootNode = Markup.parse(`
                <ContainerNode>
                    <TextNode pathRef='1'/>
                </ContainerNode>
            `);
            let _node = Markup.findNodeByTestRef(rootNode, "1");
            expect(_node instanceof TextNode).toBeTruthy();
        });

        it("Should support find node by pathRef attribute - nested", function() {
            let rootNode = Markup.parse(`
                <ContainerNode>
                    <ContainerNode pathRef='1'>
                        <TextNode pathRef='1_1'/>
                    </ContainerNode>
                </ContainerNode>
            `);

            let _block_node = Markup.findNodeByTestRef(rootNode, "1");
            expect(_block_node instanceof ContainerNode).toBeTruthy();

            let _txt_node = Markup.findNodeByTestRef(rootNode, "1.1_1");
            expect(_txt_node instanceof TextNode).toBeTruthy();
        });
    });

    it("Should allow node creation from tags", function () {
        let root_node  = Markup.parse(`
            <ContainerNode>
                <ContainerNode pathRef='x1'>
                    <TextNode pathRef='y'>12345</TextNode>
                 </ContainerNode>
                <ContainerNode pathRef='x2'>
                    <TextNode pathRef='y'>9999</TextNode>
                 </ContainerNode>
            </ContainerNode>
        `);

        let head_child = Markup.findNodeByTestRef(root_node, 'x1');
        let tail_child = Markup.findNodeByTestRef(root_node, 'x2');
        expect(root_node.head.id).toEqual(head_child.id);
        expect(root_node.tail.id).toEqual(tail_child.id);

        let inner_child = Markup.findNodeByTestRef(root_node, 'x1.y');
        expect(root_node.head.tail.id).toEqual(inner_child.id);
        expect(root_node.head.head.id).toEqual(inner_child.id);
        expect(inner_child.text).toEqual("12345");

        inner_child = Markup.findNodeByTestRef(root_node, 'x2.y');
        expect(root_node.tail.tail.id).toEqual(inner_child.id);
        expect(root_node.tail.head.id).toEqual(inner_child.id);
        expect(inner_child.text).toEqual("9999");
    });

    it("Should support style attribute", function() {
        let rootNode = Markup.parse(`
                <ContainerNode>
                    <TextNode pathRef="1" style="Style.BOLD" />
                </ContainerNode>
            `);
        let _node = Markup.findNodeByTestRef(rootNode, "1");
        expect(_node.style[Style.BOLD.id]).toBe(Style.BOLD);
    });

    it("Should support multiple styles", function() {
        let rootNode = Markup.parse(`
                <ContainerNode>
                    <TextNode pathRef="1" style="Style.BOLD, Style.ITALIC" />
                </ContainerNode>
            `);
        let _node = Markup.findNodeByTestRef(rootNode, "1");
        expect(_node.style[Style.BOLD.id]).toBe(Style.BOLD)
        expect(_node.style[Style.ITALIC.id]).toBe(Style.ITALIC)
    });
});
