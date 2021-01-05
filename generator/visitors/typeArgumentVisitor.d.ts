import { NodeVisitorBase } from './nodeVisitor';
import { ExpressionWithTypeArguments, Node } from 'typescript';
import { GeneratorContext, CodeAccessor } from '../generatorContext';
export default class TypeArgumentVisitor extends NodeVisitorBase<ExpressionWithTypeArguments> {
    canVisit(node: Node): boolean;
    doVisit(node: ExpressionWithTypeArguments, context: GeneratorContext): CodeAccessor | void;
}
