"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_1 = require("typescript");
class PrimitiveTypeVisitor {
    canVisit(node) {
        return node.kind === typescript_1.SyntaxKind.BigIntKeyword
            || node.kind === typescript_1.SyntaxKind.NumberKeyword
            || node.kind === typescript_1.SyntaxKind.BooleanKeyword
            || node.kind === typescript_1.SyntaxKind.StringKeyword
            || node.kind === typescript_1.SyntaxKind.AnyKeyword;
    }
    visit(node, context) {
        let type;
        switch (node.kind) {
            case typescript_1.SyntaxKind.AnyKeyword: {
                type = "any";
                break;
            }
            case typescript_1.SyntaxKind.StringKeyword: {
                type = "string";
                break;
            }
            case typescript_1.SyntaxKind.BigIntKeyword: {
                type = "bigint";
                break;
            }
            case typescript_1.SyntaxKind.NumberKeyword: {
                type = "number";
                break;
            }
            case typescript_1.SyntaxKind.BooleanKeyword: {
                type = "boolean";
                break;
            }
            default: {
                throw Error(`Not supported primitive type: ${node.kind}`);
            }
        }
        return {
            name: type
        };
    }
}
exports.default = PrimitiveTypeVisitor;
