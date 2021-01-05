import { NodeVisitorBase } from './nodeVisitor';
import { ConstructorDeclaration, Node } from 'typescript';
import { GeneratorContext } from '../generatorContext';
export default class ConstructorVisitor extends NodeVisitorBase<ConstructorDeclaration> {
    canVisit(node: Node): boolean;
    doVisit(node: ConstructorDeclaration, context: GeneratorContext): void;
}
