const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /text-slate-900/g, replacement: 'text-[#E2E2E0]' },
  { regex: /text-slate-800/g, replacement: 'text-[#E2E2E0]' },
  { regex: /text-slate-700/g, replacement: 'text-[#E2E2E0]' },
  { regex: /text-slate-600/g, replacement: 'text-[#E2E2E0]/80' },
  { regex: /text-slate-500/g, replacement: 'text-[#E2E2E0]/70' },
  { regex: /text-slate-400/g, replacement: 'text-[#E2E2E0]/60' },
  { regex: /text-gray-900/g, replacement: 'text-[#E2E2E0]' },
  { regex: /text-gray-800/g, replacement: 'text-[#E2E2E0]' },
  { regex: /text-gray-700/g, replacement: 'text-[#E2E2E0]' },
  { regex: /text-gray-600/g, replacement: 'text-[#E2E2E0]/80' },
  { regex: /text-gray-500/g, replacement: 'text-[#E2E2E0]/70' },
  { regex: /text-gray-400/g, replacement: 'text-[#E2E2E0]/60' },
  
  { regex: /bg-white/g, replacement: 'bg-[#12484C]' },
  { regex: /bg-slate-50(?!0)/g, replacement: 'bg-[#0E2931]' },
  { regex: /bg-slate-100/g, replacement: 'bg-[rgba(14,41,49,0.8)]' },
  { regex: /bg-slate-200/g, replacement: 'bg-[rgba(14,41,49,0.9)]' },
  { regex: /bg-gray-50(?!0)/g, replacement: 'bg-[#0E2931]' },
  { regex: /bg-gray-100/g, replacement: 'bg-[rgba(14,41,49,0.8)]' },
  
  { regex: /border-slate-100/g, replacement: 'border-[#2B7574]/20' },
  { regex: /border-slate-200/g, replacement: 'border-[#2B7574]/30' },
  { regex: /border-gray-100/g, replacement: 'border-[#2B7574]/20' },
  { regex: /border-gray-200/g, replacement: 'border-[#2B7574]/30' },
  { regex: /border-slate-300/g, replacement: 'border-[#2B7574]/40' },
  
  { regex: /bg-\[\#f9fafb\]/g, replacement: 'bg-[#0E2931]' }
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      for (const { regex, replacement } of replacements) {
        content = content.replace(regex, replacement);
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory('d:/project system/DVAN.AI/src');
