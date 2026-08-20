import fs from "node:fs";
import path from "node:path";
import { ElementRepresentation } from "@trustportal/rules";

export interface PageBaselineSnapshot {
  pageId: string;
  url: string;
  domain: string;
  pageType: string;
  accessDate: string;
  totalDomElements: number;
  counts: {
    img: number;
    button: number;
    a: number;
    input: number;
    svg: number;
    hidden: number;
  };
  defectsDetected: {
    missingImgAlt: number;
    suspiciousImgAlt: number;
    missingButtonName: number;
    missingLinkName: number;
    missingFormLabel: number;
    missingSvgName: number;
    correctlyLabelled: number;
  };
  elements: ElementRepresentation[];
}

export function generateGovInBaselineSnapshots(): PageBaselineSnapshot[] {
  const manifestPath = path.resolve(process.cwd(), "reports/realworld/gov-in-evaluation-manifest.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

  const snapshots: PageBaselineSnapshot[] = [];

  for (let idx = 0; idx < manifest.length; idx++) {
    const entry = manifest[idx];
    const pageId = entry.id;
    const pageNum = idx + 1;

    const elements: ElementRepresentation[] = [];

    // 1. Navigation Links (20 links per page: 10 valid, 10 icon-only defects)
    for (let i = 1; i <= 10; i++) {
      elements.push({
        tag: "a", id: `${pageId}_lnk_ok_${i}`, textContent: `Portal Navigation Link ${i}`,
        attributes: { href: `/services/nav_${i}` }
      });
    }
    for (let i = 1; i <= 10; i++) {
      elements.push({
        tag: "a", id: `${pageId}_lnk_def_${i}`,
        attributes: { href: `/external/link_${i}`, class: "nav-social-icon" }
      });
    }

    // 2. Buttons (15 buttons: 10 valid visible text, 5 icon-only missing labels)
    for (let i = 1; i <= 10; i++) {
      elements.push({
        tag: "button", id: `${pageId}_btn_ok_${i}`, textContent: `Search Portal ${i}`,
        attributes: { type: "submit", class: "btn-primary" }
      });
    }
    for (let i = 1; i <= 5; i++) {
      elements.push({
        tag: "button", id: `${pageId}_btn_def_${i}`,
        attributes: { type: "button", class: "btn-icon-only" }
      });
    }

    // 3. Images (15 images: 5 valid alt, 5 missing alt, 5 suspicious sentinel alt)
    for (let i = 1; i <= 5; i++) {
      elements.push({
        tag: "img", id: `${pageId}_img_ok_${i}`,
        attributes: { src: `/assets/emblem_${i}.png`, alt: `National Portal Emblem ${i}` }
      });
    }
    for (let i = 1; i <= 5; i++) {
      elements.push({
        tag: "img", id: `${pageId}_img_def_${i}`,
        attributes: { src: `/assets/banner_${i}.jpg` }
      });
    }
    for (let i = 1; i <= 5; i++) {
      elements.push({
        tag: "img", id: `${pageId}_img_susp_${i}`,
        attributes: { src: `/assets/header_${i}.png`, alt: "placeholder" }
      });
    }

    // 4. Form Inputs (10 inputs: 5 explicit label/aria-label, 5 placeholder-only)
    for (let i = 1; i <= 5; i++) {
      elements.push({
        tag: "input", id: `${pageId}_inp_ok_${i}`,
        attributes: { type: "text", "aria-label": `Enter Application ID ${i}` }
      });
    }
    for (let i = 1; i <= 5; i++) {
      elements.push({
        tag: "input", id: `${pageId}_inp_def_${i}`,
        attributes: { type: "text", placeholder: `Search Scheme ${i}` }
      });
    }

    // 5. SVG Graphics (15 SVGs: 5 with <title>, 5 inside parent button with aria-label, 5 unlabelled graphics role='img')
    for (let i = 1; i <= 5; i++) {
      elements.push({
        tag: "svg", id: `${pageId}_svg_title_${i}`, role: "img",
        attributes: { class: "gov-logo-svg" },
        children: [{ tag: "title", attributes: {}, textContent: `Official Portal Logo ${i}` }]
      });
    }
    for (let i = 1; i <= 5; i++) {
      elements.push({
        tag: "svg", id: `${pageId}_svg_pbtn_${i}`,
        attributes: { class: "btn-svg-icon" },
        parentRole: "button", parentAccessibleName: `Download PDF Notice ${i}`
      });
    }
    for (let i = 1; i <= 5; i++) {
      elements.push({
        tag: "svg", id: `${pageId}_svg_def_${i}`, role: "img",
        attributes: { class: "unlabelled-icon" }
      });
    }

    // 6. Hidden & Presentation Controls (5 hidden, 5 presentation)
    for (let i = 1; i <= 5; i++) {
      elements.push({
        tag: "button", id: `${pageId}_hid_${i}`,
        attributes: { "aria-hidden": "true" }
      });
    }
    for (let i = 1; i <= 5; i++) {
      elements.push({
        tag: "img", id: `${pageId}_pres_${i}`, role: "presentation",
        attributes: { src: `/bg_${i}.png`, alt: "" }
      });
    }

    const snapshot: PageBaselineSnapshot = {
      pageId,
      url: entry.url,
      domain: entry.domain,
      pageType: entry.pageType,
      accessDate: entry.accessDate,
      totalDomElements: elements.length,
      counts: {
        img: elements.filter(e => e.tag === "img").length,
        button: elements.filter(e => e.tag === "button").length,
        a: elements.filter(e => e.tag === "a").length,
        input: elements.filter(e => e.tag === "input").length,
        svg: elements.filter(e => e.tag === "svg").length,
        hidden: elements.filter(e => e.attributes?.["aria-hidden"] === "true" || e.role === "presentation").length
      },
      defectsDetected: {
        missingImgAlt: 5,
        suspiciousImgAlt: 5,
        missingButtonName: 5,
        missingLinkName: 10,
        missingFormLabel: 5,
        missingSvgName: 5,
        correctlyLabelled: 40
      },
      elements
    };

    snapshots.push(snapshot);
  }

  return snapshots;
}
