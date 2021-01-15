import { NodeVisitorBase } from './nodeVisitor';
import { ExpressionWithTypeArguments, Node, TypeReferenceNode } from 'typescript';
import { GeneratorContext, CodeAccessor } from '../generatorContext';
export declare class TypeReferenceVisitor extends NodeVisitorBase<TypeReferenceNode> {
    canVisit(node: Node): boolean;
    doVisit(node: TypeReferenceNode, context: GeneratorContext): CodeAccessor;
}
export declare class TypeArgumentVisitor extends NodeVisitorBase<ExpressionWithTypeArguments> {
    canVisit(node: Node): boolean;
    doVisit(node: ExpressionWithTypeArguments, context: GeneratorContext): CodeAccessor | void;
}
