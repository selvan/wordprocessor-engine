import ContentNode from './ContentNode.js';
import GlyphSplitter from 'grapheme-splitter'
import LineNode from "./../container/LineNode"

import keyMirror from 'keymirror';

class TextNode extends ContentNode {

    static EVENTS = keyMirror({
        SPLIT_NODE_AFTER: null,
        SPLIT_NODE_BEFORE: null,
        SPLIT_NODE_BETWEEN: null,
        HANDLE_KEY_BACKSPACE: null,
        HANDLE_KEY_DELETE: null,
        HANDLE_KEY_RETURN: null,
        TEXT_CHANGE: null
    });

    constructor(text, id) {
        super(id);
        if(!text) {
            text = '';
        }
        this.text = text;
    }

    set text(text) {
        if(!text) {
            text = '';
        }
        this._text = text;
        this.notifyChange({type: TextNode.EVENTS.TEXT_CHANGE, eventSource: this});
    }


    get text() {
        return this._text;
    }

    splitNodeAfter(offset) {
        let newTextNode = new TextNode('');

        if (offset <= 0) {
            newTextNode.text = this.text;
            this.text = '';
        } else if (offset < this.size) {
            let head_tail = this._headAndTail(offset);
            let head = head_tail[0];
            let tail = head_tail[1];

            this.text = head;
            newTextNode.text = tail;
        }

        for (let key in this.style) {
            newTextNode.addStyle(this.style[key]);
        }

        this.notifyChange({type: TextNode.EVENTS.SPLIT_NODE_AFTER, eventSource: this, newNode: newTextNode});

        if (this.parent) {
            this.parent.addChildAfter(this, newTextNode);
        }

        return newTextNode;
    }

    splitNodeBefore(offset) {
        let newTextNode = new TextNode('');

        if (offset >= this.size) {
            newTextNode.text = this.text;
            this.text = '';
        } else if (offset > 0) {
            let head_tail = this._headAndTail(offset);
            let head = head_tail[0];
            let tail = head_tail[1];

            this.text = tail;
            newTextNode = new TextNode(head);
        }

        for (let key in this.style) {
            newTextNode.addStyle(this.style[key]);
        }

        this.notifyChange({type: TextNode.EVENTS.SPLIT_NODE_BEFORE, eventSource: this, newNode: newTextNode});

        if (this.parent) {
            this.parent.addChildBefore(this, newTextNode);
        }

        return newTextNode;
    }

    splitNodeBetween(fromOffset, toOffset) {

        if (fromOffset === toOffset) {
            return null;
        }

        let _segment_after_first_split = null;
        let _segment_after_second_split = null;

        if (fromOffset === 0) {
            _segment_after_first_split = this;
        } else {
            _segment_after_first_split = this.splitNodeAfter(fromOffset);
        }

        if ((toOffset - fromOffset) === _segment_after_first_split.size) {
            _segment_after_second_split = _segment_after_first_split;
        } else {
            _segment_after_second_split = _segment_after_first_split.splitNodeBefore((toOffset - fromOffset));
        }

        this.notifyChange({type: TextNode.EVENTS.SPLIT_NODE_BETWEEN, eventSource: this, newNode: _segment_after_second_split});
        return _segment_after_second_split;
    }

    _headAndTail(startOffset, endOffset = startOffset) {
        let char_array = GlyphSplitter.splitGraphemes(this.text);
        let head = char_array.slice(0, startOffset);
        let tail = char_array.slice(endOffset, char_array.length);
        return [head.join(''), tail.join('')];
    }

    get size() {
        if (this.text) {
            return GlyphSplitter.countGraphemes(this.text);
        }
        return 0;
    }

    get length() {
        return this.size;
    }

    get isEmpty() {
        return this.text === "";
    }

    get hasContent() {
        return !this.isEmpty
    }

    handleBackspaceAt(offset) {
        if (offset === 0) {

            let prevNode = this.prev;

            if (prevNode) {
                return prevNode.handleBackspaceAt(prevNode.size);
            }

            let parentSibling = this.parent.prev;
            if(!parentSibling) {
                return {node:this, offset: offset};
            }

            parentSibling.merge(this.parent);

            this.notifyChange({type: TextNode.EVENTS.HANDLE_KEY_BACKSPACE, eventSource: this});
            return this.hasPrev ? {node:this.prev, offset: this.prev.size} : {node:this, offset: offset};
        } else {
            this.removeCharBetween(offset-1, offset);
            let prev = this.prev;

            if(this.text === '' && prev) {
                this.parent.deleteChildById(this.id);
                return {node:prev, offset:prev.size};
            }

            this.notifyChange({type: TextNode.EVENTS.HANDLE_KEY_BACKSPACE, eventSource: this});
            return {node:this, offset:offset-1};
        }
    }

    handleDeleteAt(offset) {
        if (offset >= this.size) {

            let nextNode = this.next;

            if (nextNode) {
                return nextNode.handleDeleteAt(0);
            }

            let parentSibling = this.parent.next;
            if(!parentSibling) {
                return {node:this, offset: offset};
            }

            this.parent.merge(parentSibling);

            this.notifyChange({type: TextNode.EVENTS.HANDLE_KEY_DELETE, eventSource: this});
            return this.hasNext ? {node:this.next, offset: 0} : {node:this, offset: offset};
        } else {
            this.removeCharBetween(offset, offset+1);
            let next = this.next;

            if(this.text === '' && next) {
                this.parent.deleteChildById(this.id);
                return {node:next, offset:0};
            }

            this.notifyChange({type: TextNode.EVENTS.HANDLE_KEY_DELETE, eventSource: this});
            return {node:this, offset:offset};
        }
    }

    handleReturnAt(offset) {
        let parent = this.parent;
        let newParent;

        if(offset === 0) {
            newParent = parent.splitAtChild(this);
        } else if(offset < this.size) {
            let newTxtNode = this.splitNodeAfter(offset);
            newParent = parent.splitAtChild(newTxtNode);
        } else if (offset >= this.size) {
            newParent = parent.splitAfterChild(this);
        }

        if(!newParent.head) {
            newParent.push(new this.constructor());
        }

        if(!parent.head) {
            parent.push(new this.constructor());
        }

        this.notifyChange({type: TextNode.EVENTS.HANDLE_KEY_RETURN, eventSource: this});

        return {node: newParent.head, offset: 0};
    }

    removeCharBetween(startOffset, endOffset=startOffset+1) {
        this.text = this._headAndTail(startOffset, endOffset).join('');
    }

    insertStrAt(offset, str) {
        let head_tail = this._headAndTail(offset);
        let head = head_tail[0];
        let tail = head_tail[1];
        this.text = `${head}${str}${tail}`
    }

    deleteIfEmpty() {
        if(this.isEmpty && this.parent) {
            this.parent.deleteChildById(this.id);
        }
    }

    markupTagContent(include_id, include_style) {
        return this.text;
    }

    canBeAChildTo(toBeParentNode) {
        if(toBeParentNode instanceof LineNode) {
            return true;
        }
        return false;
    }

    isContentSelectable() {
        return true;
    }

    serializableData() {
        return {
            text: this.text
        };
    }

    deserializeData(deserializer, dataAndMeta) {
        this.text = dataAndMeta.data.text;
    }

    cloneSelf() {
        return new this.constructor(this.text, this.id);
    }
}

module.exports = TextNode;

