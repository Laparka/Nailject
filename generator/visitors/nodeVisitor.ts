import { GeneratorContext } from '../generatorContext';
import { Node as TypeScriptNode } from 'typescript';

export interface NodeVisitor {
  canVisit(node: TypeScriptNode): boolean;
  visit(node: TypeScriptNode, context: GeneratorContext): unknown;
}

export abstract class NodeVisitorBase<TNode extends TypeScriptNode> implements NodeVisitor {
  private readonly _rootVisitor: NodeVisitor;
  constructor(rootVisitor: NodeVisitor) {
    this._rootVisitor = rootVisitor;
  }

  protected visitNext(node: TypeScriptNode, context: GeneratorContext): unknown {
    if (this._rootVisitor.canVisit(node)) {
      return this._rootVisitor.visit(node, context)
    }

    throw Error(`No node visitor was found for the node ${node.kind}`);
  }

  abstract canVisit(node: TypeScriptNode): boolean;

  abstract doVisit(node: TNode, context: GeneratorContext): unknown;

  visit(node: TypeScriptNode, context: GeneratorContext): unknown {
    if (!this.canVisit(node)) {
      throw Error(`The current node visitor does not support the given node ${node.kind}`);
    }

    return this.doVisit(node as TNode, context);
  }
}