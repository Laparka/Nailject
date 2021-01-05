"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodeVisitor_1 = require("./nodeVisitor");
const typescript_1 = require("typescript");
const utils_1 = require("../utils");
class HeritageClauseVisitor extends nodeVisitor_1.NodeVisitorBase {
    canVisit(node) {
        return node.kind === typescript_1.SyntaxKind.HeritageClause;
    }
    doVisit(node, context) {
        if (node.token !== typescript_1.SyntaxKind.ImplementsKeyword || node.modifiers) {
            return;
        }
        for (const type of node.types) {
            const typeCodeAccessor = this.visitNext(type, context);
            if (!typeCodeAccessor || !typeCodeAccessor.name) {
                throw Error(`Invalid inheritance type`);
            }
            if (HeritageClauseVisitor.hasImport(typeCodeAccessor.name, context.imports) && utils_1.getLastPropertyAccessor(typeCodeAccessor) === 'DependenciesRegistration') {
                return typeCodeAccessor;
            }
        }
    }
    static hasImport(name, imports) {
        return !!utils_1.tryFindImportType(name, imports);
    }
}
exports.default = HeritageClauseVisitor;
