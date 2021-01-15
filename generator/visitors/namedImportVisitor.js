"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodeVisitor_1 = require("./nodeVisitor");
const typescript_1 = require("typescript");
class NamedImportVisitor extends nodeVisitor_1.NodeVisitorBase {
    canVisit(node) {
        return node.kind === typescript_1.SyntaxKind.NamedImports;
    }
    doVisit(node, context) {
        const specifiers = [];
        for (const element of node.elements) {
            const importSpecifierAccessor = this.visitNext(element, context);
            if (!importSpecifierAccessor || !importSpecifierAccessor.name) {
                throw Error("Named import specifier is empty");
            }
            specifiers.push({
                kind: 'Named',
                path: '',
                isExternal: false,
                name: importSpecifierAccessor.name,
                alias: importSpecifierAccessor.child ? importSpecifierAccessor.child.name : importSpecifierAccessor.name
            });
        }
        return specifiers;
    }
}
exports.default = NamedImportVisitor;
