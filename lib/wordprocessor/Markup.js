let Node = require("./node/Node.js");
let ContainerNode = require("./node/container/ContainerNode.js");
let DocumentNode = require("./node/container/DocumentNode.js");
let PageNode = require("./node/container/PageNode.js");
let HBoxNode = require("./node/container/HBoxNode.js");
let LineNode = require("./node/container/LineNode.js");
let ListNode = require("./node/container/ListNode.js");
let ListItemNode = require("./node/container/ListItemNode.js");

let ContentNode = require("./node/content/ContentNode.js");
let PictureNode = require("./node/content/PictureNode.js");
let ChartNode = require("./node/content/PictureNode.js");


let TextNode = require("./node/content/TextNode.js");

let Style = require("./Style.js");

let acorn = require('acorn-jsx');

ContainerNode.prototype.mapRefWithId = function(ref, id) {
    if(this.__RefMap__ === undefined) {
        this.__RefMap__ = {};
    }

    this.__RefMap__[ref] = id;
};

ContainerNode.prototype.getIdForRef = function(ref) {
    return this.__RefMap__[ref];
};

let Markup = {
    findNodeByTestRef: function(node, ref) {
        let ref_arr = ref.split(".");
        let _parent = node;
        ref_arr.forEach(function(_ref) {
            let _id = _parent.getIdForRef(_ref);
            _parent = _parent.getChildById(_id);
        });
       return _parent;
    },

    parse: function (tag_declarations) {

        let node;

        let ast = acorn.parse(tag_declarations, {
            plugins: {jsx: true}
        });

        let ast_root = ast.body[0].expression;

        let ast_walker = function (ast_tree, parent) {
            let _node;
            if (ast_tree.type === 'JSXElement') {
                let openingElement = ast_tree.openingElement;
                let node_name = openingElement.name.name;
                _node = eval(`new ${node_name}()`);
                if (parent) {
                    parent.push(_node);
                }

                let attributes = openingElement.attributes;
                for (let i = 0; i < attributes.length; i++) {
                    let attribute = attributes[i];
                    let _att_name = attribute.name.name.toLowerCase();
                    if(_att_name === 'pathref') {
                        if(parent) {
                            parent.mapRefWithId(attribute.value.value, _node.id);
                        }
                    } else if(_att_name === 'style') {
                        let styles = attribute.value.value.split(",")
                        styles.forEach(function(_style) {
                            _node.addStyle(eval(_style.trim()));
                        });
                    }
                }

                let children = ast_tree.children;
                for (let i = 0; i < children.length; i++) {
                    ast_walker(children[i], _node);
                }
            } else if (ast_tree.type === 'Literal') {
                let node_text = ast_tree.value;
                if (parent) {
                    parent.text = node_text;
                }
            }

            return _node;
        };

        return ast_walker(ast_root);
    }
};


module.exports = Markup;