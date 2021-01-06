"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRelativePath = exports.getFullPath = exports.getAccessorDeclaration = exports.getSymbolName = exports.toNamespace = exports.tryFindImportType = exports.addUsedImports = exports.getLastPropertyAccessor = void 0;
const path_1 = __importDefault(require("path"));
const ALPHA = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '_'];
const NUMERIC = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
function getLastPropertyAccessor(node) {
    if (node.child) {
        return getLastPropertyAccessor(node.child);
    }
    return node.name;
}
exports.getLastPropertyAccessor = getLastPropertyAccessor;
function addUsedImports(node, imports, usedImports, skipChild) {
    if (node.name === '[]') {
        if (!node.child) {
            throw Error('The array type must have the element type object');
        }
        return addUsedImports(node.child, imports, usedImports);
    }
    let usedImport = tryFindImportType(node.name, usedImports);
    if (!usedImport) {
        usedImport = tryFindImportType(node.name, imports);
        if (!usedImport) {
            return null;
        }
        usedImports.push(usedImport);
    }
    if (!skipChild && !usedImport && node.child) {
        addUsedImports(node.child, imports, usedImports, true);
    }
    if (node.typeNames) {
        for (const typeName of node.typeNames) {
            addUsedImports(typeName, imports, usedImports);
        }
    }
    return usedImport;
}
exports.addUsedImports = addUsedImports;
function tryFindImportType(importName, imports) {
    if (imports) {
        const index = imports.findIndex(_ => _.alias === importName);
        if (index >= 0) {
            return imports[index];
        }
    }
    return null;
}
exports.tryFindImportType = tryFindImportType;
function toNamespace(path) {
    const result = [];
    for (const ch of path) {
        if (ALPHA.findIndex(_ => _ === ch) >= 0 || NUMERIC.findIndex(_ => _ === ch) >= 0) {
            result.push(ch);
        }
    }
    if (result.length === 0 || result[0] !== '_') {
        return '_' + result.join('');
    }
    return result.join('');
}
exports.toNamespace = toNamespace;
function getSymbolName(node, imports) {
    const nameTokens = [];
    if (node.name !== '[]') {
        const imported = tryFindImportType(node.name, imports);
        let name = node.name;
        if (imported && node.name === imported.alias) {
            name = imported.name;
        }
        if (name !== '*') {
            nameTokens.push(name);
        }
    }
    if (node.child) {
        // Alias accessor
        nameTokens.push(getSymbolName(node.child, imports));
    }
    if (node.typeNames && node.typeNames.length !== 0) {
        node.typeNames.forEach(n => nameTokens.push(getSymbolName(n, imports)));
    }
    return nameTokens.join('Of');
}
exports.getSymbolName = getSymbolName;
function getAccessorDeclaration(codeAccessor, imports) {
    let name = codeAccessor.name;
    if (name === '[]') {
        if (codeAccessor.child) {
            return `${getAccessorDeclaration(codeAccessor.child, imports)}[]`;
        }
    }
    const genericArgs = [];
    if (codeAccessor.child) {
        name = `${name}.${getAccessorDeclaration(codeAccessor.child, imports)}`;
    }
    else if (codeAccessor.typeNames && codeAccessor.typeNames.length !== 0) {
        codeAccessor.typeNames.forEach(n => genericArgs.push(getAccessorDeclaration(n, imports)));
    }
    if (genericArgs.length === 0) {
        return name;
    }
    return `${name}<${genericArgs.join(', ')}>`;
}
exports.getAccessorDeclaration = getAccessorDeclaration;
function getFullPath(basePath, relativePath) {
    return path_1.default.join(basePath, relativePath).replace(/[\\]/g, '/');
}
exports.getFullPath = getFullPath;
function getRelativePath(outputDir, importFrom) {
    if (!importFrom.isExternal) {
        const relativePath = path_1.default.relative(outputDir, importFrom.path).replace(/[\\]/g, '/');
        return `./${relativePath}`;
    }
    return importFrom.path;
}
exports.getRelativePath = getRelativePath;
