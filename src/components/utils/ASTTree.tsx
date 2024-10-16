import React, { useEffect, useState } from 'react';
import { ASTData } from '../../services/localApiCall';

interface TreeNodeData {
  name: string;
  type: string;
  children: TreeNodeData[];
}

const ASTTree: React.FC<{ ast: ASTData }> = ({ ast }) => {
  const [treeData, setTreeData] = useState<TreeNodeData | null>(null);

  useEffect(() => {
    // Creates tree node based on conditions: 'Number' | 'Variable' | 'Operation'
    const createsTreeNode = (node: any): TreeNodeData => {
      // Ensures if node is not existing
      if (!node) {
        return { name: 'invalid', type: 'invalid', children: [] };
      }

      switch (node.type) {
        case 'Number':
          return {
            name: node.number.toString(),
            type: node.type,
            children: [],
          };
        case 'Variable':
          return { name: node.variableName, type: node.type, children: [] };
        case 'Operation':
          return {
            name: node.operatorSymbol,
            type: node.type,
            children: [
              createsTreeNode(node.operand1),
              createsTreeNode(node.operand2),
            ],
          };
        default:
          // Fallback case: If none of the conditions match -> returns an unknown node
          return { name: 'Unknown', type: 'Unknown', children: [] };
      }
    };

    if (ast && ast.rootExpression) {
      // After processing the AST root expression, the treeData state will be updated with the converted tree structure
      setTreeData(createsTreeNode(ast.rootExpression));
    } else {
      setTreeData(null);
    }
  }, [ast]);

  // Single Node in the tree
  const TreeNode: React.FC<{
    node: TreeNodeData;
    x: number;
    y: number;
    onClick: () => void;
  }> = ({ node, x, y, onClick }) => (
    // SVG Element for circle element
    <g onClick={onClick} cursor="pointer">
      <circle
        cx={x}
        cy={y}
        r="20"
        fill={
          node.type === 'Number'
            ? '#90a8f0'
            : node.type === 'Variable'
            ? '#cdd8fa'
            : '#426fe1'
        }
      />
      <text
        x={x}
        y={y + 5}
        textAnchor="middle"
        fill="white"
        fontSize="14"
        fontWeight="bold"
        style={{ textAlign: 'center' }}
        pointerEvents="none"
      >
        {/*Conditionally render the name(max. 4 characters) of the nodes*/}
        {node.name.length > 4 ? node.name.slice(0, 4) + '...' : node.name}
      </text>
      <title>{node.name}</title> {/* Tooltip for full name */}
    </g>
  );

  // Recursively renders the tree starting from given node
  const renderTree = (
    node: TreeNodeData,
    x: number,
    y: number,
    level: number
  ): JSX.Element[] => {
    // Spacing Calculations
    /* Dynamic horizontal spacing based on level
     * Level increase = deeper into the tree -> horizontalSpacing decreases
     * example:     Level 0: horizontalSpacing = 150 / (0 + 1) = 150
                    Level 1: horizontalSpacing = 150 / (1 + 1) = 75
                    Level 2: horizontalSpacing = 150 / (2 + 1) = 50
    * Result: Nodes at top level are spread far apart, nodes at lower level are closer togehter
    */
    const horizontalSpacing = 150 / (level + 1);
    const verticalSpacing = 100; // Fixed vertical spacing

    // Children Rendering: Calculating their positions and render the connection lines
    const childrenRendered = node.children.flatMap((child, index) => {
      const childX =
        /*
         * x = x-coordinate of the parent node -> represents the horizontal position of the current node on the SVG canvas
         * (node.children.length - 1) / 2 -> Calculates the offset to center the child nodes
             exaple:  3 childern -> (3-1)/2 = 1: The first child will be positioned 1 unit to the left of the center, and third child 1 unit right of the center
         *
         * "*horizontalSpacing" -> scales the horizontal dinstance based on how many child nodes are there
         * exaple of full line: 
                 If the parent node is at x = 200, horizontalSpacing = 75, and there are 3 children:

                    For index = 0 (first child):
                    childX=200+(0−1)∗75=200−75=125
                
                    For index = 1 (second child):
                    childX=200+(1−1)∗75=200+0=200
                
                    For index = 2 (third child):
                    childX=200+(2−1)∗75=200+75=275

                    result: children would be positioned at 125, 200 and 275 centered around 200
         * */
        x + (index - (node.children.length - 1) / 2) * horizontalSpacing;
      // Fixed value = 100 -> By adding to parents y coordinate, the child nodes are directly below their parent
      const childY = y + verticalSpacing;
      return [
        <line
          key={`line-${childX}-${childY}`}
          /*x1 -> x2; y1 -> y2 like vectors*/
          x1={x}
          y1={y}
          x2={childX}
          y2={childY}
          stroke="#a0aec0"
          strokeWidth="1"
        />,
        ...renderTree(child, childX, childY, level + 1),
      ];
    });

    return [
      <TreeNode
        key={`node-${x}-${y}`}
        node={node}
        x={x}
        y={y}
        onClick={() => console.log(node)}
      />,
      ...childrenRendered,
    ];
  };

  if (!treeData) return null;

  // Dynamically calculate the height based on the tree depth
  const treeDepth = (node: TreeNodeData): number => {
    // If Node is a leaf (No Children)
    if (node.children.length === 0) return 1;
    /* Recusively calculte the depth of each node's children
     * Maximum depth -> longest path from this node to a leaf node:
     *      node.children.map(treeDepth) -> recursively returns an array of depths for all the child nodes
     *      Math.max(...) -> takes the arrays of depths from the child nodes and returns the maximum depth -> longest path
     *      +1 -> include current node in the total depth
     * 
     * 
     * Visual example: 
     *          A
             /   \
            B     C
          /     / \
        D     E   F
                 / \
                G   H           treeDepth(A) will calculate:
                                treeDepth(B) = 1 (for D) + 1 = 2
                                treeDepth(C) = 1 + Math.max(1, 2) = 3 (since F has the deepest subtree)
                                            [treeDepth(B) = 2, treeDepth(C) = 3]
                                Finally, treeDepth(A) = 1 + Math.max(2, 3) = 4
     */
    return 1 + Math.max(...node.children.map(treeDepth));
  };

  // Width of the SVG
  const width = 800;
  /* Height dynamically based on treeDepth:
        "*100" vertical spacing between levels
            example: If tree has depth of 4 -> 4* 100
  *     "+50" extra padding at the bottom
  */
  const height = treeDepth(treeData) * 100 + 50; // Adjust height based on tree depth

  return (
    <div className="overflow-auto">
      <svg width={width} height={height}>
        {/*The horizontal translation is half the width of the SVG -> example: 800 / 2 = 400 pixels; 50 -> moves 50px down from the top  */}
        <g transform={`translate(${width / 2}, 50)`}>
          {/*Starts the renderign at root level*/}
          {renderTree(treeData, 0, 0, 0)}
        </g>
      </svg>
    </div>
  );
};

export default ASTTree;
