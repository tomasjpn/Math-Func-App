import { ASTData, CalcResult, TokenizeData } from '../../services/localApiCall';
import ASTTree from './ASTTree';

interface DisplayMathResContent {
  data: TokenizeData | ASTData | CalcResult;
  operation: 'tokenize' | 'ast' | 'calc';
}

// Renders the API Response based on operations: 'tokenize' | 'ast' | 'calc'
const DisplayMathRes: React.FC<DisplayMathResContent> = ({
  data,
  operation,
}) => {
  const renderTokenize = (tokens?: Array<{ type: string; data: string }>) => (
    <div>
      <h3>Tokens:</h3>
      {tokens && tokens.length > 0 ? (
        tokens.map((token, index) => (
          <span key={index} className="mr-2">
            {token.data} ({token.type})
          </span>
        ))
      ) : (
        <p>No tokens available</p>
      )}
    </div>
  );

  const renderAST = (ast?: ASTData) => (
    <div>
      <h3 className="text-lg font-bold mb-2">Abstract Syntax Tree (AST):</h3>
      {ast ? (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ASTTree ast={ast} />
        </div>
      ) : (
        <p>No AST data available</p>
      )}
    </div>
  );

  const renderCalcResult = (result?: CalcResult) => (
    <div>
      <h3>Calculation Result:</h3>
      {result ? (
        <>
          <p>Result: {result.result}</p>
          <p>Parsed Expression: {result.parsedExpression}</p>
          {renderTokenize(result.tokens)}
          {renderAST(result.ast)}
          <p>Processing Time: {result.processingTimeInMicros} microseconds</p>
        </>
      ) : (
        <p>No calculation result available</p>
      )}
    </div>
  );

  switch (operation) {
    case 'tokenize':
      return renderTokenize((data as TokenizeData).tokens);
    case 'ast':
      return renderAST(data as ASTData);
    case 'calc':
      return renderCalcResult(data as CalcResult);
    default:
      return <pre>{JSON.stringify(data, null, 2)}</pre>;
  }
};

export default DisplayMathRes;
