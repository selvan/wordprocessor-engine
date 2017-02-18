## About
Virtual wordprocessor engine that runs in mobile (React native), web browser(Javascript) and server (Nodejs)

For virtual calc engine: https://www.github.com/selvan/calc-engine

## Features
* Support for Cut/Copy/Paste
* Support for Undo/Redo
* Support for Bold, Italic, Underline, Strike through
* Support for Alignment (Left, Right, Center) and Quote
* Support for List items

## Introduction

### Overview

There are two kind of nodes in wordprocessor-engine,

* Container (Line, List, HBox) 
* Content (Picture, Chart, Text)

### TextNode
Text node holds text content. It supports handling operation such as,

* handleBackspace
* handleDeleteAt
* handleReturnAt
* insertStrAt
* splitNodeAfter
* splitNodeBefore
* splitNodeBetween
* clone

See lib/wordprocessor/node/content/__tests__/textnode for details on these operations

### LineNode
LineNode holds one or more text nodes. It supports handling operation such as,

* addChildAfter
* addChildBefore
* deleteChildById
* extractChildById
* forEach
* merge
* mergeAfterChild
* pop
* push
* splitAfterChild
* splitAtChild

See lib/wordprocessor/node/container/__tests__/containernode for details on these operations

### Performing Cut/Copy
    See /lib/wordprocessor/visitor/__tests__/CutCopyVisitor-test.js

### Performing Paste
    See /lib/wordprocessor/visitor/__tests__/PasteVisitor-test.js

### Predorming Undo/Redo
    See lib/wordprocessor/__tests__/UndoManager-test.js

### Creating List items
    See /lib/wordprocessor/visitor/__tests__/ListStyleVisitor-test.js

### Quote, Align Left, Right, Center
    See /lib/wordprocessor/visitor/__tests__/LineStyleVisitor-test.js

### Bold, Italic, Underline, Strike through
    See /lib/wordprocessor/visitor/__tests__/TextStyleVisitor-test.js

### Delete bunch of Nodes
    See /lib/wordprocessor/visitor/__tests__/DeleteVisitor-test.js

### Performing Serialization and Deserialization
    See /lib/wordprocessor/__tests__/Deserializer-test.js

## Running
### Build on code change (Used during development)

    npm run start

This will create dist/bundle.js

### Running all tests

    npm run test

### Build minimalized output

    npm run build
    
This will create dist/bundle.min.js

## Notes about user selection
* There are two kind of nodes a) Container (Line, List, HBox) b) Content (Picture, Chart, Text)
* Content node shall be cursor focusable (text node) or non-cusrsor focuable (Picture, Chart) 
* User can only set a selection range on a text node.
 