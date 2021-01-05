import { NodeVisitorBase } from './nodeVisitor';
import { ExpressionStatement, Node } from 'typescript';
import { GeneratorContext } from '../generatorContext';
export default class ExpressionStatementVisitor extends NodeVisitorBase<ExpressionStatement> {
    canVisit(node: Node): boolean;
    doVisit(node: ExpressionStatement, context: GeneratorContext): void;
}
