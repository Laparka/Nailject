"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodeVisitor_1 = require("./nodeVisitor");
const typescript_1 = require("typescript");
class ImportSpecifierVisitor extends nodeVisitor_1.NodeVisitorBase {
    canVisit(node) {
        return node.kind === typescript_1.SyntaxKind.ImportSpecifier;
    }
    doVisit(node, context) {
        let propertyName = null;
        if (node.propertyName) {
            const propertyNameAccessor = this.visitNext(node.propertyName, context);
            if (!propertyNameAccessor || !propertyNameAccessor.name) {
                throw Error("The import specifier property name is not defined");
            }
            propertyName = propertyNameAccessor;
        }
        const name = this.visitNext(node.name, context);
        if (!name || !name.name) {
            throw Error("The import specifier name is not defined");
        }
        let typeName = name.name;
        let child;
        if (propertyName) {
            typeName = propertyName.name;
            child = name;
        }
        return {
            name: typeName,
            child: child
        };
    }
}
exports.default = ImportSpecifierVisitor;
