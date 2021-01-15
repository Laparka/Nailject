"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeAccessor = exports.getRelativePath = exports.getFullPath = void 0;
const path_1 = __importDefault(require("path"));
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
function getNormalizedImport(pathAccessor, rawImport) {
    if (!pathAccessor) {
        throw Error(`The path accessor is missing`);
    }
    if (!rawImport) {
        return null;
    }
    /*
    * import Logger from './';
    * import {Logger as Shlogger} from './';
    * import * as S from './';
    * const a: S.Logger = {};
    * const b: Shlogger = {};
    * const c: Logger = {};
    */
    const clone = JSON.parse(JSON.stringify(rawImport));
    switch (clone.kind) {
        case 'Namespace': {
            if (!pathAccessor.child) {
                throw Error(`The property accessor must have a child property when a namespace-import is used`);
            }
            clone.kind = 'Named';
            clone.name = pathAccessor.child.name;
            clone.alias = clone.name;
            break;
        }
        case 'Named': {
            clone.alias = clone.name;
            clone.kind = 'Named';
            break;
        }
    }
    return clone;
}
function normalizeAccessor(pathAccessor, imports) {
    if (!pathAccessor) {
        throw Error(`The path accessor argument is missing`);
    }
    if (!imports) {
        throw Error(`The list of imports argument is missing`);
    }
    const importIndex = imports.findIndex(i => i.alias === pathAccessor.name);
    if (importIndex === -1) {
        return;
    }
    const normalizedImport = getNormalizedImport(pathAccessor, imports[importIndex]);
    if (!normalizedImport) {
        throw Error(`Unexpected error. Failed to normalize the import declaration ${imports[importIndex].name} for the type reference ${pathAccessor.name}`);
    }
    pathAccessor.importFrom = {
        raw: imports[importIndex],
        normalized: normalizedImport
    };
}
exports.normalizeAccessor = normalizeAccessor;
