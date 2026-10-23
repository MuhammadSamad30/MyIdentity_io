"use client";

import { ChangeEvent, CSSProperties, useEffect, useMemo, useRef, useState } from "react";

type Template = { id: string; name: string; category: string; accent: string; ink: string; bg: string; style: string; font: string };
type Field = { key: string; label: string; value: string; enabled: boolean };
type Project = { name: string; template: string; fields: Field[]; accent: string; bg: string; ink: string; font: string; size: number; border: number; radius: number; portrait: boolean; photo: string; logo: string; side: string };

const templates: Template[] = [
  { id: "modern-student", name: "Modern Student", category: "Education", accent: "#5677e8", ink: "#15213b", bg: "#f7f8fc", style: "student", font: "Arial" },
  { id: "classic-school", name: "Classic School", category: "Education", accent: "#28714e", ink: "#18382c", bg: "#fffdf7", style: "classic", font: "Georgia" },
  { id: "university", name: "University", category: "Education", accent: "#713b83", ink: "#251c32", bg: "#f8f5fa", style: "university", font: "Georgia" },
  { id: "corporate", name: "Corporate Employee", category: "Work", accent: "#167d86", ink: "#163338", bg: "#f3f8f8", style: "corporate", font: "Arial" },
  { id: "minimal-pro", name: "Minimal Professional", category: "Work", accent: "#414e5d", ink: "#1e2935", bg: "#ffffff", style: "minimal", font: "Arial" },
  { id: "premium-dark", name: "Premium Dark", category: "Work", accent: "#d4b16b", ink: "#f5f0e5", bg: "#17202c", style: "dark", font: "Georgia" },
  { id: "gradient", name: "Modern Gradient", category: "Creative", accent: "#9d5ce0", ink: "#fff", bg: "#6546cf", style: "gradient", font: "Arial" },
  { id: "academic-blue", name: "Academic Blue", category: "Education", accent: "#2563a8", ink: "#153452", bg: "#edf5fc", style: "academic", font: "Arial" },
  { id: "healthcare", name: "Healthcare Staff", category: "Work", accent: "#249d8a", ink: "#19443e", bg: "#f2fbf8", style: "health", font: "Arial" },
  { id: "membership", name: "Membership", category: "Community", accent: "#d27b3c", ink: "#38261b", bg: "#fff8f0", style: "member", font: "Georgia" },
  { id: "creative", name: "Creative Agency", category: "Creative", accent: "#ef765c", ink: "#34231f", bg: "#fff8f5", style: "creative", font: "Arial" },
  { id: "minimal-white", name: "Minimal White", category: "Minimal", accent: "#50627a", ink: "#202a36", bg: "#ffffff", style: "white", font: "Arial" },
  { id: "blank", name: "Blank Canvas", category: "Minimal", accent: "#617083", ink: "#1c2734", bg: "#ffffff", style: "blank", font: "Arial" },
];
const starterFields: Field[] = [
  { key: "name", label: "Full name", value: "Alex Morgan", enabled: true },
  { key: "id", label: "ID number", value: "STU-2025-0184", enabled: true },
  { key: "role", label: "Role / class", value: "Grade 11 · Science", enabled: true },
  { key: "org", label: "Organization", value: "Northwood Academy", enabled: true },
  { key: "email", label: "Email", value: "alex.morgan@example.com", enabled: false },
  { key: "phone", label: "Phone", value: "+1 (555) 014-8820", enabled: false },
  { key: "blood", label: "Blood group", value: "O+", enabled: false },
  { key: "expiry", label: "Expires", value: "June 2027", enabled: false },
];
const defaultProject: Project = { name: "Untitled design", template: "modern-student", fields: starterFields, accent: "#5677e8", bg: "#f7f8fc", ink: "#15213b", font: "Arial", size: 100, border: 0, radius: 20, portrait: false, photo: "", logo: "", side: "front" };

function Icon({ name, size = 16 }: { name: string; size?: number }) {
  const paths: Record<string, string> = { grid: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z", type: "M4 7V4h16v3M12 4v16M8 20h8", image: "M4 4h16v16H4z M4 16l5-5 4 4 3-3 4 4 M9 9h.01", sliders: "M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3M2 14h4m4-6h4m4 6h4", undo: "M9 14 4 9l5-5M4 9h10a6 6 0 0 1 0 12h-2", redo: "m15 14 5-5-5-5m5 5H10a6 6 0 0 0 0 12h2", download: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m4-5 5 5 5-5m-5 5V3", save: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2ZM17 21v-8H7v8M7 3v5h8", plus: "M12 5v14m-7-7h14", close: "M18 6 6 18M6 6l12 12", zoomin: "M11 5v12m-6-6h12m7 1a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z", zoomout: "M5 11h12m6 1a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z", flip: "M3 7h18M3 17h18M12 3v18m0-18-4 4m4-4 4 4m-4 12-4-4m4 4 4-4", check: "m5 12 4 4L19 6", trash: "M3 6h18m-2 0-.9 14H5.9L5 6m4 0V4h6v2m-5 4v6m4-6v6" };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name] || paths.grid} /></svg>;
}

export default function Home() {
  const [design, setDesign] = useState<Project>(defaultProject);
  const [section, setSection] = useState("Templates");
  const [category, setCategory] = useState("All");
  const [zoom, setZoom] = useState(1);
  const [saved, setSaved] = useState<{ name: string; data: Project }[]>([]);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const undoStack = useRef<Project[]>([]);
  const redoStack = useRef<Project[]>([]);
  const lastDesign = useRef<Project>(defaultProject);
  const [notice, setNotice] = useState("");
  const [mobileView, setMobileView] = useState("Design");
  const [showProjects, setShowProjects] = useState(false);
  const template = templates.find((t) => t.id === design.template) || templates[0];
  const filtered = useMemo(() => templates.filter((t) => category === "All" || t.category === category), [category]);

  useEffect(() => { const id = setTimeout(() => { try { const s = localStorage.getItem("card-studio-projects"); if (s) setSaved(JSON.parse(s)); } catch { setNotice("Saved projects could not be loaded."); } }, 0); return () => clearTimeout(id); }, []);
  useEffect(() => { const id = setTimeout(() => setNotice(""), 2600); return () => clearTimeout(id); }, [notice]);
  useEffect(() => {
    if (JSON.stringify(lastDesign.current) !== JSON.stringify(design)) {
      undoStack.current.push(lastDesign.current);
      if (undoStack.current.length > 40) undoStack.current.shift();
      redoStack.current = [];
      lastDesign.current = design;
      const id = setTimeout(() => { setCanUndo(undoStack.current.length > 0); setCanRedo(false); }, 0);
      return () => clearTimeout(id);
    }
  }, [design]);
  function undo() { const previous = undoStack.current.pop(); if (!previous) return; redoStack.current.push(design); lastDesign.current = previous; setDesign(previous); setCanUndo(undoStack.current.length > 0); setCanRedo(true); }
  function redo() { const next = redoStack.current.pop(); if (!next) return; undoStack.current.push(design); lastDesign.current = next; setDesign(next); setCanUndo(true); setCanRedo(redoStack.current.length > 0); }
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!(e.ctrlKey || e.metaKey) || e.key.toLowerCase() !== "z") return;
      if (["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement)?.tagName)) return;
      e.preventDefault(); if (e.shiftKey) redo(); else undo();
    }
    window.addEventListener("keydown", onKeyDown); return () => window.removeEventListener("keydown", onKeyDown);
  });

  function update<K extends keyof Project>(key: K, value: Project[K]) { setDesign((d) => ({ ...d, [key]: value })); }
  function updateField(index: number, patch: Partial<Field>) { setDesign((d) => ({ ...d, fields: d.fields.map((f, i) => i === index ? { ...f, ...patch } : f) })); }
  function applyTemplate(t: Template) { setDesign((d) => ({ ...d, template: t.id, accent: t.accent, bg: t.bg, ink: t.ink, font: t.font })); }
  function saveProject() {
    const name = window.prompt("Name this design", design.name); if (!name?.trim()) return;
    const entry = { name: name.trim(), data: { ...design, name: name.trim() } };
    const next = [...saved.filter((p) => p.name !== entry.name), entry];
    try { localStorage.setItem("card-studio-projects", JSON.stringify(next)); setSaved(next); update("name", name.trim()); setNotice("Design saved on this device."); } catch { setNotice("Could not save. Uploaded images may exceed browser storage limits."); }
  }
  function restoreProject(p: { name: string; data: Project }) { setDesign(p.data); setShowProjects(false); setNotice(`Opened “${p.name}”.`); }
  function loadImage(e: ChangeEvent<HTMLInputElement>, key: "photo" | "logo") {
    const file = e.target.files?.[0]; if (!file) return;
    if (!file.type.startsWith("image/")) { setNotice("Choose a PNG, JPEG, or WebP image."); e.target.value = ""; return; }
    if (file.size > 5 * 1024 * 1024) { setNotice("Image must be smaller than 5 MB."); e.target.value = ""; return; }
    const reader = new FileReader(); reader.onload = () => update(key, String(reader.result)); reader.onerror = () => setNotice("Could not read this image."); reader.readAsDataURL(file);
  }
  function printCard() {
    let printRule = document.getElementById("card-print-page-rule");
    if (!printRule) { printRule = document.createElement("style"); printRule.id = "card-print-page-rule"; document.head.appendChild(printRule); }
    printRule.textContent = "@media print { @page { size: A4 portrait; margin: 0; } }";
    window.print();
  }
  function addField() { setDesign((d) => ({ ...d, fields: [...d.fields, { key: `custom-${Date.now()}`, label: "New field", value: "", enabled: true }] })); }
  const cardBackground = template.style === "gradient" ? `linear-gradient(135deg, ${design.accent}, #392984)` : design.bg;
  const cardStyle: CSSProperties = { background: cardBackground, color: design.ink, borderRadius: `${design.radius}px`, border: `${design.border}px solid ${design.accent}`, fontFamily: design.font, transform: `scale(${zoom})`, aspectRatio: design.portrait ? "53.98 / 85.6" : "85.6 / 53.98" };

  return <main className="studio-shell">
    <header className="topbar">
      <a className="brand" href="#"><span className="brand-mark"><Icon name="grid" size={18} /></span><span>MyIdentity<span className="brand-light">.io</span></span><span className="brand-divider"/><span className="product-label">Design studio</span></a>
      <div className="top-center"><span className="status-dot"/> All changes saved locally</div>
      <div className="top-actions"><button className="icon-btn history-btn" aria-label="Undo" title="Undo (Ctrl+Z)" onClick={undo} disabled={!canUndo}><Icon name="undo"/></button><button className="icon-btn history-btn" aria-label="Redo" title="Redo (Ctrl+Shift+Z)" onClick={redo} disabled={!canRedo}><Icon name="redo"/></button><button className="button button-quiet save-btn" onClick={saveProject}><Icon name="save"/> Save</button><button className="button button-primary" onClick={printCard}><Icon name="download"/> Export PDF</button></div>
    </header>

    <div className="mobile-tabs"><button className={mobileView === "Design" ? "selected" : ""} onClick={() => setMobileView("Design")}>Design</button><button className={mobileView === "Preview" ? "selected" : ""} onClick={() => setMobileView("Preview")}>Preview</button><button className={mobileView === "Details" ? "selected" : ""} onClick={() => setMobileView("Details")}>Details</button></div>
    <div className="workspace">
      <aside className={`left-panel ${mobileView !== "Design" ? "mobile-hide" : ""}`}>
        <div className="panel-head"><div><div className="eyebrow">YOUR WORKSPACE</div><h1>Design your card</h1></div><button className="dots-btn" aria-label="Open saved designs" title="Saved projects" onClick={() => setShowProjects(true)}>•••</button></div>
        <div className="section-tabs">{[["Templates", "grid"], ["Content", "type"], ["Appearance", "sliders"], ["Images", "image"]].map(([s, ico]) => <button key={s} className={`section-tab ${section === s ? "active" : ""}`} onClick={() => setSection(s)}><Icon name={ico}/><span>{s}</span></button>)}</div>
        <div className="scroll-panel">
          {section === "Templates" && <>
            <div className="section-title-row"><div><h2>Choose a template</h2><p>Start with a professionally designed layout.</p></div></div>
            <div className="category-list">{["All", "Education", "Work", "Creative", "Community", "Minimal"].map((c) => <button key={c} className={category === c ? "chip active" : "chip"} onClick={() => setCategory(c)}>{c}</button>)}</div>
            <div className="template-grid">{filtered.map((t) => <button key={t.id} className={`template-tile ${design.template === t.id ? "chosen" : ""}`} onClick={() => applyTemplate(t)} aria-pressed={design.template === t.id}>
              <MiniCard template={t}/><span className="template-name">{t.name}</span><span className="template-category">{t.category}</span>{design.template === t.id && <span className="tile-check"><Icon name="check" size={12}/></span>}
            </button>)}</div>
          </>}
          {section === "Content" && <>
            <div className="section-title-row"><div><h2>Card information</h2><p>Edit details and choose what appears.</p></div></div>
            <label className="control-label">Organization name</label><input className="text-input" value={design.fields.find((f) => f.key === "org")?.value || ""} placeholder="Organization or school" onChange={(e) => { const i = design.fields.findIndex((f) => f.key === "org"); if (i >= 0) updateField(i, { value: e.target.value }); }}/>
            <div className="field-list">{design.fields.map((f, i) => <div className="field-card" key={f.key}><div className="field-top"><label className="toggle"><input type="checkbox" checked={f.enabled} onChange={(e) => updateField(i, { enabled: e.target.checked })}/><span/></label><span className="field-name">{f.label}</span><button className="tiny-action" title="Move field up" disabled={i === 0} onClick={() => setDesign((d) => { const fields = [...d.fields]; [fields[i - 1], fields[i]] = [fields[i], fields[i - 1]]; return { ...d, fields }; })}>↑</button><button className="tiny-action" title="Move field down" disabled={i === design.fields.length - 1} onClick={() => setDesign((d) => { const fields = [...d.fields]; [fields[i + 1], fields[i]] = [fields[i], fields[i + 1]]; return { ...d, fields }; })}>↓</button><button className="tiny-action remove" title="Remove field" onClick={() => setDesign((d) => ({ ...d, fields: d.fields.filter((_, n) => n !== i) }))}><Icon name="trash" size={13}/></button></div><div className="field-inputs"><input value={f.label} aria-label={`${f.label} label`} onChange={(e) => updateField(i, { label: e.target.value })} placeholder="Label"/><input value={f.value} aria-label={`${f.label} value`} onChange={(e) => updateField(i, { value: e.target.value })} placeholder="Enter information"/></div></div>)}</div>
            <button className="add-field" onClick={addField}><Icon name="plus" size={15}/> Add a field</button>
            <div className="form-note">Only enabled fields with content are shown on the card. This demo data is editable.</div>
          </>}
          {section === "Appearance" && <>
            <div className="section-title-row"><div><h2>Appearance</h2><p>Fine-tune your card&apos;s visual style.</p></div></div>
            <div className="control-group"><label className="control-label">Orientation</label><div className="segmented"><button className={!design.portrait ? "on" : ""} onClick={() => update("portrait", false)}>Landscape</button><button className={design.portrait ? "on" : ""} onClick={() => update("portrait", true)}>Portrait</button></div></div>
            <div className="control-group"><div className="control-row"><label className="control-label">Card size</label><span className="value-pill">ID-1 · 85.6 × 54 mm</span></div><div className="range-row"><input type="range" min="80" max="120" value={design.size} onChange={(e) => update("size", +e.target.value)}/><span>{design.size}%</span></div><p className="helper-text">Standard CR80 size. Scaling is for preview only.</p></div>
            <ColorControl label="Background" value={design.bg} onChange={(v) => update("bg", v)}/><ColorControl label="Accent color" value={design.accent} onChange={(v) => update("accent", v)}/><ColorControl label="Text color" value={design.ink} onChange={(v) => update("ink", v)}/>
            <div className="control-group"><div className="control-row"><label className="control-label">Border thickness</label><span className="number-unit"><input type="number" min="0" max="8" value={design.border} onChange={(e) => update("border", Math.min(8, Math.max(0, +e.target.value)))} /> px</span></div><input className="full-range" type="range" min="0" max="8" value={design.border} onChange={(e) => update("border", +e.target.value)}/></div>
            <div className="control-group"><div className="control-row"><label className="control-label">Corner radius</label><span className="number-unit"><input type="number" min="0" max="32" value={design.radius} onChange={(e) => update("radius", Math.min(32, Math.max(0, +e.target.value)))}/> px</span></div><input className="full-range" type="range" min="0" max="32" value={design.radius} onChange={(e) => update("radius", +e.target.value)}/></div>
            <div className="control-group"><label className="control-label">Typography</label><select className="text-input" value={design.font} onChange={(e) => update("font", e.target.value)}><option>Arial</option><option>Georgia</option><option>Verdana</option><option>Trebuchet MS</option><option>Courier New</option></select></div>
            <div className="control-group"><label className="control-label">Name size</label><div className="range-row"><input type="range" min="16" max="34" value={design.size * .24} onChange={(e) => update("size", Math.round(+e.target.value / .24))}/><span>{Math.round(design.size * .24)} px</span></div></div>
            <button className="reset-link" onClick={() => applyTemplate(template)}>Reset appearance to template defaults</button>
          </>}
          {section === "Images" && <>
            <div className="section-title-row"><div><h2>Images & logo</h2><p>Files stay on your device and are not uploaded.</p></div></div>
            <ImageControl label="Profile photo" value={design.photo} onChange={(e) => loadImage(e, "photo")} onRemove={() => update("photo", "")} />
            <ImageControl label="Organization logo" value={design.logo} onChange={(e) => loadImage(e, "logo")} onRemove={() => update("logo", "")} />
            <div className="control-group"><label className="control-label">Photo shape</label><div className="segmented"><button className={!design.portrait ? "on" : ""} onClick={() => update("portrait", false)}>Circle</button><button className={design.portrait ? "on" : ""} onClick={() => update("portrait", true)}>Rounded</button></div></div>
            <div className="form-note">PNG, JPEG, or WebP · max 5 MB. Uploaded images are embedded in your saved design.</div>
          </>}
        </div>
        <div className="left-footer"><button className="projects-link" onClick={() => setShowProjects(true)}>▤ <span>My saved designs</span><span className="saved-count">{saved.length}</span></button><button className="projects-link" onClick={() => { if (confirm("Reset the design and clear current changes?")) { setDesign(defaultProject); setNotice("Design reset to starter card."); } }}><span className="footer-reset">Reset design</span></button></div>
      </aside>

      <section className={`canvas-panel ${mobileView !== "Preview" ? "mobile-hide" : ""}`}>
        <div className="canvas-toolbar"><div className="canvas-heading"><span className="eyebrow">LIVE PREVIEW</span><span className="preview-label">{template.name} · {design.side === "front" ? "Front side" : "Back side"}</span></div><div className="canvas-actions"><button className={`view-toggle ${design.side === "front" ? "selected" : ""}`} onClick={() => update("side", "front")}>Front</button><button className={`view-toggle ${design.side === "back" ? "selected" : ""}`} onClick={() => update("side", "back")}>Back</button><span className="toolbar-divider"/><button className="zoom-btn" aria-label="Zoom out" onClick={() => setZoom(Math.max(.55, +(zoom - .1).toFixed(2)))}><Icon name="zoomout"/></button><span className="zoom-value">{Math.round(zoom * 100)}%</span><button className="zoom-btn" aria-label="Zoom in" onClick={() => setZoom(Math.min(1.35, +(zoom + .1).toFixed(2)))}><Icon name="zoomin"/></button><button className="fit-btn" onClick={() => setZoom(1)}>Fit</button></div></div>
        <div className="canvas-stage"><div className="canvas-grid"/><div className="card-wrap" style={{ width: design.portrait ? 290 : 460, maxWidth: "90%" }}>
          <div className={`id-card card-${template.style} ${design.side === "back" ? "card-back" : ""}`} style={cardStyle}>
            <CardFace design={design} template={template} isBack={design.side === "back"}/>
          </div>
          <div className="canvas-caption"><span><span className="caption-dot"/> Live preview</span><span>CR80 · 85.6 × 54 mm</span></div>
        </div><div className="stage-hint"><span>⌘</span> Scroll to zoom <i/> Drag to pan</div></div>
        <div className="canvas-bottom"><span className="privacy-note"><span className="lock-symbol">♢</span> Your information stays in this browser</span><button onClick={() => setShowProjects(true)} className="manage-projects">Manage saved designs <span>→</span></button></div>
      </section>

      <aside className={`right-panel ${mobileView !== "Details" ? "mobile-hide" : ""}`}><div className="right-header"><div><div className="eyebrow">CARD SETTINGS</div><h2>Quick properties</h2></div><button className="icon-btn" aria-label="Reset card properties" onClick={() => applyTemplate(template)}><Icon name="undo"/></button></div>
        <div className="property-block"><div className="property-title"><span className="mini-icon"><Icon name="grid" size={14}/></span><div><b>Card setup</b><small>Physical card dimensions</small></div></div><div className="dimension-box"><span>Standard ID-1</span><b>{design.portrait ? "54 × 85.6" : "85.6 × 54"} <small>mm</small></b><span className="dimension-check"><Icon name="check" size={12}/></span></div><div className="small-row"><span>Orientation</span><span className="right-segment"><button className={!design.portrait ? "on" : ""} onClick={() => update("portrait", false)}>↔</button><button className={design.portrait ? "on" : ""} onClick={() => update("portrait", true)}>↕</button></span></div></div>
        <div className="property-block"><div className="property-title"><span className="mini-icon"><Icon name="sliders" size={14}/></span><div><b>Appearance</b><small>Colors, type & shape</small></div></div><ColorControl label="Card background" value={design.bg} onChange={(v) => update("bg", v)}/><ColorControl label="Brand accent" value={design.accent} onChange={(v) => update("accent", v)}/><div className="small-row"><span>Corner radius</span><div className="right-range"><input type="range" min="0" max="32" value={design.radius} onChange={(e) => update("radius", +e.target.value)}/><span>{design.radius}px</span></div></div></div>
        <div className="property-block"><div className="property-title"><span className="mini-icon"><Icon name="type" size={14}/></span><div><b>Typography</b><small>Fonts and readability</small></div></div><label className="control-label small-label">Typeface</label><select className="text-input compact" value={design.font} onChange={(e) => update("font", e.target.value)}><option>Arial</option><option>Georgia</option><option>Verdana</option><option>Trebuchet MS</option></select><div className="small-row"><span>Font scale</span><span>{Math.round(design.size)}%</span></div><input className="full-range" type="range" min="80" max="120" value={design.size} onChange={(e) => update("size", +e.target.value)}/></div>
        <div className="export-hint"><span className="export-icon"><Icon name="download" size={16}/></span><div><b>Two-sided A4 print sheet</b><p>Front and back sit side-by-side at exact card size, with cut guides and an 8 mm gap. Print at 100% / Actual size.</p></div></div>
        <button className="button button-primary export-wide" onClick={printCard}><Icon name="download"/> Export card as PDF</button>
        <button className="outline-wide" onClick={saveProject}><Icon name="save"/> Save this design</button>
        <div className="safe-note">◈ &nbsp;Designed for authorized school, work and membership use.</div>
      </aside>
    </div>
    {notice && <div className="toast" role="status">{notice}</div>}
    {showProjects && <div className="modal-backdrop" onClick={() => setShowProjects(false)}><div className="projects-modal" role="dialog" aria-modal="true" aria-labelledby="saved-title" onClick={(e) => e.stopPropagation()}><div className="modal-head"><div><div className="eyebrow">ON THIS DEVICE</div><h2 id="saved-title">Saved designs</h2></div><button className="icon-btn" aria-label="Close" onClick={() => setShowProjects(false)}><Icon name="close"/></button></div><p className="modal-note">Your designs are stored locally in this browser. They are not sent to a server.</p>{saved.length ? saved.map((p) => <div className="saved-row" key={p.name}><div className="saved-thumb" style={{ background: p.data.bg, borderColor: p.data.accent }}><span style={{ background: p.data.accent }}/></div><div className="saved-info"><b>{p.name}</b><small>{templates.find((t) => t.id === p.data.template)?.name || "Custom design"}</small></div><button className="button button-quiet open-saved" onClick={() => restoreProject(p)}>Open</button><button className="tiny-action remove" title={`Delete ${p.name}`} onClick={() => { const next = saved.filter((x) => x.name !== p.name); try { localStorage.setItem("card-studio-projects", JSON.stringify(next)); setSaved(next); } catch {} }}>×</button></div>) : <div className="empty-projects"><span>▤</span><b>No saved designs yet</b><small>Save a design to pick up where you left off.</small><button className="button button-primary" onClick={saveProject}><Icon name="save"/> Save current design</button></div>}<div className="modal-actions"><button className="outline-wide" onClick={() => { const json = JSON.stringify(design, null, 2); const url = URL.createObjectURL(new Blob([json], { type: "application/json" })); const a = document.createElement("a"); a.href = url; a.download = `${design.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.json`; a.click(); URL.revokeObjectURL(url); setNotice("Design configuration exported."); }}>Export design file</button><label className="outline-wide import-label">Import design<input type="file" accept="application/json,.json" onChange={(e) => { const f = e.target.files?.[0]; if (!f) return; const reader = new FileReader(); reader.onload = () => { try { const d = JSON.parse(String(reader.result)); if (!d || !Array.isArray(d.fields) || !templates.some((t) => t.id === d.template)) throw new Error(); setDesign({ ...defaultProject, ...d }); setShowProjects(false); setNotice("Design imported."); } catch { setNotice("That design file is invalid or incompatible."); } }; reader.readAsText(f); e.target.value = ""; }}/></label></div></div></div>}
    <div className="print-area">
      <div className="print-sheet">
        {(["front", "back"] as const).map((side) => <div className="print-card" key={side} style={{ width: design.portrait ? "53.98mm" : "85.6mm", height: design.portrait ? "85.6mm" : "53.98mm" }}>
          <div className={`id-card card-${template.style} ${side === "back" ? "card-back" : ""}`} style={{ ...cardStyle, transform: "none", width: design.portrait ? "53.98mm" : "85.6mm", height: design.portrait ? "85.6mm" : "53.98mm", aspectRatio: "auto" }}><CardFace design={design} template={template} isBack={side === "back"}/></div>
        </div>)}
      </div>
    </div>
  </main>;
}

function MiniCard({ template: t }: { template: Template }) {
  const previewDesign = { ...defaultProject, template: t.id, accent: t.accent, bg: t.bg, ink: t.ink, font: t.font };
  const background = t.style === "gradient" ? `linear-gradient(135deg, ${t.accent}, #392984)` : t.bg;
  return <span className="template-mini"><span className={`id-card card-${t.style}`} style={{ width: 290, height: 182.8, aspectRatio: "auto", transform: "scale(.4)", transformOrigin: "top left", background, color: t.ink, borderRadius: 14, border: `1px solid ${t.accent}`, fontFamily: t.font }}><CardFace design={previewDesign} template={t} isBack={false}/></span></span>;
}

function CardFace({ design, template, isBack }: { design: Project; template: Template; isBack: boolean }) {
  const enabled = design.fields.filter((f) => f.enabled && f.value.trim());
  const name = design.fields.find((f) => f.key === "name")?.value || "Your name";
  const org = design.fields.find((f) => f.key === "org")?.value || "Your organization";
  const id = design.fields.find((f) => f.key === "id")?.value || "ID NUMBER";
  if (isBack) return <div className="back-layout"><div className="back-band" style={{ background: design.accent }}/>{design.logo && <img className="back-logo" src={design.logo} alt="Organization logo"/>}<div className="back-org">{org}</div><div className="back-fields">{enabled.filter((f) => !["name", "org"].includes(f.key)).map((f) => <div key={f.key}><b>{f.label}</b><span>{f.value}</span></div>)}</div><div className="back-disclaimer">If found, please return this card to the issuing organization.</div><div className="back-id">{id}</div></div>;
  return <div className={`card-layout layout-${template.style} ${design.portrait ? "layout-portrait" : ""}`}>
    <div className="card-topline" style={{ background: design.accent }}/>
    <div className="card-brand">{design.logo ? <img src={design.logo} alt="Organization logo"/> : <span className="brand-initial" style={{ background: design.accent }}>{org.trim().charAt(0).toUpperCase()}</span>}<span className="org-name">{org}</span><span className="card-kind">{template.style === "health" ? "STAFF" : template.category === "Education" ? "STUDENT" : template.category.toUpperCase()}</span></div>
    <div className="card-main"><div className="photo-frame" style={{ borderColor: design.accent, borderRadius: design.portrait ? 12 : "50%" }}>{design.photo ? <img src={design.photo} alt="Profile"/> : <span className="avatar-placeholder">{name.split(/\s+/).map((x) => x[0]).slice(0, 2).join("").toUpperCase()}</span>}</div><div className="person-info"><div className="card-pretitle" style={{ color: design.accent }}>{template.style === "health" ? "AUTHORIZED PERSONNEL" : template.style === "member" ? "MEMBER CARD" : "IDENTIFICATION"}</div><div className="person-name" style={{ fontSize: `${Math.round(21 * design.size / 100)}px` }}>{name || "Your name"}</div><div className="person-role">{design.fields.find((f) => f.key === "role")?.value || "Role or class"}</div><div className="card-details">{enabled.filter((f) => !["name", "org", "role", "id"].includes(f.key)).slice(0, 2).map((f) => <span key={f.key}><b>{f.label}</b> {f.value}</span>)}</div></div></div>
    <div className="card-bottom"><div className="card-id"><small>CARD NUMBER</small><b>{id}</b></div><div className="card-chip" style={{ background: design.accent }}/><div className="card-watermark" style={{ color: design.accent }}>●</div></div>
    {template.style === "classic" && <div className="classic-frame" style={{ borderColor: design.accent }}/>}{template.style === "creative" && <div className="creative-orb" style={{ background: design.accent }}/>}<div className="card-texture"/>
  </div>;
}

function ColorControl({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) { return <div className="color-control"><label className="control-label">{label}</label><div className="color-input-wrap"><input aria-label={`${label} color`} type="color" value={/^#[0-9a-f]{6}$/i.test(value) ? value : "#ffffff"} onChange={(e) => onChange(e.target.value)}/><input aria-label={`${label} hex value`} value={value} onChange={(e) => onChange(e.target.value)} maxLength={7}/></div></div>; }
function ImageControl({ label, value, onChange, onRemove }: { label: string; value: string; onChange: (e: ChangeEvent<HTMLInputElement>) => void; onRemove: () => void }) { return <div className="image-control"><div className="image-preview">{value ? <img src={value} alt="Uploaded asset preview"/> : <Icon name="image" size={22}/>}</div><div className="image-control-info"><b>{label}</b><small>PNG, JPEG, WebP · 5 MB max</small><div className="image-buttons"><label className="upload-button">{value ? "Replace" : "Upload image"}<input type="file" accept="image/png,image/jpeg,image/webp" onChange={onChange}/></label>{value && <button className="remove-image" onClick={onRemove}>Remove</button>}</div></div></div>; }
