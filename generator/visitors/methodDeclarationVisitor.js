"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodeVisitor_1 = require("./nodeVisitor");
const typescript_1 = require("typescript");
class MethodDeclarationVisitor extends nodeVisitor_1.NodeVisitorBase {
    canVisit(node) {
        return node.kind === typescript_1.SyntaxKind.MethodDeclaration;
    }
    doVisit(node, context) {
        if (node.modifiers || node.parameters.length !== 1 || !node.body) {
            return;
        }
        const nameTokens = this.visitNext(node.name, context);
        if (!nameTokens) {
            throw Error(`Failed to parse the method name`);
        }
        if (nameTokens.name !== 'register') {
            return;
        }
        const parameterTokens = this.visitNext(node.parameters[0], context);
        if (!parameterTokens) {
            return;
        }
        for (const bodyStatement of node.body.statements) {
            this.visitNext(bodyStatement, context);
        }
    }
}
exports.default = MethodDeclarationVisitor;
