jest.autoMockOff();

let Markup = require("./../Markup.js");
let Style = require("./../Style.js");

let Node = require("./../node/Node.js");

let ContainerNode = require("./../node/container/ContainerNode.js");
let TextNode = require("./../node/content/TextNode.js");
let SerializerAndDeserializer = require("./../SerializerAndDeserializer.js");

describe('Deserializer', function() {

    it("Should convert serialized map to Node", function() {
        let rootNode = Markup.parse(`
            <ContainerNode>
                <TextNode>XYZ</TextNode>
            </ContainerNode>
        `);

        let head = rootNode.head;
        head.addStyle(Style.BOLD);
        head.addStyle(Style.ITALIC);

        let serializer = new SerializerAndDeserializer.Serializer(rootNode);
        let serializedData = serializer.serialize();

        let deserializer = new SerializerAndDeserializer.Deserializer(serializedData);
        let newNode = deserializer.deserialize();
        expect(rootNode.toMarkup(false, true)).toEqual(newNode.toMarkup(false, true));
    });
});
