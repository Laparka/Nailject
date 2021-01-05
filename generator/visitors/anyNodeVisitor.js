"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const syntaxListVisitor_1 = __importDefault(require("./syntaxListVisitor"));
const importDeclarationVisitor_1 = __importDefault(require("./importDeclarationVisitor"));
const importClauseVisitor_1 = __importDefault(require("./importClauseVisitor"));
const stringLiteralVisitor_1 = __importDefault(require("./stringLiteralVisitor"));
const namespaceImportVisitor_1 = __importDefault(require("./namespaceImportVisitor"));
const identifierVisitor_1 = __importDefault(require("./identifierVisitor"));
const namedImportVisitor_1 = __importDefault(require("./namedImportVisitor"));
const importSpecifierVisitor_1 = __importDefault(require("./importSpecifierVisitor"));
const classDeclarationVisitor_1 = __importDefault(require("./classDeclarationVisitor"));
const heritageClauseVisitor_1 = __importDefault(require("./heritageClauseVisitor"));
const typeArgumentVisitor_1 = __importDefault(require("./typeArgumentVisitor"));
const typeReferenceVisitor_1 = __importDefault(require("./typeReferenceVisitor"));
const propertyAccessExpressionVisitor_1 = __importDefault(require("./propertyAccessExpressionVisitor"));
const methodDeclarationVisitor_1 = __importDefault(require("./methodDeclarationVisitor"));
const parameterVisitor_1 = __importDefault(require("./parameterVisitor"));
const expressionStatementVisitor_1 = __importDefault(require("./expressionStatementVisitor"));
const callExpressionVisitor_1 = __importDefault(require("./callExpressionVisitor"));
const qualifiedNameVisitor_1 = __importDefault(require("./qualifiedNameVisitor"));
const constructorVisitor_1 = __importDefault(require("./constructorVisitor"));
const primitiveTypeVisitor_1 = __importDefault(require("./primitiveTypeVisitor"));
const arrayTypeVisitor_1 = __importDefault(require("./arrayTypeVisitor"));
class AnyNodeVisitor {
    constructor() {
        this._visitors = [
            new syntaxListVisitor_1.default(this),
            new importDeclarationVisitor_1.default(this),
            new importClauseVisitor_1.default(this),
            new stringLiteralVisitor_1.default(this),
            new namespaceImportVisitor_1.default(this),
            new identifierVisitor_1.default(this),
            new namedImportVisitor_1.default(this),
            new importSpecifierVisitor_1.default(this),
            new classDeclarationVisitor_1.default(this),
            new heritageClauseVisitor_1.default(this),
            new typeArgumentVisitor_1.default(this),
            new typeReferenceVisitor_1.default(this),
            new propertyAccessExpressionVisitor_1.default(this),
            new methodDeclarationVisitor_1.default(this),
            new parameterVisitor_1.default(this),
            new expressionStatementVisitor_1.default(this),
            new callExpressionVisitor_1.default(this),
            new qualifiedNameVisitor_1.default(this),
            new constructorVisitor_1.default(this),
            new primitiveTypeVisitor_1.default(),
            new arrayTypeVisitor_1.default(this)
        ];
    }
    canVisit(node) {
        return true;
    }
    visit(node, context) {
        for (const visitor of this._visitors) {
            if (visitor.canVisit(node)) {
                return visitor.visit(node, context);
            }
        }
    }
}
exports.default = AnyNodeVisitor;
