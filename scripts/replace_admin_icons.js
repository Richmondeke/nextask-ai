const fs = require("fs");

const adminFiles = [
  "/Users/cambelliino../.gemini/antigravity/scratch/nextask-ai/src/app/admin/page.tsx",
  "/Users/cambelliino../.gemini/antigravity/scratch/nextask-ai/src/app/admin/layout.tsx",
  "/Users/cambelliino../.gemini/antigravity/scratch/nextask-ai/src/app/admin/settings/page.tsx",
  "/Users/cambelliino../.gemini/antigravity/scratch/nextask-ai/src/app/admin/jobs/page.tsx",
  "/Users/cambelliino../.gemini/antigravity/scratch/nextask-ai/src/app/admin/users/[id]/page.tsx"
];

adminFiles.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, "utf8");

  code = code.replace(/import\s*\{[^}]*\}\s*from\s*['"]lucide-react['"];?/g, `import GlowIcon from '@/components/ui/GlowIcon';`);

  // General mappings
  code = code.replace(/<Users(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="users"${p || ''} />`);
  code = code.replace(/<Briefcase(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="bag"${p || ''} />`);
  code = code.replace(/<CheckCircle2(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="checkmark-circle"${p || ''} />`);
  code = code.replace(/<CheckCircle(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="checkmark-circle"${p || ''} />`);
  code = code.replace(/<TrendingUp(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="chart-up"${p || ''} />`);
  code = code.replace(/<ArrowRight(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="arrow-right"${p || ''} />`);
  code = code.replace(/<ArrowLeft(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="arrow-left"${p || ''} />`);
  code = code.replace(/<Search(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="search"${p || ''} />`);
  code = code.replace(/<Plus(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="plus"${p || ''} />`);
  code = code.replace(/<Filter(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="filter"${p || ''} />`);
  code = code.replace(/<Sparkles(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="star"${p || ''} />`);
  code = code.replace(/<Building2(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="layers"${p || ''} />`);
  code = code.replace(/<Clock(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="clock"${p || ''} />`);
  code = code.replace(/<AlertCircle(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="alert-circle"${p || ''} />`);
  code = code.replace(/<X(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="xmark"${p || ''} />`);
  code = code.replace(/<Trash2(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="trash"${p || ''} />`);
  code = code.replace(/<Edit3(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="edit"${p || ''} />`);
  code = code.replace(/<Save(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="save"${p || ''} />`);
  code = code.replace(/<Shield(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="shield"${p || ''} />`);
  code = code.replace(/<Settings(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="gear"${p || ''} />`);
  code = code.replace(/<Bell(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="bell"${p || ''} />`);
  code = code.replace(/<Mail(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="mail"${p || ''} />`);
  code = code.replace(/<Phone(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="phone"${p || ''} />`);
  code = code.replace(/<MapPin(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="map-pin"${p || ''} />`);
  code = code.replace(/<ExternalLink(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="external-link"${p || ''} />`);
  code = code.replace(/<MoreHorizontal(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="dots"${p || ''} />`);
  code = code.replace(/<MoreVertical(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="more-vertical"${p || ''} />`);
  code = code.replace(/<FileText(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="doc"${p || ''} />`);
  code = code.replace(/<ChevronRight(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="chevron-right"${p || ''} />`);
  code = code.replace(/<ChevronDown(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="chevron-down"${p || ''} />`);
  code = code.replace(/<DollarSign(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="percent"${p || ''} />`);
  code = code.replace(/<User(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="user"${p || ''} />`);
  code = code.replace(/<Key(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="key"${p || ''} />`);
  code = code.replace(/<Lock(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="lock"${p || ''} />`);
  code = code.replace(/<Globe(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="compass"${p || ''} />`);

  fs.writeFileSync(filePath, code);
  console.log("Updated admin file with GlowIcon:", filePath);
});
