const fs = require("fs");

// 1. src/app/admin/jobs/page.tsx
let jobsCode = fs.readFileSync("/Users/cambelliino../.gemini/antigravity/scratch/nextask-ai/src/app/admin/jobs/page.tsx", "utf8");
jobsCode = jobsCode.replace(/<Zap\s+([^>]*)?\/>/g, '<GlowIcon name="zap" $1 />');
jobsCode = jobsCode.replace(/<XCircle\s+([^>]*)?\/>/g, '<GlowIcon name="xmark-circle" $1 />');
fs.writeFileSync("/Users/cambelliino../.gemini/antigravity/scratch/nextask-ai/src/app/admin/jobs/page.tsx", jobsCode);

// 2. src/app/admin/layout.tsx
let layoutCode = fs.readFileSync("/Users/cambelliino../.gemini/antigravity/scratch/nextask-ai/src/app/admin/layout.tsx", "utf8");
layoutCode = layoutCode.replace(/<Menu\s+([^>]*)?\/>/g, '<GlowIcon name="menu" $1 />');
fs.writeFileSync("/Users/cambelliino../.gemini/antigravity/scratch/nextask-ai/src/app/admin/layout.tsx", layoutCode);

// 3. src/app/admin/page.tsx
let adminPageCode = fs.readFileSync("/Users/cambelliino../.gemini/antigravity/scratch/nextask-ai/src/app/admin/page.tsx", "utf8");
adminPageCode = adminPageCode.replace(/icon:\s*Users/g, 'iconName: "users"');
adminPageCode = adminPageCode.replace(/icon:\s*Briefcase/g, 'iconName: "bag"');
adminPageCode = adminPageCode.replace(/icon:\s*FileText/g, 'iconName: "doc"');
adminPageCode = adminPageCode.replace(/icon:\s*Clock/g, 'iconName: "clock"');
adminPageCode = adminPageCode.replace(/<stat\.icon\s+className="([^"]+)"\s+size=\{([^\}]+)\}\s*\/>/g, '<GlowIcon name={stat.iconName} className="$1" size={$2} />');
adminPageCode = adminPageCode.replace(/<ArrowUpRight\s+([^>]*)?\/>/g, '<GlowIcon name="arrow-right" $1 />');
fs.writeFileSync("/Users/cambelliino../.gemini/antigravity/scratch/nextask-ai/src/app/admin/page.tsx", adminPageCode);

// 4. src/app/admin/settings/page.tsx
let settingsCode = fs.readFileSync("/Users/cambelliino../.gemini/antigravity/scratch/nextask-ai/src/app/admin/settings/page.tsx", "utf8");
settingsCode = settingsCode.replace(/<CreditCard\s+([^>]*)?\/>/g, '<GlowIcon name="credit-card" $1 />');
settingsCode = settingsCode.replace(/<Zap\s+([^>]*)?\/>/g, '<GlowIcon name="zap" $1 />');
fs.writeFileSync("/Users/cambelliino../.gemini/antigravity/scratch/nextask-ai/src/app/admin/settings/page.tsx", settingsCode);

// 5. src/app/admin/users/[id]/page.tsx
let userDetailCode = fs.readFileSync("/Users/cambelliino../.gemini/antigravity/scratch/nextask-ai/src/app/admin/users/[id]/page.tsx", "utf8");
userDetailCode = userDetailCode.replace(/<Calendar\s+([^>]*)?\/>/g, '<GlowIcon name="calendar" $1 />');
userDetailCode = userDetailCode.replace(/<Award\s+([^>]*)?\/>/g, '<GlowIcon name="medal" $1 />');
userDetailCode = userDetailCode.replace(/<Link\s+className="([^"]+)"\s+size=\{([^\}]+)\}\s*\/>/g, '<GlowIcon name="link" className="$1" size={$2} />');
fs.writeFileSync("/Users/cambelliino../.gemini/antigravity/scratch/nextask-ai/src/app/admin/users/[id]/page.tsx", userDetailCode);

// 6. src/components/admin/LeadModal.tsx
let leadModalCode = fs.readFileSync("/Users/cambelliino../.gemini/antigravity/scratch/nextask-ai/src/components/admin/LeadModal.tsx", "utf8");
leadModalCode = leadModalCode.replace(/<User\s+([^>]*)?\/>/g, '<GlowIcon name="user" $1 />');
fs.writeFileSync("/Users/cambelliino../.gemini/antigravity/scratch/nextask-ai/src/components/admin/LeadModal.tsx", leadModalCode);

console.log("Fixed all icon references!");
