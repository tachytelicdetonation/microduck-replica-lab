import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
await mkdir(new URL("../public/docs/", import.meta.url), { recursive: true });
await cp(
  new URL("../docs/", import.meta.url),
  new URL("../public/docs/", import.meta.url),
  { recursive: true },
);
await cp(
  new URL("../hardware/", import.meta.url),
  new URL("../public/hardware/", import.meta.url),
  { recursive: true },
);
await cp(
  new URL("../THIRD_PARTY_NOTICES.md", import.meta.url),
  new URL("../public/THIRD_PARTY_NOTICES.md", import.meta.url),
);

// Render the authored purchasing documents for browsers. This small renderer
// handles their headings, paragraphs, lists and tables; Markdown remains canonical.
const escape = (s) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
function inline(s) {
  return escape(s)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => {
      const href = url.replace(/^\.\.\/public\//, "/").replace("PRINT_SERVICE_BRIEF.md", "PRINT_SERVICE_BRIEF.html").replace("PROCUREMENT_US.md", "PROCUREMENT_US.html").replace("PROCUREMENT_CN.md", "PROCUREMENT_CN.html");
      return `<a href="${href}">${label}</a>`;
    })
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}
function documentBody(markdown) {
  const lines = markdown.split(/\r?\n/);
  const output = [];
  for (let i = 0; i < lines.length;) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    const heading = /^(#{1,6}) (.+)/.exec(line);
    if (heading) {
      const level = heading[1].length;
      output.push(`<h${level}>${inline(heading[2])}</h${level}>`); i++; continue;
    }
    if (line.startsWith("|")) {
      const rows = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        const cells = lines[i++].replace(/^\||\|$/g, "").split("|").map(s => s.trim());
        if (cells.every(s => /^:?-+:?$/.test(s))) continue;
        rows.push(cells);
      }
      output.push('<div class="table-scroll" role="region" aria-label="Supplier table" tabindex="0"><table>');
      rows.forEach((row, n) => {
        const tag = n === 0 ? "th" : "td";
        output.push(`<tr>${row.map(c => `<${tag}${n === 0 ? ' scope="col"' : ''}>${inline(c)}</${tag}>`).join("")}</tr>`);
      });
      output.push("</table></div>"); continue;
    }
    if (/^(- |\d+\. )/.test(line)) {
      const tag = line.startsWith("- ") ? "ul" : "ol";
      output.push(`<${tag}>`);
      while (i < lines.length && /^(- |\d+\. )/.test(lines[i])) {
        output.push(`<li>${inline(lines[i++].replace(/^(- |\d+\. )/, ""))}</li>`);
      }
      output.push(`</${tag}>`); continue;
    }
    const paragraph = [];
    while (i < lines.length && lines[i].trim() && !/^(#|\||- |\d+\. )/.test(lines[i])) paragraph.push(lines[i++]);
    output.push(`<p>${inline(paragraph.join(" "))}</p>`);
  }
  return output.join("\n");
}
for (const name of ["PROCUREMENT_US", "PROCUREMENT_CN", "PRINT_SERVICE_BRIEF"]) {
  const source = await readFile(new URL(`../docs/${name}.md`, import.meta.url), "utf8");
  const title = source.split("\n")[0].replace(/^# /, "");
  await writeFile(new URL(`../public/docs/${name}.html`, import.meta.url), `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(title)} · Microduck</title>
<style>
:root{color-scheme:dark}*{box-sizing:border-box}body{margin:0;background:#181c1d;color:#e2e8e3;font:16px/1.7 system-ui,sans-serif}main{max-width:1240px;margin:auto;padding:32px 24px 80px}nav{display:flex;gap:14px;flex-wrap:wrap;font-size:13px;border-bottom:1px solid #36413c;padding-bottom:18px}a{color:#c7fa70;text-underline-offset:3px;overflow-wrap:anywhere}h1{font-size:clamp(28px,4vw,42px);line-height:1.2;margin:38px 0 24px}h2{margin:44px 0 16px;font-size:25px;line-height:1.3}h3{margin-top:28px}p,li{color:#b8c5bf}strong{color:#eef2ed}code{background:#28312d;padding:2px 5px;border-radius:3px;font-size:.88em}.table-scroll{overflow-x:auto;border:1px solid #36413c;border-radius:7px;margin:20px 0}table{border-collapse:collapse;width:100%;font-size:13px;line-height:1.6}th{text-align:left;color:#c7fa70;background:#242c27}td,th{padding:13px 15px;border-bottom:1px solid #36413c;vertical-align:top;min-width:95px}td:nth-child(2){min-width:180px}td:nth-child(3){min-width:230px}td:last-child{min-width:240px}li{margin-bottom:10px}@media(max-width:600px){main{padding:20px 16px 60px}body{font-size:15px}}@media print{:root{color-scheme:light}body{background:white;color:black}p,li,strong{color:black}a{color:#17402a}nav{display:none}.table-scroll{overflow:visible}td,th{min-width:0!important;font-size:9px;padding:5px}h2{break-after:avoid}}
</style></head><body><main><nav><a href="/">← Microduck workbench</a><a href="/docs/PROCUREMENT_US.html">US shopping guide</a><a href="/docs/PROCUREMENT_CN.html">China sourcing guide</a><a href="/hardware/procurement-us.csv" download>US shopping CSV</a><a href="/hardware/procurement-cn.csv" download>China comparison CSV</a><a href="/models/microduck-fit-check.zip" download>Fit-check ZIP</a><a href="/models/microduck-print-quote.zip" download>Full print quote ZIP</a><a href="/models/microduck-hat-quote.zip" download>HAT quote ZIP</a><a href="${name}.md" download>Download Markdown</a></nav>${documentBody(source)}</main></body></html>`);
}
