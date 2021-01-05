"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodeVisitor_1 = require("./nodeVisitor");
const typescript_1 = require("typescript");
const path = __importStar(require("path"));
const fs_1 = require("fs");
class ImportDeclarationVisitor extends nodeVisitor_1.NodeVisitorBase {
    canVisit(node) {
        return node.kind === typescript_1.SyntaxKind.ImportDeclaration;
    }
    doVisit(node, context) {
        if (!node.importClause) {
            return;
        }
        const importClause = this.visitNext(node.importClause, context);
        if (!importClause) {
            throw Error("The ImportDeclaration has ImportClause missing");
        }
        const pathSpecifier = this.visitNext(node.moduleSpecifier, context);
        if (!pathSpecifier || !pathSpecifier.name) {
            throw Error("ImportDeclaration From-path must be the only one in the list");
        }
        const moduleDir = path.parse(context.modulePath).dir;
        const importPath = `${path.join(moduleDir, pathSpecifier.name)}.ts`;
        const isExternal = pathSpecifier.name[0] !== '.' && pathSpecifier.name[0] !== '/'
            || !fs_1.existsSync(importPath);
        importClause.forEach(i => {
            i.isExternal = isExternal;
            i.path = pathSpecifier.name;
            context.imports.push(i);
        });
    }
}
exports.default = ImportDeclarationVisitor;
