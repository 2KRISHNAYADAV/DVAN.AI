const fs = require('fs');

const path = 'src/components/LoginModal.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add Key import
content = content.replace(
  "import { Sparkles, Lock, Mail } from 'lucide-react';",
  "import { Sparkles, Lock, Mail, Key } from 'lucide-react';"
);

// 2. Add state and store vars
content = content.replace(
  "const { isLoginModalOpen, setLoginModalOpen, setLoggedIn } = useDashboardStore();",
  "const { isLoginModalOpen, setLoginModalOpen, setLoggedIn, setApiKey } = useDashboardStore();"
);

content = content.replace(
  "const [password, setPassword] = useState('');",
  "const [password, setPassword] = useState('');\n  const [apiKeyInput, setApiKeyInput] = useState('');"
);

content = content.replace(
  "toast.error('Please fill in all fields.');",
  "toast.error('Please fill in email and password.');"
);

content = content.replace(
  "setLoggedIn(true);\n    setLoginModalOpen(false);",
  "setLoggedIn(true);\n    setApiKey(apiKeyInput.trim());\n    setLoginModalOpen(false);"
);

// 3. Add UI field
const oldPasswordHTML = `<div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#E2E2E0]/55 uppercase tracking-widest">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2B7574]" />
                  <Input
                    type="password"
                    placeholder="        "
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>`;

const newFieldsHTML = `<div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#E2E2E0]/55 uppercase tracking-widest flex justify-between">
                  <span>Password</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2B7574]" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#E2E2E0]/55 uppercase tracking-widest flex justify-between">
                  <span>Gemini API Key</span>
                  <span className="text-[#2B7574] text-[10px]">Required for AI</span>
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2B7574]" />
                  <Input
                    type="password"
                    placeholder="AIzaSy..."
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>`;

content = content.replace(oldPasswordHTML, newFieldsHTML);

fs.writeFileSync(path, content, 'utf8');
console.log("Updated LoginModal.tsx");
