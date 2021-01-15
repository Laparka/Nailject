"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodeVisitor_1 = require("./nodeVisitor");
const typescript_1 = require("typescript");
class IdentifierVisitor extends nodeVisitor_1.NodeVisitorBase {
    canVisit(node) {
        return node.kind === typescript_1.SyntaxKind.Identifier;
    }
    doVisit(node, context) {
        return {
            name: node.escapedText.toString()
        };
    }
}
exports.default = IdentifierVisitor;
