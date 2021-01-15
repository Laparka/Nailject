import { GeneratorContext } from '../generatorContext';
import { Node as TypeScriptNode } from 'typescript';
export interface NodeVisitor {
    canVisit(node: TypeScriptNode): boolean;
    visit(node: TypeScriptNode, context: GeneratorContext): unknown;
}
export declare abstract class NodeVisitorBase<TNode extends TypeScriptNode> implements NodeVisitor {
    private readonly _rootVisitor;
    constructor(rootVisitor: NodeVisitor);
    protected get rootVisitor(): NodeVisitor;
    protected visitNext(node: TypeScriptNode, context: GeneratorContext): unknown;
    abstract canVisit(node: TypeScriptNode): boolean;
    abstract doVisit(node: TNode, context: GeneratorContext): unknown;
    visit(node: TypeScriptNode, context: GeneratorContext): unknown;
}
