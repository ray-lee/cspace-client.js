# Examples

Example scripts demonstrating the use of cspace-client.

These examples utilize features of JavaScript [ES2015](https://github.com/lukehoban/es6features#readme) that are not yet natively supported in Node.js. To run an example script, first use [Babel](http://babeljs.io/) to compile it to JavaScript ES5. The `babel-node` program from the [Babel CLI](https://babeljs.io/docs/usage/cli/) package may be used to compile and execute a script using a single command:

```
$ npx babel-node listReadFirst.js
```

## Contents

The following examples are included:

- [listReadFirst.js](./listReadFirst.js) - List all of the object records stored in CollectionSpace, and retrieve the first.
- [deleteEmptyVocabs.js](./deleteEmptyVocabs.js) - Find all vocabularies (dynamic term lists) in CollectionSpace that have no terms, and delete them.
