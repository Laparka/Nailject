"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodeVisitor_1 = require("./nodeVisitor");
const typescript_1 = require("typescript");
class ExpressionStatementVisitor extends nodeVisitor_1.NodeVisitorBase {
    canVisit(node) {
        return node.kind === typescript_1.SyntaxKind.ExpressionStatement;
    }
    doVisit(node, context) {
        this.visitNext(node.expression, context);
    }
}
exports.default = ExpressionStatementVisitor;
