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
exports.toSymbolPath = exports.toImportFilter = exports.getRelativePath = exports.getFullPath = void 0;
const path = __importStar(require("path"));
function getFullPath(modulePath, relativePath) {
    return path.join(modulePath, relativePath);
}
exports.getFullPath = getFullPath;
function getRelativePath(outputDir, importFrom) {
    const fullPath = getFullPath(importFrom.relativePath, importFrom.path);
    const relativePath = path.relative(outputDir, fullPath).replace(/[\\]/g, '/');
    return relativePath;
}
exports.getRelativePath = getRelativePath;
function toImportFilter(importFrom, outputDir) {
    const importPath = getRelativePath(outputDir, importFrom);
    switch (importFrom.kind) {
        case 'Default': {
            return `import ${importFrom.name} from '${importPath}';`;
        }
        case 'Named': {
            return `import { ${importFrom.name} as ${importFrom.alias} } from '${importPath}';`;
        }
        case 'Namespace': {
            return `import * as ${importFrom.alias} from '${importPath}';`;
        }
    }
    throw Error(`The import-kind is not supported`);
}
exports.toImportFilter = toImportFilter;
function toSymbolPath(symbolDescriptor) {
    const symbolPath = [];
    if (symbolDescriptor.symbolNamespace.length !== 0) {
        symbolPath.push(symbolDescriptor.symbolNamespace);
    }
    symbolPath.push(symbolDescriptor.symbolId);
    return symbolPath.join('.');
}
exports.toSymbolPath = toSymbolPath;
