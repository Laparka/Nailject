import { NodeVisitorBase } from './nodeVisitor';
import { ArrayTypeNode, Node } from 'typescript';
import { GeneratorContext, CodeAccessor } from '../generatorContext';
export default class ArrayTypeVisitor extends NodeVisitorBase<ArrayTypeNode> {
    canVisit(node: Node): boolean;
    doVisit(node: ArrayTypeNode, context: GeneratorContext): CodeAccessor;
}
