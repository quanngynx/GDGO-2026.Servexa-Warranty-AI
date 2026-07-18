import fs from 'fs';
import path from 'path';

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);
  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      const f = path.join(dirPath, "/", file);
      if (f.endsWith('.ts') || f.endsWith('.tsx')) {
        arrayOfFiles.push(f);
      }
    }
  });
  return arrayOfFiles;
}

const allFiles = getAllFiles('src');

let updatedFiles = 0;

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  const newContent = content.replace(/t\(\s*(["'`])(.*?)\1\s*\)/gs, (match, quote, innerString) => {
    if (/[\r\n\t]| {2,}/.test(innerString)) {
      const cleanString = innerString.replace(/\s+/g, ' ').trim();
      changed = true;
      // ALWAYS use double quotes for the replaced string to be safe and consistent
      return `t("${cleanString}")`;
    }
    return match;
  });

  if (changed) {
    fs.writeFileSync(file, newContent);
    updatedFiles++;
  }
});

console.log('Updated source files:', updatedFiles);
