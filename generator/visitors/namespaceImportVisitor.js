"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodeVisitor_1 = require("./nodeVisitor");
const typescript_1 = require("typescript");
class NamespaceImportVisitor extends nodeVisitor_1.NodeVisitorBase {
    canVisit(node) {
        return node.kind === typescript_1.SyntaxKind.NamespaceImport;
    }
    doVisit(node, context) {
        const id = this.visitNext(node.name, context);
        if (!id || !id.name) {
            throw Error("Namespace Import must have only 1 specifier");
        }
        return [{
                name: '*',
                alias: id.name,
                path: '',
                kind: 'Namespace',
                isExternal: false
            }];
    }
}
exports.default = NamespaceImportVisitor;
