import { NodeVisitorBase } from './nodeVisitor';
import { CallExpression, Node } from 'typescript';
import { GeneratorContext } from '../generatorContext';
export default class CallExpressionVisitor extends NodeVisitorBase<CallExpression> {
    canVisit(node: Node): boolean;
    doVisit(node: CallExpression, context: GeneratorContext): void;
}
