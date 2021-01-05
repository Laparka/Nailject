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
                    isExternal: false,
                    relativePath: path.parse(context.modulePath).dir
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
