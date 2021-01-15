"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeArgumentVisitor = exports.TypeReferenceVisitor = void 0;
const nodeVisitor_1 = require("./nodeVisitor");
const typescript_1 = require("typescript");
const utils_1 = require("../utils");
function getGenericTypeArgs(typeArgs, nodeVisitor, context) {
    const genericArgs = [];
    if (typeArgs) {
        for (const typeArg of typeArgs) {
            const genericTypeAccessor = nodeVisitor.visit(typeArg, context);
            if (!genericTypeAccessor || !genericTypeAccessor.name) {
                throw Error(`Failed to parse the type's generic arguments`);
            }
            utils_1.normalizeAccessor(genericTypeAccessor, context.imports);
            genericArgs.push(genericTypeAccessor);
        }
    }
    return genericArgs;
}
function toTypeReferenceAccessor(typeRefAccessor, imports) {
    if (!typeRefAccessor || !typeRefAccessor.name) {
        throw Error(`Failed to parse the type reference name`);
    }
    utils_1.normalizeAccessor(typeRefAccessor, imports);
    return typeRefAccessor;
}
class TypeReferenceVisitor extends nodeVisitor_1.NodeVisitorBase {
    canVisit(node) {
        return node.kind === typescript_1.SyntaxKind.TypeReference;
    }
    doVisit(node, context) {
        const typeAccessor = toTypeReferenceAccessor(this.visitNext(node.typeName, context), context.imports);
        if (node.typeArguments) {
            typeAccessor.typeNames = getGenericTypeArgs(node.typeArguments, this.rootVisitor, context);
        }
        return typeAccessor;
    }
}
exports.TypeReferenceVisitor = TypeReferenceVisitor;
class TypeArgumentVisitor extends nodeVisitor_1.NodeVisitorBase {
    canVisit(node) {
        return node.kind === typescript_1.SyntaxKind.ExpressionWithTypeArguments;
    }
    doVisit(node, context) {
        const typeAccessor = toTypeReferenceAccessor(this.visitNext(node.expression, context), context.imports);
        if (node.typeArguments) {
            typeAccessor.typeNames = getGenericTypeArgs(node.typeArguments, this.rootVisitor, context);
        }
        return typeAccessor;
    }
}
exports.TypeArgumentVisitor = TypeArgumentVisitor;
