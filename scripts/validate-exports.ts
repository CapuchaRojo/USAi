import fs from 'fs';
import path from 'path';

interface ExportInfo {
  name: string;
  line: number;
  type: 'class' | 'interface' | 'function' | 'const' | 'named';
}

const checkExports = (filePath: string): void => {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }

  const code = fs.readFileSync(filePath, 'utf8');
  const exports: ExportInfo[] = [];
  const lines = code.split('\n');

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    
    // Match export class/interface/function/const declarations
    const declarationMatch = line.match(/export\s+(abstract\s+)?(class|interface|function|const)\s+(\w+)/);
    if (declarationMatch) {
      exports.push({
        name: declarationMatch[3],
        line: lineNumber,
        type: declarationMatch[2] as any
      });
    }

    // Match named exports like export { Agent, Helper }
    const namedExportMatch = line.match(/export\s*\{\s*([^}]+)\s*\}/);
    if (namedExportMatch) {
      const namedExports = namedExportMatch[1]
        .split(',')
        .map(exp => exp.trim().split(' as ')[0].trim())
        .filter(name => name.length > 0);
      
      namedExports.forEach(name => {
        exports.push({
          name,
          line: lineNumber,
          type: 'named'
        });
      });
    }
  });

  // Check for duplicates
  const exportNames = new Map<string, ExportInfo[]>();
  
  exports.forEach(exp => {
    if (!exportNames.has(exp.name)) {
      exportNames.set(exp.name, []);
    }
    exportNames.get(exp.name)!.push(exp);
  });

  // Report duplicates
  let hasDuplicates = false;
  exportNames.forEach((exportList, name) => {
    if (exportList.length > 1) {
      hasDuplicates = true;
      console.error(`❌ Duplicate export '${name}' in ${filePath}:`);
      exportList.forEach(exp => {
        console.error(`   Line ${exp.line}: export ${exp.type} ${name}`);
      });
    }
  });

  if (!hasDuplicates) {
    console.log(`✅ ${path.basename(filePath)}: No duplicate exports found`);
  }

  return hasDuplicates;
};

const validateAllAgentFiles = (): boolean => {
  console.log('🔍 Validating agent exports...\n');
  
  const agentFiles = [
    'src/agents/Agent.ts',
    'src/agents/SonnetEmulator.ts',
    'src/agents/SonnetCondenser.ts',
    'src/agents/SonnetRepurposer.ts',
    'src/agents/SonnetDeployer.ts'
  ];

  let hasErrors = false;

  agentFiles.forEach(file => {
    try {
      const fileHasErrors = checkExports(file);
      if (fileHasErrors) {
        hasErrors = true;
      }
    } catch (error) {
      console.error(`❌ Error checking ${file}:`, error.message);
      hasErrors = true;
    }
  });

  if (hasErrors) {
    console.error('\n❌ Export validation failed! Please fix duplicate exports before building.');
    process.exit(1);
  } else {
    console.log('\n✅ All agent files passed export validation!');
  }

  return !hasErrors;
};

// Run validation if this script is executed directly
if (require.main === module) {
  validateAllAgentFiles();
}

export { validateAllAgentFiles };