import { Node } from 'typescript';
import { NodeVisitor } from './nodeVisitor';
import { GeneratorContext } from '../generatorContext';
export default class AnyNodeVisitor implements NodeVisitor {
    private readonly _visitors;
    constructor();
    canVisit(): boolean;
    visit(node: Node, context: GeneratorContext): unknown;
}
