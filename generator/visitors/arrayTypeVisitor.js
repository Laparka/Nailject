"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodeVisitor_1 = require("./nodeVisitor");
const typescript_1 = require("typescript");
class ArrayTypeVisitor extends nodeVisitor_1.NodeVisitorBase {
    canVisit(node) {
        return node.kind === typescript_1.SyntaxKind.ArrayType;
    }
    doVisit(node, context) {
        const elementNode = this.visitNext(node.elementType, context);
        if (!elementNode) {
            throw Error(`The array element type is not defined`);
        }
        return {
            name: "[]",
            child: elementNode
        };
    }
}
exports.default = ArrayTypeVisitor;
