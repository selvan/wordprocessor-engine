jest.autoMockOff();

let ContainerNode = require("./../../ContainerNode.js");
let TextNode = require("./../../../content/TextNode.js");
let Markup = require("./../../../../Markup.js");
let _byRef = Markup.findNodeByTestRef;

let Node = require("./../../../Node.js");

describe('clone', function() {

    let containerNode;

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
        expect(containerNode.childrenCount).toEqual(3);
    });


    it('text node', function() {

        let clonedNode = containerNode.clone();
        expect(clonedNode.toMarkup(true)).toEqual(containerNode.toMarkup(true));
    });

});