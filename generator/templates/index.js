"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceProviderTemplate = exports.symbolsTemplate = exports.resolverTemplate = void 0;
exports.resolverTemplate = '' +
    '{%- for import in registration.imports -%}\n' +
    '{{ import | toImport: outputDir }}\n' +
    '{% endfor %}\n' +
    'import { TYPES as __SERVICE_TYPE_SYMBOLS } from \'./types.generated\';\n' +
    'import { {{ registration.scope }}ServiceResolver, InstanceConstructor, ServiceResolver } from \'pileuple/api/serviceResolver\';\n' +
    'import { ServiceProvider } from \'pileuple/api/serviceProvider\';\n' +
    '\n' +
    'class Resolver extends {{ registration.scope }}ServiceResolver<{{registration.service.accessorDeclaration}}> {\n' +
    '    doResolve(serviceProvider: ServiceProvider): {{registration.service.accessorDeclaration}} {\n' +
    '        const ctor: InstanceConstructor<{{ registration.instance.accessorDeclaration }}> = {{ registration.instance.instanceTypeDefinition }};\n' +
    '        const ctorArgs: any[] = [];\n' +
    '{%- capture dependencies -%}\n' +
    '        {%- for ctorSymbol in registration.instance.constructorArgs -%}\n' +
    '            {%- capture ctorServiceStatement -%}\n' +
    '                {%- if ctorSymbol.isCollection == true -%}\n' +
    '        ctorArgs.push(serviceProvider.resolveMany(__SERVICE_TYPE_SYMBOLS.{{ ctorSymbol.symbolDescriptor | toSymbolPath }}));\n' +
    '                {%- else -%}\n' +
    '        ctorArgs.push(serviceProvider.resolveOne(__SERVICE_TYPE_SYMBOLS.{{ ctorSymbol.symbolDescriptor | toSymbolPath }}));\n' +
    '                {%- endif -%}\n' +
    '            {% endcapture %}\n' +
    '        {{ ctorServiceStatement }}\n' +
    '        {%- endfor -%}\n' +
    '{% endcapture -%}\n' +
    '        {{ dependencies }}\n' +
    '        return new ctor(...ctorArgs);\n' +
    '    }\n' +
    '}\n' +
    '\n' +
    'export function register(resolvers: Map<symbol, ServiceResolver[]>) {\n' +
    '    const symbol = __SERVICE_TYPE_SYMBOLS.{{ registration.service.symbolDescriptor | toSymbolPath }};\n' +
    '    let symbolResolvers = resolvers.get(symbol);\n' +
    '    if (!symbolResolvers) {\n' +
    '        symbolResolvers = [];\n' +
    '        resolvers.set(symbol, symbolResolvers);\n' +
    '    }\n' +
    '\n' +
    '    symbolResolvers.push(new Resolver());\n' +
    '}';
exports.symbolsTemplate = 'export const TYPES = {\n' +
    '{%- for namespace in namespaces -%}\n' +
    '{% if namespace == "" %}\n' +
    '    undefined_namespace: {\n' +
    '{% else %}\n' +
    '    {{ namespace }}: {\n' +
    '{%- endif -%}\n' +
    '    {%- assign namespaceSymbols = symbols | where: "symbolNamespace", namespace -%}\n' +
    '        {% for symbol in namespaceSymbols %}\n' +
    '        {{ symbol.symbolId }}: Symbol.for("{{ namespace }}.{{ symbol.symbolId }}")\n' +
    '        {%- if forloop.index != namespaceSymbols.size -%},{%-endif -%}\n' +
    '        {% endfor %}\n' +
    '    }\n' +
    '    {%- if forloop.index != namespaces.size -%},{%-endif -%}\n' +
    '{% endfor %}\n' +
    '}';
exports.serviceProviderTemplate = '{%- for resolver in resolvers -%}\n' +
    'import { register as register{{ forloop.index }} } from \'./{{ resolver }}\';\n' +
    '{% endfor %}\n' +
    'import { ServiceProvider, CompiledServiceProvider } from \'pileuple/api/serviceProvider\';\n' +
    'import { ServiceResolver } from \'pileuple/api/serviceResolver\';\n' +
    '\n' +
    'const symbolResolvers = new Map<symbol, ServiceResolver[]>();\n' +
    '{% for resolver in resolvers %}\n' +
    'register{{ forloop.index }}(symbolResolvers);\n' +
    '{%- endfor -%}\n' +
    '{{ dummy }}\n' +
    'export const serviceProvider: ServiceProvider = CompiledServiceProvider.initialize(symbolResolvers);';
