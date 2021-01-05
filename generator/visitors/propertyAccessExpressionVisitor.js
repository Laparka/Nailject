"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodeVisitor_1 = require("./nodeVisitor");
const typescript_1 = require("typescript");
class PropertyAccessExpressionVisitor extends nodeVisitor_1.NodeVisitorBase {
    canVisit(node) {
        return node.kind === typescript_1.SyntaxKind.PropertyAccessExpression;
    }
    doVisit(node, context) {
        const instanceTokens = this.visitNext(node.expression, context);
        if (!instanceTokens) {
            throw Error(`The instance property is not defined`);
        }
        const propertyTokens = this.visitNext(node.name, context);
        if (!propertyTokens) {
            throw Error(`Property accessor is missing or multiple results were returned`);
        }
        return {
            name: instanceTokens.name,
            child: propertyTokens
        };
    }
}
exports.default = PropertyAccessExpressionVisitor;
