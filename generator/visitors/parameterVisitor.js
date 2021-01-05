"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodeVisitor_1 = require("./nodeVisitor");
const typescript_1 = require("typescript");
const utils_1 = require("../utils");
const filters_1 = require("../templates/filters");
class ParameterVisitor extends nodeVisitor_1.NodeVisitorBase {
    canVisit(node) {
        return node.kind === typescript_1.SyntaxKind.Parameter;
    }
    doVisit(node, context) {
        if (context.mode === 'Module') {
            return this.getRegisterArgType(node, context);
        }
        if (context.mode === 'Dependent') {
            return this.getConstructorArgType(node, context);
        }
        throw Error(`The parameter declaration is not supported`);
    }
    getRegisterArgType(node, context) {
        if (!node.type) {
            throw Error(`The register-method argument parameter type is required`);
        }
        const nameTokens = this.visitNext(node.name, context);
        if (!nameTokens) {
            throw Error(`Invalid method-parameter name. Only register-method parameters are supported`);
        }
        const argumentName = nameTokens.name;
        const typeTokens = this.visitNext(node.type, context);
        if (!typeTokens) {
            throw Error(`The register argument ${argumentName} type was not recognized`);
        }
        const typeName = typeTokens.name;
        const typeAccessor = typeTokens.child;
        const importType = utils_1.tryFindImportType(typeName, context.imports);
        if (!importType) {
            throw Error(`The register argument ${argumentName} type was not found in imports`);
        }
        if (importType.name !== 'ContainerBuilder' && importType.alias !== 'ContainerBuilder') {
            throw Error(`The register argument ${argumentName} must be of the ContainerBuilder-type`);
        }
        context.instanceName = argumentName;
        return {
            child: typeAccessor,
            name: argumentName,
            typeNames: []
        };
    }
    getConstructorArgType(node, context) {
        if (!node.type) {
            throw Error(`The constructor argument ${node.name} has no type defined`);
        }
        const parameterAccessor = this.visitNext(node.type, context);
        if (!parameterAccessor || !parameterAccessor.name) {
            throw Error(`Failed to find the constructor argument type`);
        }
        const usedImports = [];
        const importType = utils_1.addUsedImports(parameterAccessor, context.imports, usedImports);
        let symbolNamespace = "";
        if (importType) {
            symbolNamespace = utils_1.toNamespace(filters_1.getFullPath(importType.relativePath, importType.path));
        }
        context.registrations.push({
            service: {
                accessor: parameterAccessor,
                importFrom: importType,
                displayName: utils_1.getSymbolName(parameterAccessor, context.imports),
                symbolDescriptor: {
                    symbolId: utils_1.getSymbolName(parameterAccessor, usedImports),
                    symbolNamespace: symbolNamespace
                },
                accessorDeclaration: utils_1.getAccessorDeclaration(parameterAccessor, context.imports)
            },
            instance: null,
            imports: null,
            scope: 'Transient'
        });
        return parameterAccessor;
    }
}
exports.default = ParameterVisitor;
