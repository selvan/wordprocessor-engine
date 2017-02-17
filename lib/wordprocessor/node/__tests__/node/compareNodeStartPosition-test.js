jest.autoMockOff();

let Node = require("./../../Node.js");
let Style = require("./../../../Style.js");
let ContainerNode = require("./../../container/ContainerNode.js");
let TextNode = require("./../../content/TextNode.js");

let Markup = require("./../../../Markup.js");


describe('Node', function() {
        it('It should compare positions', function () {

            let rootNode = Markup.parse(`
                <ContainerNode>
                    <ContainerNode pathRef='1'>
                        <ContainerNode pathRef='1_1'>
                            <TextNode pathRef='1_1_1'>x</TextNode><TextNode pathRef='1_1_2'>y</TextNode><TextNode pathRef='1_1_3'>z</TextNode>
                        </ContainerNode>
                        <ContainerNode pathRef='1_2'>
                            <TextNode pathRef='1_2_1'>a</TextNode>
                        </ContainerNode>
                     </ContainerNode>
                    <ContainerNode pathRef='2'>
                        <ContainerNode pathRef='2_1'>
                            <TextNode pathRef='2_1_1'>x</TextNode><TextNode pathRef='2_1_2'>y</TextNode><TextNode pathRef='2_1_3'>z</TextNode>
                        </ContainerNode>
                        <ContainerNode pathRef='2_2'>
                            <TextNode pathRef='2_2_1'>9999</TextNode>
                        </ContainerNode>
                     </ContainerNode>
                </ContainerNode>
            `);


            let byRef = function (_ref) {
                return Markup.findNodeByTestRef(rootNode, _ref);
            };

            expect(Node.compareNodeStartPosition(byRef("1"), byRef("1"))).toEqual(0);

            expect(Node.compareNodeStartPosition(byRef("1"), byRef("1.1_1"))).toEqual(-1);
            expect(Node.compareNodeStartPosition(byRef("1.1_1"), byRef("1"))).toEqual(1);

            expect(Node.compareNodeStartPosition(byRef("1"), byRef("1.1_1.1_1_1"))).toEqual(-1);
            expect(Node.compareNodeStartPosition(byRef("1.1_1.1_1_1"), byRef("1"))).toEqual(1);

            expect(Node.compareNodeStartPosition(byRef("1"), byRef("1.1_2"))).toEqual(-1);
            expect(Node.compareNodeStartPosition(byRef("1.1_2"), byRef("1"))).toEqual(1);
            expect(Node.compareNodeStartPosition(byRef("1.1_2.1_2_1"), byRef("1"))).toEqual(1);

            expect(Node.compareNodeStartPosition(byRef("1.1_1.1_1_2"), byRef("1.1_1.1_1_3"))).toEqual(-1);
            expect(Node.compareNodeStartPosition(byRef("1.1_1.1_1_3"), byRef("1.1_1.1_1_2"))).toEqual(1);

            expect(Node.compareNodeStartPosition(byRef("1"), byRef("2"))).toEqual(-1);
            expect(Node.compareNodeStartPosition(byRef("2"), byRef("1"))).toEqual(1);

            expect(Node.compareNodeStartPosition(byRef("1.1_1.1_1_3"), byRef("2"))).toEqual(-1);
            expect(Node.compareNodeStartPosition(byRef("2"), byRef("1.1_1.1_1_3"))).toEqual(1);

            expect(Node.compareNodeStartPosition(byRef("1.1_1.1_1_3"), byRef("2.2_1.2_1_3"))).toEqual(-1);
            expect(Node.compareNodeStartPosition(byRef("2.2_1.2_1_3"), byRef("1.1_1.1_1_3"))).toEqual(1);

            expect(Node.compareNodeStartPosition(byRef("1.1_1.1_1_3"), byRef("2.2_2"))).toEqual(-1);
            expect(Node.compareNodeStartPosition(byRef("2.2_2"), byRef("1.1_1.1_1_3"))).toEqual(1);
            expect(Node.compareNodeStartPosition(byRef("2.2_2.2_2_1"), byRef("1.1_1.1_1_3"))).toEqual(1);

            expect(Node.compareNodeStartPosition(byRef("1.1_2"), byRef("2.2_2"))).toEqual(-1);
            expect(Node.compareNodeStartPosition(byRef("2.2_2"), byRef("1.1_2"))).toEqual(1);
            expect(Node.compareNodeStartPosition(byRef("2.2_2.2_2_1"), byRef("1.1_2"))).toEqual(1);

            expect(byRef("1.1_1.1_1_3").isStartAfter(byRef("1"))).toBeTruthy();
            expect(byRef("1").isStartAfter(byRef("1.1_1.1_1_3"))).toBeFalsy();
            expect(byRef("1").isStartAfter(byRef("1"))).toBeFalsy();
        });
});