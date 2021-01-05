import { NodeVisitorBase } from './nodeVisitor';
import { ClassDeclaration, Node } from 'typescript';
import { GeneratorContext } from '../generatorContext';
export default class ClassDeclarationVisitor extends NodeVisitorBase<ClassDeclaration> {
    canVisit(node: Node): boolean;
    doVisit(node: ClassDeclaration, context: GeneratorContext): void;
}
