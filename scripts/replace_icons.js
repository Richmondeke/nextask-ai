const fs = require("fs");
const path = require("path");

const files = [
  "/Users/cambelliino../.gemini/antigravity/scratch/nextask-ai/src/app/admin/leads/page.tsx",
  "/Users/cambelliino../.gemini/antigravity/scratch/nextask-ai/src/components/admin/LinkedInTemplateDrawer.tsx",
  "/Users/cambelliino../.gemini/antigravity/scratch/nextask-ai/src/components/admin/LeadModal.tsx",
  "/Users/cambelliino../.gemini/antigravity/scratch/nextask-ai/src/components/admin/ApifySourcingModal.tsx",
  "/Users/cambelliino../.gemini/antigravity/scratch/nextask-ai/src/app/admin/users/page.tsx"
];

files.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, "utf8");

  // Remove lucide-react import and add GlowIcon import
  code = code.replace(/import\s*\{[^}]*\}\s*from\s*['"]lucide-react['"];?/g, `import GlowIcon from '@/components/ui/GlowIcon';`);

  // Replace component tags
  code = code.replace(/<Search(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="search"${p || ''} />`);
  code = code.replace(/<Filter(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="filter"${p || ''} />`);
  code = code.replace(/<Download(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="download-cloud"${p || ''} />`);
  code = code.replace(/<Upload(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="upload-cloud"${p || ''} />`);
  code = code.replace(/<Plus(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="plus"${p || ''} />`);
  code = code.replace(/<Sparkles(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="star"${p || ''} />`);
  code = code.replace(/<LayoutGrid(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="grid"${p || ''} />`);
  code = code.replace(/<TableIcon(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="columns"${p || ''} />`);
  code = code.replace(/<ExternalLink(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="external-link"${p || ''} />`);
  code = code.replace(/<MessageSquare(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="message-square"${p || ''} />`);
  code = code.replace(/<Calendar(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="calendar"${p || ''} />`);
  code = code.replace(/<Clock(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="clock"${p || ''} />`);
  code = code.replace(/<Trash2(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="trash"${p || ''} />`);
  code = code.replace(/<Edit3(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="edit"${p || ''} />`);
  code = code.replace(/<ArrowRight(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="arrow-right"${p || ''} />`);
  code = code.replace(/<Send(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="paper-plane"${p || ''} />`);
  code = code.replace(/<CheckCircle2(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="checkmark-circle"${p || ''} />`);
  code = code.replace(/<AlertCircle(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="alert-circle"${p || ''} />`);
  code = code.replace(/<X(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="xmark"${p || ''} />`);
  code = code.replace(/<TrendingUp(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="chart-up"${p || ''} />`);
  code = code.replace(/<ChevronRight(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="chevron-right"${p || ''} />`);
  code = code.replace(/<ChevronDown(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="chevron-down"${p || ''} />`);
  code = code.replace(/<DollarSign(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="percent"${p || ''} />`);
  code = code.replace(/<Building2(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="layers"${p || ''} />`);
  code = code.replace(/<Users(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="users"${p || ''} />`);
  code = code.replace(/<Zap(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="zap"${p || ''} />`);
  code = code.replace(/<Mail(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="mail"${p || ''} />`);
  code = code.replace(/<Loader2(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="refresh-cw"${p || ''} />`);
  code = code.replace(/<Tag(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="tag"${p || ''} />`);
  code = code.replace(/<Briefcase(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="bag"${p || ''} />`);
  code = code.replace(/<MoreVertical(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="more-vertical"${p || ''} />`);
  code = code.replace(/<MoreHorizontal(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="dots"${p || ''} />`);
  code = code.replace(/<Key(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="key"${p || ''} />`);
  code = code.replace(/<Database(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="server"${p || ''} />`);
  code = code.replace(/<XCircle(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="xmark-circle"${p || ''} />`);
  code = code.replace(/<Phone(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="phone"${p || ''} />`);
  code = code.replace(/<MapPin(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="map-pin"${p || ''} />`);
  code = code.replace(/<Copy(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="copy"${p || ''} />`);
  code = code.replace(/<Check(\s+[^>]*)?\/>/g, (m, p) => `<GlowIcon name="checkmark"${p || ''} />`);

  fs.writeFileSync(filePath, code);
  console.log("Updated with GlowIcon:", filePath);
});
