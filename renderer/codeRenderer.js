"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiquidCodeRenderer = void 0;
const liquidjs_1 = require("liquidjs");
const templateFilters_1 = require("./templateFilters");
const path_1 = __importDefault(require("path"));
const resolverTemplatePath = path_1.default.join(__dirname, 'templates', 'resolver.liquid');
const serviceProviderTemplatePath = path_1.default.join(__dirname, 'templates', 'serviceProvider.liquid');
class LiquidCodeRenderer {
    constructor(codeWriter) {
        this._codeWriter = codeWriter;
        this._liquid = new liquidjs_1.Liquid();
        this._liquid.registerFilter('read_accessor', templateFilters_1.readAccessor);
        this._liquid.registerFilter('get_imports', templateFilters_1.getImports);
        this._liquid.registerFilter('write_import', templateFilters_1.writeImport);
    }
    renderResolver(registration, outputDir) {
        if (!registration) {
            throw Error(`The registration argument is missing`);
        }
        if (!outputDir) {
            throw Error(`The output directory argument is missing`);
        }
        const fileImportName = `generated.${LiquidCodeRenderer.getRegistrationName(registration)}`;
        const outputFilePath = path_1.default.join(outputDir, `${fileImportName}.ts`);
        const clonedRegistration = JSON.parse(JSON.stringify(registration));
        const content = this._liquid.renderFileSync(resolverTemplatePath, { registration: clonedRegistration, outputDir: outputDir });
        this._codeWriter.write(outputFilePath, content);
        return fileImportName;
    }
    renderServiceProvider(resolvers, outputDirectory) {
        if (!resolvers) {
            throw Error(`The service resolver files path argument is missing`);
        }
        if (!outputDirectory) {
            throw Error(`The output directory argument is missing`);
        }
        const outputFilePath = path_1.default.join(outputDirectory, `generated.serviceProvider.ts`);
        const content = this._liquid.renderFileSync(serviceProviderTemplatePath, { resolvers: resolvers });
        this._codeWriter.write(outputFilePath, content);
        return outputFilePath;
    }
    static getRegistrationName(registration) {
        const tokens = [];
        if (registration.service && registration.service.accessor) {
            tokens.push(LiquidCodeRenderer.getAccessorName(registration.service.accessor));
        }
        if (registration.instance && registration.instance.accessor) {
            tokens.push(LiquidCodeRenderer.getAccessorName(registration.instance.accessor));
        }
        return tokens.join('Of');
    }
    static getAccessorName(accessor) {
        const tokens = [];
        if (accessor.name === '[]') {
            tokens.push('Array');
            if (accessor.child) {
                accessor = accessor.child;
            }
        }
        if (accessor.importFrom) {
            tokens.push(accessor.importFrom.normalized.name);
        }
        else {
            tokens.push(accessor.name);
        }
        if (accessor.child) {
            tokens.push(LiquidCodeRenderer.getAccessorName(accessor.child));
        }
        else if (accessor.typeNames && accessor.typeNames.length !== 0) {
            tokens.push(...accessor.typeNames.map(t => LiquidCodeRenderer.getAccessorName(t)));
        }
        return tokens.join('Of');
    }
}
exports.LiquidCodeRenderer = LiquidCodeRenderer;
