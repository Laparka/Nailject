import { NodeVisitorBase } from './nodeVisitor';
import { NamespaceImport, Node } from 'typescript';
import { GeneratorContext, ImportFrom } from '../generatorContext';
export default class NamespaceImportVisitor extends NodeVisitorBase<NamespaceImport> {
    canVisit(node: Node): boolean;
    doVisit(node: NamespaceImport, context: GeneratorContext): ImportFrom[];
}
