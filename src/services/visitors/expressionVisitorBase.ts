import ExpressionVisitor from '../../interfaces/expressionVisitor';
import Expression from '../../interfaces/expression';
import { BaseNode } from '@typescript-eslint/types/dist/ts-estree';
import { GeneratorContext } from '../../interfaces/generatorContext';

export default abstract class ExpressionVisitorBase<TExpression extends BaseNode> implements ExpressionVisitor {
  private readonly _baseVisitor: ExpressionVisitor;
  constructor(baseVisitor: ExpressionVisitor) {
    this._baseVisitor = baseVisitor;
  }

  protected get rootVisitor(): ExpressionVisitor {
    return this._baseVisitor;
  }

  abstract canVisit(expression: Expression): boolean;

  visit(expression: Expression, context: GeneratorContext): string[] {
    if (!this.canVisit(expression)) {
      throw Error(`${expression.type} cannot be visited by this visitor`);
    }

    return this.visitExpression(expression as unknown as TExpression, context);
  }

  abstract visitExpression(expression: TExpression, context: GeneratorContext): string[];
}