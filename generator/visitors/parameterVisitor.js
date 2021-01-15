"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodeVisitor_1 = require("./nodeVisitor");
const typescript_1 = require("typescript");
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
        const objectCallerName = this.visitNext(node.name, context);
        if (!objectCallerName) {
            throw Error(`Failed to parse the method-object callee-instance name.`);
        }
        const containerBuilderInstanceName = objectCallerName.name;
        const typeAccessor = this.visitNext(node.type, context);
        if (!typeAccessor) {
            throw Error(`The register argument ${containerBuilderInstanceName} type was not recognized`);
        }
        if (!typeAccessor.importFrom || typeAccessor.importFrom.normalized.name !== 'ContainerBuilder') {
            throw Error(`The register argument ${containerBuilderInstanceName} must be of the ContainerBuilder-type`);
        }
        context.instanceName = containerBuilderInstanceName;
        return {
            child: typeAccessor,
            name: containerBuilderInstanceName
        };
    }
    getConstructorArgType(node, context) {
        if (!node.type) {
            throw Error(`The constructor argument ${node.name} has no type defined`);
        }
        const argTypeAccessor = this.visitNext(node.type, context);
        if (!argTypeAccessor || !argTypeAccessor.name) {
            throw Error(`Failed to find the constructor argument type`);
        }
        context.registrations.push({
            service: {
                accessor: argTypeAccessor
            },
            scope: 'Transient'
        });
        return argTypeAccessor;
    }
}
exports.default = ParameterVisitor;
