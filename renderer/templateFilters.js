"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeImport = exports.getImports = exports.readAccessor = void 0;
const path_1 = __importDefault(require("path"));
function readAccessor(pathAccessor, includeGenericArgs) {
    const tokens = [];
    if (pathAccessor.name === '[]') {
        if (pathAccessor.child) {
            return readAccessor(pathAccessor.child, includeGenericArgs);
        }
        return '[]';
    }
    if (pathAccessor.importFrom) {
        tokens.push(pathAccessor.importFrom.normalized.name);
        if (pathAccessor.importFrom.raw.kind === 'Namespace' && pathAccessor.child) {
            pathAccessor = pathAccessor.child;
        }
    }
    else {
        tokens.push(pathAccessor.name);
    }
    const typeArgs = [];
    if (pathAccessor.child) {
        tokens.push(readAccessor(pathAccessor.child, includeGenericArgs));
    }
    else if (includeGenericArgs && pathAccessor.typeNames && pathAccessor.typeNames.length !== 0) {
        pathAccessor.typeNames.forEach(t => typeArgs.push(readAccessor(t, includeGenericArgs)));
    }
    if (typeArgs.length !== 0) {
        tokens[tokens.length - 1] = `${tokens[tokens.length - 1]}<${typeArgs.join(', ')}>`;
    }
    return tokens.join('.');
}
exports.readAccessor = readAccessor;
function getImports(registration) {
    const importsByPath = new Map();
    collectImports(registration.service.accessor, importsByPath);
    if (registration.service.symbolDescriptor) {
        collectImports(registration.service.symbolDescriptor, importsByPath);
    }
    if (registration.instance) {
        collectImports(registration.instance.accessor, importsByPath);
        if (registration.instance.constructorArgs) {
            registration.instance.constructorArgs.forEach(ctor => collectImports(ctor.symbolDescriptor, importsByPath));
        }
    }
    const imports = [];
    const iterator = importsByPath.keys();
    let keyAccessor = iterator.next();
    while (keyAccessor && !keyAccessor.done) {
        const pathImports = importsByPath.get(keyAccessor.value);
        if (!pathImports) {
            continue;
        }
        imports.push(...pathImports);
        keyAccessor = iterator.next();
    }
    return imports;
}
exports.getImports = getImports;
function writeImport(importFrom, outputDir) {
    if (!importFrom) {
        throw Error(`Import argument is missing`);
    }
    if (!outputDir) {
        throw Error(`Output dir argument is missing`);
    }
    let importPath = importFrom.path;
    if (!importFrom.isExternal) {
        importPath = path_1.default.relative(outputDir, importPath).replace(/[\\]/g, '/');
    }
    switch (importFrom.kind) {
        case 'Default': {
            return `import ${importFrom.name} from '${importPath}';`;
        }
    }
    if (importFrom.name === importFrom.alias) {
        return `import { ${importFrom.name} } from '${importPath}';`;
    }
    return `import { ${importFrom.name} as ${importFrom.alias} } from '${importPath}';`;
}
exports.writeImport = writeImport;
function collectImports(accessor, importsByPath) {
    if (accessor.importFrom) {
        setImport(accessor.importFrom.normalized, importsByPath);
    }
    if (accessor.child) {
        collectImports(accessor.child, importsByPath);
    }
    if (accessor.typeNames && accessor.typeNames.length !== 0) {
        accessor.typeNames.forEach(t => collectImports(t, importsByPath));
    }
}
function setImport(importFrom, importsByPath) {
    let pathImports = importsByPath.get(importFrom.path);
    if (!pathImports) {
        pathImports = [];
        importsByPath.set(importFrom.path, pathImports);
    }
    if (pathImports.findIndex(i => i.name === importFrom.name) === -1) {
        pathImports.push(importFrom);
    }
}
