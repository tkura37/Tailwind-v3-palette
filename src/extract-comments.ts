import ts from "typescript";

export function extractComments(source: string): Map<string, string> {
  const result = new Map<string, string>();
  const sourceFile = ts.createSourceFile(
    "config.ts",
    source,
    ts.ScriptTarget.Latest,
    true,
  );

  function visit(node: ts.Node) {
    if (ts.isPropertyAssignment(node) && ts.isIdentifier(node.name)) {
      const propName = node.name.text;

      if (ts.isObjectLiteralExpression(node.initializer)) {
        const commentText = getLeadingCommentText(node, source);
        if (commentText) {
          result.set(propName, commentText);
        }
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return result;
}

function getLeadingCommentText(
  node: ts.Node,
  source: string,
): string | undefined {
  const ranges = ts.getLeadingCommentRanges(source, node.getFullStart());
  if (!ranges || ranges.length === 0) return undefined;

  const texts = ranges.map((range) => {
    const raw = source.slice(range.pos, range.end);
    if (range.kind === ts.SyntaxKind.SingleLineCommentTrivia) {
      return raw.replace(/^\/\/\s?/, "").trim();
    }
    return raw.replace(/^\/\*\s?/, "").replace(/\s?\*\/$/, "").trim();
  });

  const filtered = texts.filter((t) => t.length > 0);
  return filtered.length > 0 ? filtered.join(" ") : undefined;
}
