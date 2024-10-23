export interface MathObject {
  expression: string;
  operation: 'resolve' | 'tokenize' | 'ast' | 'calc';
  result: any;
  url: string;
}

export interface QueryParams {
  limit?: string;
  offset?: string;
  operation?: string;
}

export interface DeleteInputParams {
  id: string;
}

export interface UpdateInputParams {
  expression: string;
  operation: 'resolve' | 'tokenize' | 'ast' | 'calc';
}
