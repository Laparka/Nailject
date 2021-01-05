import { NodeVisitorBase } from './nodeVisitor';
import { Node, PropertyAccessExpression } from 'typescript';
import { GeneratorContext, CodeAccessor } from '../generatorContext';
export default class PropertyAccessExpressionVisitor extends NodeVisitorBase<PropertyAccessExpression> {
    canVisit(node: Node): boolean;
    doVisit(node: PropertyAccessExpression, context: GeneratorContext): CodeAccessor;
}
