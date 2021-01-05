import { NodeVisitorBase } from './nodeVisitor';
import { ImportSpecifier, Node } from 'typescript';
import { GeneratorContext, CodeAccessor } from '../generatorContext';
export default class ImportSpecifierVisitor extends NodeVisitorBase<ImportSpecifier> {
    canVisit(node: Node): boolean;
    doVisit(node: ImportSpecifier, context: GeneratorContext): CodeAccessor;
}
