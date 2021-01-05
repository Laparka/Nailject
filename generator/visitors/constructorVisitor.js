"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodeVisitor_1 = require("./nodeVisitor");
const typescript_1 = require("typescript");
class ConstructorVisitor extends nodeVisitor_1.NodeVisitorBase {
    canVisit(node) {
        return node.kind === typescript_1.SyntaxKind.Constructor;
    }
    doVisit(node, context) {
        if (context.mode !== 'Dependent' || node.parameters.length === 0) {
            return;
        }
        for (const parameter of node.parameters) {
            this.visitNext(parameter, context);
        }
    }
}
exports.default = ConstructorVisitor;
