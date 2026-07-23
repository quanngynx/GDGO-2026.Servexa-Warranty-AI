import { Project, SyntaxKind, Node } from 'ts-morph';
import fs from 'fs';
import path from 'path';

const project = new Project({
  tsConfigFilePath: "d:/Github/GDGO-2026/servexa-warranty-ai/apps/web/tsconfig.json",
});

const sourceFiles = project.getSourceFiles("d:/Github/GDGO-2026/servexa-warranty-ai/apps/web/src/**/*.tsx");
const translations = {};
let totalModified = 0;

for (const sourceFile of sourceFiles) {
  if (sourceFile.getFilePath().includes('node_modules')) continue;

  try {
    let hasChanges = false;
    let needsTranslation = false;

    // 1. Replace JsxText
    const jsxTexts = sourceFile.getDescendantsOfKind(SyntaxKind.JsxText);
    for (const jsxText of jsxTexts) {
      const text = jsxText.getLiteralText();
      const trimmed = text.trim();
      if (trimmed.length > 0 && /[A-Za-z]/.test(trimmed)) {
        translations[trimmed] = trimmed;
        const escaped = trimmed.replace(/"/g, '\\"').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '');
        jsxText.replaceWithText(`{t("${escaped}")}`);
        hasChanges = true;
        needsTranslation = true;
      }
    }

    // 2. Replace JsxAttribute strings
    const attrs = sourceFile.getDescendantsOfKind(SyntaxKind.JsxAttribute);
    for (const attr of attrs) {
      const nameNode = attr.getNameNode();
      const name = nameNode ? nameNode.getText() : '';
      if (['placeholder', 'label', 'title', 'description', 'alt'].includes(name)) {
        const init = attr.getInitializer();
        if (init && Node.isStringLiteral(init)) {
          const text = init.getLiteralValue();
          if (text.trim().length > 0 && /[A-Za-z]/.test(text)) {
            translations[text] = text;
            const escaped = text.replace(/"/g, '\\"').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '');
            init.replaceWithText(`{t("${escaped}")}`);
            hasChanges = true;
            needsTranslation = true;
          }
        }
      }
    }

    if (needsTranslation) {
      // 3. Add import
      const importDecs = sourceFile.getImportDeclarations();
      let hasImport = false;
      for (const imp of importDecs) {
        if (imp.getModuleSpecifierValue() === 'react-i18next') {
          hasImport = true;
          const namedImports = imp.getNamedImports();
          if (!namedImports.some(n => n.getName() === 'useTranslation')) {
            imp.addNamedImport('useTranslation');
          }
        }
      }
      if (!hasImport) {
        sourceFile.addImportDeclaration({
          namedImports: ['useTranslation'],
          moduleSpecifier: 'react-i18next'
        });
      }

      // 4. Inject const { t } = useTranslation();
      const components = [];
      
      for (const func of sourceFile.getDescendantsOfKind(SyntaxKind.FunctionDeclaration)) {
        const name = func.getName();
        if (name && /^[A-Z]/.test(name)) components.push(func);
      }
      
      for (const varDecl of sourceFile.getDescendantsOfKind(SyntaxKind.VariableDeclaration)) {
        const name = varDecl.getName();
        if (name && /^[A-Z]/.test(name)) {
          const init = varDecl.getInitializer();
          if (init && (Node.isArrowFunction(init) || Node.isFunctionExpression(init))) {
            components.push(init);
          }
        }
      }

      for (const comp of components) {
        let tDeclared = false;
        comp.getDescendantsOfKind(SyntaxKind.VariableDeclaration).forEach(v => {
            const name = v.getName();
            if (name === '{ t }' || name === '{t}' || name === 't' || name.includes('t:')) tDeclared = true;
        });
        
        if (!tDeclared) {
          const body = comp.getBody();
          if (Node.isBlock(body)) {
            body.insertStatements(0, 'const { t } = useTranslation();');
          } else if (body) {
            try {
               const bodyText = body.getText();
               comp.replaceWithText(`() => {\n  const { t } = useTranslation();\n  return ${bodyText};\n}`);
            } catch (e) {
               console.log(`Failed to update implicit return for component in ${sourceFile.getFilePath()}`);
            }
          }
        }
      }
    }

    if (hasChanges) {
      sourceFile.saveSync();
      totalModified++;
    }
  } catch (err) {
    console.error(`Error processing file ${sourceFile.getFilePath()}:`, err.message);
  }
}

fs.writeFileSync('d:/Github/GDGO-2026/servexa-warranty-ai/apps/web/extracted-translations.json', JSON.stringify(translations, null, 2));
console.log(`Finished. Modified ${totalModified} files. Extracted ${Object.keys(translations).length} keys.`);
