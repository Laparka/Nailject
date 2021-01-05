import { NodeVisitorBase } from './nodeVisitor';
import { Node, TypeReferenceNode } from 'typescript';
import { GeneratorContext, CodeAccessor } from '../generatorContext';
export default class TypeReferenceVisitor extends NodeVisitorBase<TypeReferenceNode> {
    canVisit(node: Node): boolean;
    doVisit(node: TypeReferenceNode, context: GeneratorContext): CodeAccessor;
}
