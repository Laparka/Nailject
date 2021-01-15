import { NodeVisitorBase } from './nodeVisitor';
import { HeritageClause, Node } from 'typescript';
import { GeneratorContext, CodeAccessor } from '../generatorContext';
export default class HeritageClauseVisitor extends NodeVisitorBase<HeritageClause> {
    canVisit(node: Node): boolean;
    doVisit(node: HeritageClause, context: GeneratorContext): CodeAccessor | void;
}
