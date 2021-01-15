import { NodeVisitorBase } from './nodeVisitor';
import { ImportDeclaration, Node } from 'typescript';
import { GeneratorContext } from '../generatorContext';
export default class ImportDeclarationVisitor extends NodeVisitorBase<ImportDeclaration> {
    canVisit(node: Node): boolean;
    doVisit(node: ImportDeclaration, context: GeneratorContext): void;
}
