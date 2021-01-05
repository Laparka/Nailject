import { NodeVisitorBase } from './nodeVisitor';
import { ImportClause, Node } from 'typescript';
import { GeneratorContext, ImportFrom } from '../generatorContext';
export default class ImportClauseVisitor extends NodeVisitorBase<ImportClause> {
    canVisit(node: Node): boolean;
    doVisit(node: ImportClause, context: GeneratorContext): ImportFrom[];
}
