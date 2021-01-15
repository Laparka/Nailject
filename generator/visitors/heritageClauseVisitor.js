"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodeVisitor_1 = require("./nodeVisitor");
const typescript_1 = require("typescript");
const dependenciesRegistrationDir = 'pileuple-api/dependenciesRegistration';
class HeritageClauseVisitor extends nodeVisitor_1.NodeVisitorBase {
    canVisit(node) {
        return node.kind === typescript_1.SyntaxKind.HeritageClause;
    }
    doVisit(node, context) {
        if (node.token !== typescript_1.SyntaxKind.ImplementsKeyword || node.modifiers) {
            return;
        }
        for (const type of node.types) {
            const interfaceAccessor = this.visitNext(type, context);
            if (!interfaceAccessor) {
                throw Error(`Invalid inheritance type`);
            }
            if (!interfaceAccessor.importFrom) {
                continue;
            }
            if (interfaceAccessor.importFrom.normalized.name !== 'DependenciesRegistration') {
                continue;
            }
            if (interfaceAccessor.importFrom.normalized.path === dependenciesRegistrationDir) {
                return interfaceAccessor;
            }
        }
    }
}
exports.default = HeritageClauseVisitor;
