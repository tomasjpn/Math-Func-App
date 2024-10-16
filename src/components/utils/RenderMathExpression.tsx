import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

interface RenderMathExpressionProps {
  expression: string;
}

const RenderMathExpression: React.FC<RenderMathExpressionProps> = ({
  expression,
}) => {
  // Convert the input expression to LaTeX format
  const toLatex = (expr: string): string => {
    return expr
      .replace(/\*/g, '\\cdot ') // replaces: "*" -> cdot
      .replace(/(\d+|[a-zA-Z])\^(\d+|\([^)]+\))/g, '$1^{$2}') // replaces: expr such as a^b -> $1^{$2}
      .replace(/([a-zA-Z])(\d+)/g, '$1_{$2}') // replaces: "x2" -> $1_{$2}
      .replace(/(\d+)([a-zA-Z])/g, '$1$2') // replaces: empty spaces -> $1$2
      .replace(/(\d+|\))(?=\w|\()/g, '$1\\cdot ') // replaces: variable after num or parentheses  -> $1\\cdot
      .replace(/\(([^)]+)\)/g, '{($1)}'); // replaces: paranthese exp -> {($1)}
  };
  return (
    <div>
      {/*Renders LaTeX expression*/}
      <InlineMath math={toLatex(expression)} />
    </div>
  );
};

export default RenderMathExpression;
