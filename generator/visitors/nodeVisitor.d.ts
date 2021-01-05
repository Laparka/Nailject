import { GeneratorContext } from '../generatorContext';
import { Node as TypeScriptNode } from 'typescript';
export interface NodeVisitor {
    canVisit(node: TypeScriptNode): boolean;
    visit(node: TypeScriptNode, context: GeneratorContext): any | void;
}
export declare abstract class NodeVisitorBase<TNode extends TypeScriptNode> implements NodeVisitor {
    private readonly _rootVisitor;
    constructor(rootVisitor: NodeVisitor);
    protected visitNext(node: TypeScriptNode, context: GeneratorContext): any | void;
    abstract canVisit(node: TypeScriptNode): boolean;
    abstract doVisit(node: TNode, context: GeneratorContext): any | void;
    visit(node: TypeScriptNode, context: GeneratorContext): any | void;
}
