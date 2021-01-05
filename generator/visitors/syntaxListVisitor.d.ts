import { Node, SyntaxList } from 'typescript';
import { NodeVisitorBase } from './nodeVisitor';
import { GeneratorContext } from '../generatorContext';
export default class SyntaxListVisitor extends NodeVisitorBase<SyntaxList> {
    canVisit(node: Node): boolean;
    doVisit(node: SyntaxList, context: GeneratorContext): void;
}
