import { NodeVisitorBase } from './nodeVisitor';
import { NamedImports, Node } from 'typescript';
import { GeneratorContext, ImportFrom } from '../generatorContext';
export default class NamedImportVisitor extends NodeVisitorBase<NamedImports> {
    canVisit(node: Node): boolean;
    doVisit(node: NamedImports, context: GeneratorContext): ImportFrom[];
}
