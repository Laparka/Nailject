import { NodeVisitorBase } from './nodeVisitor';
import { MethodDeclaration, Node } from 'typescript';
import { GeneratorContext } from '../generatorContext';
export default class MethodDeclarationVisitor extends NodeVisitorBase<MethodDeclaration> {
    canVisit(node: Node): boolean;
    doVisit(node: MethodDeclaration, context: GeneratorContext): void;
}
