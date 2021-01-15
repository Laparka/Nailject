"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_1 = require("typescript");
const nodeVisitor_1 = require("./nodeVisitor");
class SyntaxListVisitor extends nodeVisitor_1.NodeVisitorBase {
    canVisit(node) {
        return node.kind === typescript_1.SyntaxKind.SyntaxList;
    }
    doVisit(node, context) {
        const children = node.getChildren();
        for (const child of children) {
            this.visitNext(child, context);
        }
    }
}
exports.default = SyntaxListVisitor;
