"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodeVisitor_1 = require("./nodeVisitor");
const typescript_1 = require("typescript");
class ClassDeclarationVisitor extends nodeVisitor_1.NodeVisitorBase {
    canVisit(node) {
        if (node.kind === typescript_1.SyntaxKind.ClassDeclaration) {
            if (node.modifiers) {
                return node.modifiers.findIndex(_ => _.kind === typescript_1.SyntaxKind.ExportKeyword) >= 0;
            }
        }
        return false;
    }
    doVisit(node, context) {
        if (!node.name) {
            return;
        }
        const classNameCodeAccessor = this.visitNext(node.name, context);
        if (!classNameCodeAccessor || !classNameCodeAccessor.name) {
            throw Error("The class name is not defined");
        }
        if (context.instanceName !== classNameCodeAccessor.name) {
            return;
        }
        if (context.mode === 'Module') {
            if (!node.heritageClauses) {
                return;
            }
            let implementRegistration = false;
            for (const heritageClause of node.heritageClauses) {
                const inheritCodeAccessor = this.visitNext(heritageClause, context);
                if (inheritCodeAccessor && inheritCodeAccessor.name) {
                    implementRegistration = true;
                    break;
                }
            }
            if (!implementRegistration) {
                return;
            }
        }
        else if (context.mode !== 'Dependent') {
            return;
        }
        for (const member of node.members) {
            this.visitNext(member, context);
        }
    }
}
exports.default = ClassDeclarationVisitor;
