"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeVisitorBase = void 0;
class NodeVisitorBase {
    constructor(rootVisitor) {
        this._rootVisitor = rootVisitor;
    }
    get rootVisitor() {
        return this._rootVisitor;
    }
    visitNext(node, context) {
        if (this._rootVisitor.canVisit(node)) {
            return this._rootVisitor.visit(node, context);
        }
        throw Error(`No node visitor was found for the node ${node.kind}`);
    }
    visit(node, context) {
        if (!this.canVisit(node)) {
            throw Error(`The current node visitor does not support the given node ${node.kind}`);
        }
        return this.doVisit(node, context);
    }
}
exports.NodeVisitorBase = NodeVisitorBase;
