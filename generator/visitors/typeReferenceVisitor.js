"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodeVisitor_1 = require("./nodeVisitor");
const typescript_1 = require("typescript");
class TypeReferenceVisitor extends nodeVisitor_1.NodeVisitorBase {
    canVisit(node) {
        return node.kind === typescript_1.SyntaxKind.TypeReference;
    }
    doVisit(node, context) {
        const genericArgs = [];
        if (node.typeArguments) {
            for (const typeArg of node.typeArguments) {
                const genericTypeAccessor = this.visitNext(typeArg, context);
                if (!genericTypeAccessor || !genericTypeAccessor.name) {
                    throw Error(`Failed to parse the type's generic arguments`);
                }
                genericArgs.push(genericTypeAccessor);
            }
        }
        const accessorTokens = this.visitNext(node.typeName, context);
        if (!accessorTokens || !accessorTokens.name) {
            throw Error(`Failed to parse the type reference name`);
        }
        accessorTokens.typeNames = genericArgs;
        return accessorTokens;
    }
}
exports.default = TypeReferenceVisitor;
