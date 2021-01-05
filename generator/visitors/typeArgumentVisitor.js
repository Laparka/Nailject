"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodeVisitor_1 = require("./nodeVisitor");
const typescript_1 = require("typescript");
class TypeArgumentVisitor extends nodeVisitor_1.NodeVisitorBase {
    canVisit(node) {
        return node.kind === typescript_1.SyntaxKind.ExpressionWithTypeArguments;
    }
    doVisit(node, context) {
        const genericArgs = [];
        if (node.typeArguments) {
            for (const typeArg of node.typeArguments) {
                const genericTypeArgAccessor = this.visitNext(typeArg, context);
                if (!genericTypeArgAccessor || !genericTypeArgAccessor.name) {
                    throw Error(`Failed to generate Generic Type Arguments`);
                }
                genericArgs.push(genericTypeArgAccessor);
            }
        }
        const accessorTokens = this.visitNext(node.expression, context);
        if (!accessorTokens) {
            throw Error(`Failed to parse the type name`);
        }
        if (accessorTokens.typeNames && accessorTokens.typeNames.length !== 0) {
            throw Error(`The accessor expression cannot have generic arguments. Property access name ${accessorTokens.name}`);
        }
        accessorTokens.typeNames = genericArgs;
        return accessorTokens;
    }
}
exports.default = TypeArgumentVisitor;
