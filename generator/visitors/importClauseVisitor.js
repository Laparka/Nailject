"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodeVisitor_1 = require("./nodeVisitor");
const typescript_1 = require("typescript");
class ImportClauseVisitor extends nodeVisitor_1.NodeVisitorBase {
    canVisit(node) {
        return node.kind === typescript_1.SyntaxKind.ImportClause;
    }
    doVisit(node, context) {
        if (node.name) {
            const nameResult = this.visitNext(node.name, context);
            if (!nameResult || !nameResult.name) {
                throw Error("Failed to parse the import clause name token");
            }
            return [{
                    path: '',
                    kind: 'Default',
                    alias: nameResult.name,
                    name: nameResult.name,
                    isExternal: false
                }];
        }
        if (node.namedBindings) {
            const bindingResult = this.visitNext(node.namedBindings, context);
            if (!bindingResult) {
                throw Error(`Failed to parse the import named bindings`);
            }
            return bindingResult;
        }
        throw Error(`Invalid ImportClause declaration. Name and Named Bindings are empty`);
    }
}
exports.default = ImportClauseVisitor;
