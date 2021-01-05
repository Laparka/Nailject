import { NodeVisitorBase } from './nodeVisitor';
import { Node, StringLiteral } from 'typescript';
import { GeneratorContext, CodeAccessor } from '../generatorContext';
export default class StringLiteralVisitor extends NodeVisitorBase<StringLiteral> {
    canVisit(node: Node): boolean;
    doVisit(node: StringLiteral, context: GeneratorContext): CodeAccessor;
}
