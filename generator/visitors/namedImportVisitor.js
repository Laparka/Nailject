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
                alias: importSpecifierAccessor.child ? importSpecifierAccessor.child.name : importSpecifierAccessor.name,
                relativePath: path.parse(context.modulePath).dir
            });
        }
        return specifiers;
    }
}
exports.default = NamedImportVisitor;
