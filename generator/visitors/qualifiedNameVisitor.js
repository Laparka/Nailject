"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodeVisitor_1 = require("./nodeVisitor");
const typescript_1 = require("typescript");
class QualifiedNameVisitor extends nodeVisitor_1.NodeVisitorBase {
    canVisit(node) {
        return node.kind === typescript_1.SyntaxKind.QualifiedName;
    }
    doVisit(node, context) {
        const leftTokens = this.visitNext(node.left, context);
        if (!leftTokens) {
            throw Error(`Failed to parse the left-expression of the qualified token`);
        }
        const rightTokens = this.visitNext(node.right, context);
        if (!rightTokens) {
            throw Error(`Failed to parse the right-expression of the qualified token`);
        }
        leftTokens.child = rightTokens;
        return leftTokens;
    }
}
exports.default = QualifiedNameVisitor;
