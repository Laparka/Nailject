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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_1 = require("typescript");
const path = __importStar(require("path"));
const fs_1 = require("fs");
const anyNodeVisitor_1 = __importDefault(require("./visitors/anyNodeVisitor"));
const utils_1 = require("./utils");
class RegistrationsParser {
    constructor() {
        this._visitor = new anyNodeVisitor_1.default();
    }
    parse(registrationFilePath, className) {
        const registrations = [];
        this._visitor.visit(RegistrationsParser.getSyntax(registrationFilePath), {
            modulePath: registrationFilePath,
            instanceName: className,
            mode: 'Module',
            registrations: registrations,
            imports: []
        });
        this.fillDependencies(path.parse(registrationFilePath).dir, registrations);
        return registrations;
    }
    fillDependencies(moduleDir, registrations) {
        for (const registration of registrations) {
            if (!registration.instance || !registration.instance.importFrom) {
                continue;
            }
            const filePath = `${path.join(moduleDir, registration.instance.importFrom.path)}.ts`;
            if (!fs_1.existsSync(path.normalize(filePath))) {
                continue;
            }
            const dependencies = [];
            this._visitor.visit(RegistrationsParser.getSyntax(filePath), {
                modulePath: filePath,
                instanceName: utils_1.getLastPropertyAccessor(registration.instance.accessor),
                mode: 'Dependent',
                registrations: dependencies,
                imports: []
            });
            if (dependencies.length === 0) {
                continue;
            }
            dependencies.forEach(ctorArg => {
                const ctorArgDescriptor = {
                    isCollection: ctorArg.service.accessor.name === '[]',
                    symbolDescriptor: ctorArg.service.symbolDescriptor
                };
                registration.instance.constructorArgs.push(ctorArgDescriptor);
            });
        }
    }
    static getSyntax(filePath) {
        if (!fs_1.existsSync(path.normalize(filePath))) {
            throw Error(`File ${filePath} was not found`);
        }
        const fileContent = fs_1.readFileSync(filePath, { encoding: "utf8" });
        const file = typescript_1.createSourceFile("inline-content.ts", fileContent.toString(), typescript_1.ScriptTarget.ES2017);
        return file.getChildAt(0);
    }
}
exports.default = RegistrationsParser;
