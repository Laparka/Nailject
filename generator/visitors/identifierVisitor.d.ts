import { NodeVisitorBase } from './nodeVisitor';
import { Identifier, Node } from 'typescript';
import { GeneratorContext, CodeAccessor } from '../generatorContext';
export default class IdentifierVisitor extends NodeVisitorBase<Identifier> {
    canVisit(node: Node): boolean;
    doVisit(node: Identifier, context: GeneratorContext): CodeAccessor;
}
