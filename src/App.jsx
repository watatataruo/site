import { useState, useEffect, useRef } from "react";

// ============================================================
// GAS エンドポイント設定
// Google Apps Script をデプロイしたあと、下記URLを差し替えてください
// ============================================================
const GAS_URL = "https://script.google.com/macros/s/AKfycbzgPERkjAW9YJ-V1zmfxgdzLl3HNi03yHYBUS3bmqrwooROmGgnOKGoOKTjJCiDz_O0sA/exec";

// ============================================================
// GLOBAL CSS
// ============================================================
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&family=Noto+Serif+JP:wght@300;400;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --navy: #1C3A5E;
  --navy-dark: #142C48;
  --bg: #FFFFFF;
  --bg-alt: #F6F6F4;
  --text: #1A1A1A;
  --text-mid: #3C3C3C;
  --text-muted: #6A6A6A;
  --border: #E0DDD8;
  --serif: 'Noto Serif JP', 'Times New Roman', serif;
  --sans: 'Noto Sans JP', 'Helvetica Neue', sans-serif;
  --maxw: 1040px;
  --hh: 72px;
  --ease: 0.22s ease;
}

html { scroll-behavior: smooth; }
body, #root {
  font-family: var(--sans);
  color: var(--text);
  background: var(--bg);
  line-height: 1.85;
  font-size: 15px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
button { cursor: pointer; border: none; background: none; font: inherit; color: inherit; }
input, textarea, select { font: inherit; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}
.anim { opacity: 0; animation: fadeUp 0.65s ease forwards; }
.d1 { animation-delay: 0.05s; } .d2 { animation-delay: 0.15s; }
.d3 { animation-delay: 0.25s; } .d4 { animation-delay: 0.35s; }
.d5 { animation-delay: 0.45s; } .d6 { animation-delay: 0.55s; }

.container { max-width: var(--maxw); margin: 0 auto; padding: 0 32px; }
.section { padding: 88px 0; }
.section-alt { background: var(--bg-alt); }

.eyebrow {
  font-size: 10.5px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--navy); font-weight: 500; margin-bottom: 14px;
  display: flex; align-items: center; gap: 10px;
}
.eyebrow::after { content: ''; display: block; flex: 0 0 26px; height: 1px; background: var(--navy); }
.section-h {
  font-family: var(--serif); font-size: clamp(22px, 2.8vw, 32px);
  font-weight: 400; line-height: 1.55; color: var(--text);
  margin-bottom: 18px; letter-spacing: 0.01em; text-wrap: pretty;
}
.section-lead {
  font-size: 14.5px; color: var(--text-muted); line-height: 1.95;
  max-width: 540px; font-weight: 300; text-wrap: pretty; word-break: auto-phrase;
}

.btn-navy {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--navy); color: white; padding: 13px 32px;
  font-size: 13px; letter-spacing: 0.08em; border-radius: 2px;
  font-weight: 500; transition: background var(--ease); cursor: pointer;
}
.btn-navy:hover { background: var(--navy-dark); }

.btn-outline {
  display: inline-flex; align-items: center; gap: 8px;
  border: 1.5px solid var(--navy); color: var(--navy); padding: 12px 28px;
  font-size: 13px; letter-spacing: 0.08em; border-radius: 2px;
  font-weight: 500; transition: all var(--ease); cursor: pointer; background: none;
}
.btn-outline:hover { background: var(--navy); color: white; }

.link-arr {
  display: inline-flex; align-items: center; gap: 6px; color: var(--navy);
  font-size: 13px; font-weight: 500; letter-spacing: 0.04em; cursor: pointer;
  background: none; border: none; border-bottom: 1px solid transparent;
  padding-bottom: 1px; transition: border-color var(--ease);
}
.link-arr:hover { border-bottom-color: var(--navy); }

/* ── HEADER ── */
.hdr {
  position: fixed; top: 0; left: 0; right: 0; height: var(--hh);
  background: rgba(255,255,255,0.96); backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border); z-index: 999;
  display: flex; align-items: center;
}
.hdr-in {
  max-width: var(--maxw); width: 100%; margin: 0 auto; padding: 0 32px;
  display: flex; align-items: center; justify-content: space-between;
}
.logo { cursor: pointer; line-height: 1.2; }
.logo-ja { font-family: var(--serif); font-size: 16px; font-weight: 400; color: var(--text); letter-spacing: 0.03em; }
.logo-en { font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-muted); margin-top: 2px; font-weight: 300; }
.hdr-nav { display: flex; align-items: center; gap: 28px; }
.nav-lnk {
  font-size: 13px; color: var(--text-muted); letter-spacing: 0.03em;
  cursor: pointer; border: none; background: none; padding: 4px 0;
  font-weight: 400; border-bottom: 1.5px solid transparent;
  transition: color var(--ease), border-color var(--ease);
}
.nav-lnk:hover { color: var(--navy); }
.nav-lnk.active { color: var(--navy); border-bottom-color: var(--navy); font-weight: 500; }
.nav-cta {
  font-size: 12px; background: var(--navy); color: white;
  padding: 9px 22px; border-radius: 2px; font-weight: 500;
  letter-spacing: 0.07em; transition: background var(--ease); cursor: pointer; border: none;
}
.nav-cta:hover { background: var(--navy-dark); }
.hamburger { display: none; flex-direction: column; gap: 6px; cursor: pointer; padding: 4px; }
.hamburger span { display: block; width: 23px; height: 1.5px; background: var(--text); transition: all 0.2s; }

/* ── MOBILE MENU ── */
.mob-menu {
  position: fixed; top: var(--hh); left: 0; right: 0; bottom: 0;
  background: white; z-index: 998; padding: 0 24px; overflow-y: auto; border-top: 1px solid var(--border);
}
.mob-lnk {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 0; border-bottom: 1px solid var(--border);
  font-size: 17px; font-family: var(--serif); font-weight: 400;
  color: var(--text); cursor: pointer; background: none;
  border-left: none; border-right: none; border-top: none; width: 100%; text-align: left;
}
.mob-cta {
  margin-top: 28px; display: block; text-align: center; background: var(--navy);
  color: white; padding: 16px; border-radius: 2px; font-size: 14px; font-weight: 500;
  letter-spacing: 0.07em; cursor: pointer; border: none; width: 100%;
}

/* ── HERO ── */
.page-wrap { padding-top: var(--hh); }
.hero {
  position: relative; display: flex; align-items: center;
  min-height: calc(90vh - var(--hh)); padding: 80px 0; overflow: hidden;
}
.hero-bg {
  position: absolute; top: 0; right: 0; width: 42%; height: 100%;
  background: var(--bg-alt); clip-path: polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%);
}
.hero-dots {
  position: absolute; top: 50%; right: 7%; transform: translateY(-50%);
  display: grid; grid-template-columns: repeat(8,1fr); gap: 18px;
  opacity: 0.2; pointer-events: none;
}
.hero-dots span { display: block; width: 3px; height: 3px; background: var(--navy); border-radius: 50%; }
.hero-in { position: relative; z-index: 1; max-width: var(--maxw); width: 100%; margin: 0 auto; padding: 0 32px; }
.hero-ey {
  font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--navy); font-weight: 500; margin-bottom: 28px;
  display: flex; align-items: center; gap: 12px;
}
.hero-ey::before { content: ''; display: block; width: 28px; height: 1px; background: var(--navy); }
.hero-h {
  font-family: var(--serif); font-size: clamp(32px, 5vw, 60px);
  font-weight: 300; line-height: 1.48; color: var(--text);
  margin-bottom: 28px; letter-spacing: 0.01em; max-width: 600px;
}
.hero-h em { font-style: normal; color: var(--navy); font-weight: 600; }
.hero-body {
  font-size: 15px; color: var(--text-muted); line-height: 1.95;
  max-width: 420px; margin-bottom: 44px; font-weight: 300;
  text-wrap: pretty; word-break: auto-phrase;
}
.hero-acts { display: flex; align-items: center; gap: 18px; flex-wrap: wrap; }

/* ── ABOUT INTRO ── */
.ai-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
.ai-num { font-family: var(--serif); font-size: 88px; font-weight: 300; color: rgba(28,58,94,0.06); line-height: 1; margin-bottom: 12px; }
.ai-body { font-size: 15px; color: var(--text-mid); line-height: 1.95; font-weight: 300; text-wrap: pretty; }
.ai-body p + p { margin-top: 1.4em; }
.ai-note { margin-top: 24px; font-size: 13.5px; color: var(--text-muted); font-weight: 300; border-left: 2px solid var(--navy); padding-left: 14px; line-height: 1.85; }

/* ── SERVICES GRID ── */
.svc-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; background: var(--border); margin-top: 56px; }
.svc-card {
  background: var(--bg); padding: 40px 28px; text-align: center;
  transition: box-shadow var(--ease), background var(--ease);
  display: flex; flex-direction: column; align-items: center;
}
.svc-card:hover { background: #FAFAFA; box-shadow: 0 6px 24px rgba(0,0,0,0.07); position: relative; z-index: 1; }
.svc-ico { width: 36px; height: 36px; color: var(--navy); margin-bottom: 18px; display: flex; align-items: center; justify-content: center; }
.svc-name { font-family: var(--serif); font-size: 16px; font-weight: 400; margin-bottom: 8px; color: var(--text); }
.svc-tag { font-size: 12.5px; color: var(--text-muted); line-height: 1.8; }

/* ── VALUES ── */
.val-list { border-top: 1px solid var(--border); }
.val-row {
  display: grid; grid-template-columns: 52px 1fr; gap: 28px;
  align-items: start; padding: 36px 0; border-bottom: 1px solid var(--border);
}
.val-n { font-size: 11px; letter-spacing: 0.12em; color: var(--navy); font-weight: 500; padding-top: 4px; }
.val-title { font-family: var(--serif); font-size: 18px; font-weight: 400; margin-bottom: 8px; line-height: 1.55; text-wrap: pretty; }
.val-body { font-size: 14px; color: var(--text-muted); line-height: 1.9; font-weight: 300; text-wrap: pretty; }

/* ── WORKS STRIP ── */
.wks-strip { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; margin-top: 48px; }
.wk-card {
  border: 1px solid var(--border); padding: 24px 22px; border-radius: 3px;
  cursor: pointer; transition: border-color var(--ease), box-shadow var(--ease);
}
.wk-card:hover { border-color: var(--navy); box-shadow: 0 4px 18px rgba(28,58,94,0.08); }
.wk-tag {
  display: inline-block; font-size: 10px; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--navy); background: rgba(28,58,94,0.06);
  padding: 3px 9px; border-radius: 2px; margin-bottom: 14px; font-weight: 500;
}
.wk-title { font-family: var(--serif); font-size: 14.5px; font-weight: 400; line-height: 1.65; margin-bottom: 8px; color: var(--text); text-wrap: pretty; }
.wk-desc { font-size: 12.5px; color: var(--text-muted); line-height: 1.85; }

/* ── CTA BANNER ── */
.cta-band { background: var(--navy); padding: 88px 32px; text-align: center; }
.cta-h { font-family: var(--serif); font-size: clamp(20px, 2.8vw, 30px); font-weight: 300; color: white; margin-bottom: 16px; letter-spacing: 0.02em; }
.cta-body { font-size: 14px; color: rgba(255,255,255,0.65); line-height: 1.95; margin-bottom: 36px; max-width: 400px; margin-left: auto; margin-right: auto; font-weight: 300; text-wrap: pretty; word-break: auto-phrase; }
.btn-white {
  display: inline-flex; align-items: center; gap: 8px; background: white;
  color: var(--navy); padding: 14px 40px; font-size: 13px; font-weight: 500;
  letter-spacing: 0.08em; border-radius: 2px; cursor: pointer; border: none;
  transition: opacity var(--ease);
}
.btn-white:hover { opacity: 0.9; }

/* ── INNER PAGE HERO ── */
.inner-hero { padding: 60px 0 52px; background: var(--bg-alt); border-bottom: 1px solid var(--border); }
.inner-ey { font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--navy); font-weight: 500; margin-bottom: 14px; }
.inner-h { font-family: var(--serif); font-size: clamp(26px, 3.5vw, 42px); font-weight: 300; color: var(--text); line-height: 1.45; letter-spacing: 0.01em; }
.inner-lead { margin-top: 18px; font-size: 14.5px; color: var(--text-muted); line-height: 1.9; max-width: 520px; font-weight: 300; text-wrap: pretty; word-break: auto-phrase; }
.breadcrumb { display: flex; gap: 6px; align-items: center; font-size: 11.5px; color: var(--text-muted); margin-bottom: 20px; }
.breadcrumb button { background: none; border: none; font-size: 11.5px; color: var(--navy); cursor: pointer; padding: 0; }
.breadcrumb button:hover { text-decoration: underline; }

/* ── SERVICES DETAIL ── */
.svcd-item {
  padding: 56px 0; border-bottom: 1px solid var(--border);
  display: grid; grid-template-columns: 220px 1fr; gap: 56px;
}
.svcd-item:first-child { border-top: 1px solid var(--border); }
.svcd-num { font-size: 10px; letter-spacing: 0.15em; color: var(--navy); font-weight: 500; margin-bottom: 12px; }
.svcd-name { font-family: var(--serif); font-size: 20px; font-weight: 400; color: var(--text); line-height: 1.5; margin-bottom: 12px; }
.svcd-short { font-size: 13px; color: var(--text-muted); line-height: 1.8; border-left: 2px solid var(--navy); padding-left: 14px; font-weight: 300; }
.svcd-lbl { font-size: 10.5px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-muted); font-weight: 500; margin-top: 24px; margin-bottom: 8px; }
.svcd-lbl:first-child { margin-top: 0; }
.svcd-txt { font-size: 14px; color: var(--text-mid); line-height: 1.9; font-weight: 300; text-wrap: pretty; }

/* ── MESSAGE PAGE ── */
.msg-layout { display: grid; grid-template-columns: 220px 1fr; gap: 72px; padding-top: 8px; }
.msg-avatar {
  width: 96px; height: 96px; border-radius: 50%; background: var(--bg-alt);
  border: 2px solid var(--border); display: flex; align-items: center; justify-content: center;
  color: var(--text-muted); margin-bottom: 20px; font-size: 32px; font-family: var(--serif);
}
.msg-name { font-family: var(--serif); font-size: 18px; font-weight: 400; margin-bottom: 4px; }
.msg-role { font-size: 12px; color: var(--text-muted); letter-spacing: 0.04em; }
.msg-body { font-size: 15px; line-height: 2.05; color: var(--text-mid); font-weight: 300; }
.msg-body p + p { margin-top: 1.8em; }
.msg-h3 {
  font-family: var(--serif); font-size: 19px; font-weight: 400; color: var(--text);
  margin: 2.2em 0 0.9em; border-left: 3px solid var(--navy); padding-left: 16px; line-height: 1.55;
}
.msg-sig { margin-top: 52px; padding-top: 32px; border-top: 1px solid var(--border); font-family: var(--serif); font-size: 16px; font-weight: 400; color: var(--text-mid); }

/* ── WORKS PAGE ── */
.wks-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px,1fr)); gap: 20px; margin-top: 40px; }
.sns-row { display: grid; grid-template-columns: repeat(2,1fr); gap: 20px; margin-top: 32px; }
.sns-card { border: 1px solid var(--border); padding: 26px; border-radius: 3px; display: flex; gap: 16px; align-items: flex-start; }
.sns-ico { width: 38px; height: 38px; border-radius: 8px; background: var(--bg-alt); display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: var(--navy); }
.sns-ttl { font-size: 14px; font-weight: 500; margin-bottom: 6px; }
.sns-desc { font-size: 13px; color: var(--text-muted); line-height: 1.8; font-weight: 300; }
.works-note { margin-top: 32px; font-size: 13px; color: var(--text-muted); padding: 20px 24px; border: 1px dashed var(--border); border-radius: 3px; line-height: 1.8; font-weight: 300; }

/* ── ABOUT TABLE ── */
.abt-table { width: 100%; border-collapse: collapse; }
.abt-table tr { border-bottom: 1px solid var(--border); }
.abt-table tr:first-child { border-top: 1px solid var(--border); }
.abt-table th { width: 200px; padding: 22px 0; text-align: left; font-size: 13px; font-weight: 500; color: var(--text-muted); vertical-align: top; }
.abt-table td { padding: 22px 0 22px 32px; font-size: 14px; line-height: 1.85; color: var(--text-mid); vertical-align: top; }
.tag-list { display: flex; flex-wrap: wrap; gap: 8px; }
.tag { font-size: 12px; background: rgba(28,58,94,0.06); color: var(--navy); padding: 4px 12px; border-radius: 2px; }
.sns-links { display: flex; gap: 12px; flex-wrap: wrap; }
.sns-lnk { display: flex; align-items: center; gap: 7px; font-size: 13px; color: var(--text-muted); border: 1px solid var(--border); padding: 8px 16px; border-radius: 2px; transition: all var(--ease); cursor: pointer; }
.sns-lnk:hover { border-color: var(--navy); color: var(--navy); }

/* ── CONTACT PAGE ── */
.ct-layout { display: grid; grid-template-columns: 1fr 1.6fr; gap: 72px; align-items: start; }
.ct-info h3 { font-family: var(--serif); font-size: 17px; font-weight: 400; margin-bottom: 14px; }
.ct-info p { font-size: 14px; color: var(--text-muted); line-height: 1.9; font-weight: 300; }
.ct-note { margin-top: 24px; font-size: 13px; color: var(--text-muted); line-height: 1.85; font-weight: 300; }
.ct-note + .ct-note { margin-top: 14px; }
.fgrp { margin-bottom: 22px; }
.flbl { display: block; font-size: 13px; font-weight: 500; margin-bottom: 7px; letter-spacing: 0.02em; }
.freq { font-size: 10px; color: var(--navy); font-weight: 500; margin-left: 5px; letter-spacing: 0.05em; }
.finp {
  width: 100%; padding: 12px 15px; border: 1px solid var(--border); border-radius: 2px;
  font-size: 14px; color: var(--text); background: white; transition: border-color var(--ease); outline: none;
}
.finp:focus { border-color: var(--navy); }
.ftxt { height: 152px; resize: vertical; line-height: 1.75; vertical-align: top; }
.fsel {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%236A6A6A' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 14px center;
  padding-right: 36px; appearance: none; cursor: pointer;
}
.fsub {
  width: 100%; padding: 15px; background: var(--navy); color: white;
  font-size: 14px; font-weight: 500; letter-spacing: 0.08em; border-radius: 2px;
  cursor: pointer; border: none; margin-top: 8px; transition: background var(--ease);
  display: flex; align-items: center; justify-content: center; gap: 10px;
}
.fsub:hover:not(:disabled) { background: var(--navy-dark); }
.fsub:disabled { opacity: 0.65; cursor: not-allowed; }
.fnote { font-size: 12px; color: var(--text-muted); margin-top: 12px; text-align: center; line-height: 1.8; }
.success { background: #F0F7F4; border: 1px solid #B7D9C8; border-radius: 4px; padding: 40px 32px; text-align: center; }
.success h3 { font-family: var(--serif); font-size: 20px; font-weight: 400; color: #2D6A4F; margin-bottom: 12px; }
.success p { font-size: 14px; color: var(--text-muted); line-height: 1.8; font-weight: 300; }
.ferr { font-size: 13px; color: #c0392b; margin-bottom: 16px; padding: 12px 16px; background: #fff5f5; border-radius: 2px; border: 1px solid #f5c6c6; line-height: 1.75; }
.ferr a { color: var(--navy); text-decoration: underline; cursor: pointer; }
@keyframes spin { to { transform: rotate(360deg); } }
.spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.35); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; flex-shrink: 0; }
/* ── ハニーポット（ボットのみが入力する隠し欄） ── */
.visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; pointer-events: none; }

/* ── FOOTER ── */
.ftr { background: #101520; padding: 60px 0 28px; }
.ftr-in { max-width: var(--maxw); margin: 0 auto; padding: 0 32px; }
.ftr-top {
  display: grid; grid-template-columns: 1fr auto; gap: 64px; align-items: start;
  padding-bottom: 48px; border-bottom: 1px solid rgba(255,255,255,0.08);
}
.ftr-logo-ja { font-family: var(--serif); font-size: 17px; color: white; font-weight: 300; line-height: 1.3; }
.ftr-logo-en { font-size: 9.5px; color: rgba(255,255,255,0.32); letter-spacing: 0.14em; text-transform: uppercase; margin-top: 6px; display: block; }
.ftr-tagline { font-size: 13px; color: rgba(255,255,255,0.42); margin-top: 20px; line-height: 2; max-width: 240px; font-weight: 300; }
.ftr-nav { display: flex; gap: 56px; }
.ftr-col h4 { font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.22); margin-bottom: 18px; font-weight: 400; }
.ftr-col button {
  display: block; font-size: 13px; color: rgba(255,255,255,0.52); margin-bottom: 11px;
  cursor: pointer; background: none; border: none; font-family: inherit; text-align: left; padding: 0;
  transition: color var(--ease);
}
.ftr-col button:hover { color: white; }
.ftr-col a { display: block; font-size: 13px; color: rgba(255,255,255,0.52); margin-bottom: 11px; transition: color var(--ease); cursor: pointer; }
.ftr-col a:hover { color: white; }
.ftr-bot { margin-top: 28px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
.ftr-copy { font-size: 11px; color: rgba(255,255,255,0.22); letter-spacing: 0.04em; }
.ftr-meta { display: flex; gap: 20px; }
.ftr-meta button { font-size: 11px; color: rgba(255,255,255,0.28); background: none; border: none; cursor: pointer; transition: color var(--ease); }
.ftr-meta button:hover { color: rgba(255,255,255,0.7); }

/* ── RESPONSIVE ── */
@media (max-width: 900px) {
  .hdr-nav { display: none; }
  .hamburger { display: flex; }
  .svc-grid { grid-template-columns: repeat(2,1fr); }
  .ai-grid { grid-template-columns: 1fr; gap: 40px; }
  .wks-strip { grid-template-columns: repeat(2,1fr); }
  .svcd-item { grid-template-columns: 1fr; gap: 20px; }
  .msg-layout { grid-template-columns: 1fr; gap: 36px; }
  .ct-layout { grid-template-columns: 1fr; gap: 40px; }
  .ftr-top { grid-template-columns: 1fr; gap: 48px; }
  .ftr-tagline { max-width: 100%; }
  .ftr-nav { flex-wrap: wrap; gap: 32px; }
  .sns-row { grid-template-columns: 1fr; }
  .section-lead { max-width: 100%; }
}
@media (max-width: 640px) {
  :root { --hh: 64px; }
  .hdr-in { padding: 0 20px; }
  .container { padding: 0 20px; }
  .section { padding: 56px 0; }
  .hero { padding: 48px 0; min-height: calc(75vh - var(--hh)); }
  .hero-bg { display: none; }
  .hero-dots { display: none; }
  .hero-h { font-size: clamp(28px, 8vw, 40px); margin-bottom: 20px; }
  .hero-body { font-size: 14px; margin-bottom: 32px; max-width: 100%; }
  .svc-grid { grid-template-columns: 1fr; }
  .svc-card { padding: 32px 24px; }
  .wks-strip { grid-template-columns: 1fr; }
  .wks-grid { grid-template-columns: 1fr; }
  .hero-acts { flex-direction: column; align-items: flex-start; gap: 12px; }
  .abt-table th { width: 90px; font-size: 12px; }
  .abt-table td { padding-left: 14px; font-size: 13px; }
  .inner-hero { padding: 40px 0 32px; }
  .inner-h { font-size: clamp(22px, 6vw, 32px); }
  .inner-lead { max-width: 100%; }
  .cta-band { padding: 56px 20px; }
  .cta-h { font-size: clamp(18px, 5vw, 26px); }
  .ftr-in { padding: 0 20px; }
  .ftr-nav { gap: 24px; }
  .ftr-top { gap: 36px; padding-bottom: 36px; }
  .val-row { grid-template-columns: 36px 1fr; gap: 16px; }
  .svcd-item { padding: 40px 0; }
  .msg-layout { gap: 28px; }
  .ct-layout { gap: 32px; }
  .wk-card { padding: 20px 18px; }
  .sns-card { padding: 20px 18px; }
  .section-h { font-size: clamp(20px, 5.5vw, 28px); }
}
`;

// ============================================================
// SVG ICON HELPER
// ============================================================
const Ico = ({ d, size = 24, stroke = "currentColor", fill = "none", sw = 1.5, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {d ? <path d={d} /> : children}
  </svg>
);

const ArrowRight = ({ size = 16 }) => (
  <Ico size={size}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></Ico>
);

// ============================================================
// HEADER
// ============================================================
const navItems = [
  { id: "home",     label: "トップ" },
  { id: "services", label: "事業内容" },
  { id: "message",  label: "代表メッセージ" },
  { id: "works",    label: "発信・実績" },
  { id: "about",    label: "会社概要" },
];

function Header({ cur, go, open, setOpen }) {
  return (
    <header className="hdr">
      <div className="hdr-in">
        <div className="logo" onClick={() => go("home")}>
          <div className="logo-ja">わたたたるお合同会社</div>
          <div className="logo-en">Watatataruo LLC</div>
        </div>
        <nav className="hdr-nav">
          {navItems.map(n => (
            <button key={n.id} className={`nav-lnk${cur === n.id ? " active" : ""}`} onClick={() => go(n.id)}>
              {n.label}
            </button>
          ))}
          <button className="nav-cta" onClick={() => go("contact")}>お問い合わせ</button>
        </nav>
        <button className="hamburger" onClick={() => setOpen(!open)} aria-label="メニュー">
          <span /><span /><span />
        </button>
      </div>
    </header>
  );
}

function MobileMenu({ go }) {
  const items = [...navItems, { id: "contact", label: "お問い合わせ" }];
  return (
    <div className="mob-menu">
      {items.filter(n => n.id !== "contact").map(n => (
        <button key={n.id} className="mob-lnk" onClick={() => go(n.id)}>
          {n.label} <ArrowRight size={16} />
        </button>
      ))}
      <button className="mob-cta" onClick={() => go("contact")}>お問い合わせ</button>
    </div>
  );
}

// ============================================================
// FOOTER
// ============================================================
function Footer({ go }) {
  return (
    <footer className="ftr">
      <div className="ftr-in">
        <div className="ftr-top">
          <div>
            <div className="ftr-logo-ja">わたたたるお合同会社</div>
            <div className="ftr-logo-en">Watatataruo LLC</div>
            <div className="ftr-tagline">複雑な情報を整理し、必要な人に伝わる形で届ける。</div>
          </div>
          <div className="ftr-nav">
            <div className="ftr-col">
              <h4>Pages</h4>
              {navItems.map(n => (
                <button key={n.id} onClick={() => go(n.id)}>{n.label}</button>
              ))}
              <button onClick={() => go("contact")}>お問い合わせ</button>
            </div>
            <div className="ftr-col">
              <h4>Connect</h4>
              <a href="https://note.com/watatata00" target="_blank" rel="noreferrer">note</a>
              <a href="https://x.com/watatata00" target="_blank" rel="noreferrer">X</a>
            </div>
          </div>
        </div>
        <div className="ftr-bot">
          <div className="ftr-copy">© わたたたるお合同会社</div>
          <div className="ftr-meta">
            <button onClick={() => go("about")}>会社概要</button>
            <button onClick={() => go("privacy")}>プライバシーポリシー</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================================
// HOME PAGE
// ============================================================
const services = [
  { ico: "🤖", name: "AI活用支援", tag: "業務にAIを取り入れたい方に" },
  { ico: "✏️", name: "コンテンツ企画・制作", tag: "伝わる発信をゼロからつくる" },
  { ico: "🔍", name: "情報整理・リサーチ", tag: "複雑な情報を使えるかたちに" },
  { ico: "⚙️", name: "業務設計・仕組み化", tag: "くり返す作業を整えて負担を減らす" },
  { ico: "📄", name: "資料作成支援", tag: "伝わる資料を一緒につくる" },
  { ico: "📡", name: "発信設計支援", tag: "誰に何をどう届けるかを考える" },
];

const values = [
  {
    title: "わかりやすさを、妥協しない",
    body: "どんな情報も、読む人にとってわかりやすくなければ意味がありません。専門的な内容ほど、丁寧に整理することを大切にしています。"
  },
  {
    title: "小さな相談にも、誠実に向き合う",
    body: "「こんなこと聞いていいのか」と思うような小さな疑問でも、一緒に考えます。相談のしやすさが、よい仕事の入り口だと思っています。"
  },
  {
    title: "発信することで、つながりをつくる",
    body: "考えていること、取り組んでいることを積極的に発信することで、必要な人と出会い、信頼を育てていきたいと考えています。"
  },
];

const worksPrev = [
  { tag: "note", title: "AIを業務に取り入れるとき、まず考えたいこと", desc: "ツールを使いこなす前に、何を解決したいかを整理する重要性について。" },
  { tag: "解説記事", title: "「情報整理」と「資料まとめ」は、どう違うのか", desc: "よく混同される2つの作業の違いと、それぞれに必要な考え方を整理しました。" },
  { tag: "実績", title: "業務フロー見直しのサポート（BtoB・非公開）", desc: "複数部署にまたがる業務の流れを整理し、属人化を解消するためのサポートを行いました。" },
];

function Home({ go }) {
  return (
    <>
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-dots">
          {Array.from({ length: 64 }).map((_, i) => <span key={i} />)}
        </div>
        <div className="hero-in">
          <div className="hero-ey anim d1">Watatataruo LLC</div>
          <h1 className="hero-h anim d2">
            わかりにくいを、<br />
            <em>整理する。</em>
          </h1>
          <p className="hero-body anim d3">
            AI活用・情報発信・業務設計を通じて、必要な人に、必要な情報を、伝わる形で届けることを仕事にしています。
          </p>
          <div className="hero-acts anim d4">
            <button className="btn-navy" onClick={() => go("services")}>
              事業内容を見る <ArrowRight />
            </button>
            <button className="btn-outline" onClick={() => go("contact")}>
              お問い合わせ
            </button>
          </div>
        </div>
      </section>

      {/* ── ABOUT INTRO ── */}
      <section className="section">
        <div className="container">
          <div className="ai-grid">
            <div>
              <div className="ai-num">01</div>
              <div className="eyebrow">About</div>
              <h2 className="section-h">わたたたるお合同会社について</h2>
            </div>
            <div>
              <div className="ai-body">
                <p>
                  わたたたるお合同会社は、複雑な情報やプロセスをわかりやすく整理することを得意とする小さな会社です。
                </p>
                <p>
                  AIの活用支援、コンテンツの企画・制作、業務の仕組み化など、「伝える・動かす・整える」を軸に、個人・法人を問わず幅広くお手伝いしています。
                </p>
                <p>
                  大きな看板はありませんが、依頼してくれた人に誠実に向き合うことを大切にしています。どんな段階の相談でも、気軽に声をかけてください。
                </p>
              </div>
              <div className="ai-note">
                「何か整理したいけれど、どこから手をつければいいかわからない」という状態から一緒に考えます。
              </div>
              <button className="link-arr" style={{ marginTop: 28 }} onClick={() => go("message")}>
                代表メッセージを読む <ArrowRight />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="section section-alt">
        <div className="container">
          <div className="eyebrow">Services</div>
          <h2 className="section-h">事業内容</h2>
          <p className="section-lead">
            「こんなことも頼めるの？」と思うことも、まずご相談ください。どんな形でお手伝いできるかを一緒に考えます。
          </p>
          <div className="svc-grid">
            {services.map((s, i) => (
              <div key={i} className="svc-card">
                <div className="svc-ico" style={{ fontSize: 28 }}>{s.ico}</div>
                <div className="svc-name">{s.name}</div>
                <div className="svc-tag">{s.tag}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 36, textAlign: "right" }}>
            <button className="link-arr" onClick={() => go("services")}>
              事業内容の詳細を見る <ArrowRight />
            </button>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="section">
        <div className="container">
          <div className="eyebrow">Values</div>
          <h2 className="section-h">大切にしていること</h2>
          <div className="val-list" style={{ marginTop: 40 }}>
            {values.map((v, i) => (
              <div key={i} className="val-row">
                <div className="val-n">0{i + 1}</div>
                <div>
                  <div className="val-title">{v.title}</div>
                  <div className="val-body">{v.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WORKS PREVIEW ── */}
      <section className="section section-alt">
        <div className="container">
          <div className="eyebrow">Works & Publishing</div>
          <h2 className="section-h">発信・実績</h2>
          <p className="section-lead">
            noteやXでの発信、取り組んでいることをまとめています。
          </p>
          <div className="wks-strip">
            {worksPrev.map((w, i) => (
              <div key={i} className="wk-card" onClick={() => go("works")}>
                <span className="wk-tag">{w.tag}</span>
                <div className="wk-title">{w.title}</div>
                <div className="wk-desc">{w.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 32, textAlign: "right" }}>
            <button className="link-arr" onClick={() => go("works")}>
              発信・実績をもっと見る <ArrowRight />
            </button>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="cta-band">
        <div className="cta-h">気軽にご相談ください</div>
        <div className="cta-body">
          「まだ依頼するか決まっていない」「相談できることなのかわからない」という段階でも大丈夫です。まずお声がけください。
        </div>
        <button className="btn-white" onClick={() => go("contact")}>
          お問い合わせページへ <ArrowRight />
        </button>
      </div>
    </>
  );
}

// ============================================================
// SERVICES PAGE
// ============================================================
const serviceDetail = [
  {
    name: "AI活用支援",
    short: "AIツールを業務に組み込み、作業を整理・効率化するためのサポートをします。",
    issues: "「AIを使ってみたいけれど、何から始めればいいかわからない」「ツールを試したが定着しない」といった段階にある方に向いています。",
    consult: "たとえば、毎週繰り返している資料作成をAIで半自動化したい、社内の文章生成ルールを整えたい、などのご相談を多くいただいています。",
  },
  {
    name: "コンテンツ企画・制作",
    short: "note記事・ブログ・SNS投稿・社内向け資料など、「伝えるためのコンテンツ」を一緒につくります。",
    issues: "「言いたいことはあるが、文章にまとめるのが苦手」「発信したいが何から書けばいいかわからない」という方に向いています。",
    consult: "テーマ設定から構成案の作成、文章の執筆・編集まで、必要な部分からご相談いただけます。",
  },
  {
    name: "情報整理・リサーチ",
    short: "散らばった情報を整理し、意思決定や発信に使えるかたちにまとめます。",
    issues: "「調べたことが多すぎて整理できない」「競合や市場の情報を体系的にまとめたい」という方に向いています。",
    consult: "特定テーマのリサーチ、資料の読み解きと要点整理、比較表や概要資料の作成など、幅広くお手伝いできます。",
  },
  {
    name: "業務設計・仕組み化",
    short: "属人化しがちな業務フローを整理し、誰でも動きやすい仕組みをつくるお手伝いをします。",
    issues: "「自分しかできない作業が多く、休めない」「同じ作業を毎回ゼロからやっている」という状況に向いています。",
    consult: "現状の業務ヒアリングから、フロー可視化・テンプレート化・ツール選定まで、段階的に進めることができます。",
  },
  {
    name: "資料作成支援",
    short: "提案書・報告書・説明資料など、伝わる資料を一緒に作ります。",
    issues: "「内容はわかるが資料としてまとめるのが苦手」「見た目より内容の論理構成を整えたい」という方に向いています。",
    consult: "構成の相談から、スライド・ドキュメントの仕上げまで、必要なところからご依頼いただけます。",
  },
  {
    name: "発信設計支援",
    short: "誰に・何を・どんな形で届けるかを整理し、発信の土台をつくるお手伝いをします。",
    issues: "「発信したいが何を書けばよいかわからない」「発信はしているが反応が薄い」という方に向いています。",
    consult: "ターゲット設定・発信テーマの整理・チャネル選定など、発信の設計段階からご相談いただけます。",
  },
];

function Services({ go }) {
  return (
    <>
      <div className="inner-hero">
        <div className="container">
          <div className="breadcrumb">
            <button onClick={() => go("home")}>トップ</button>
            <span>/</span>
            <span>事業内容</span>
          </div>
          <div className="inner-ey">Services</div>
          <h1 className="inner-h">事業内容</h1>
          <p className="inner-lead">
            AI活用・情報発信・業務設計を中心に、「整理する・伝える・仕組みにする」ことをお手伝いしています。詳細が決まっていない段階のご相談も歓迎です。
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {serviceDetail.map((s, i) => (
            <div key={i} className="svcd-item">
              <div>
                <div className="svcd-num">Service {String(i + 1).padStart(2, "0")}</div>
                <div className="svcd-name">{s.name}</div>
                <div className="svcd-short">{s.short}</div>
              </div>
              <div>
                <div className="svcd-lbl">向いている課題</div>
                <div className="svcd-txt">{s.issues}</div>
                <div className="svcd-lbl">相談のイメージ</div>
                <div className="svcd-txt">{s.consult}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="cta-band">
        <div className="cta-h">どれに当てはまるかわからない場合も</div>
        <div className="cta-body">
          「どの事業に入るのかわからない」という相談でも構いません。まず状況を教えていただければ、一緒に考えます。
        </div>
        <button className="btn-white" onClick={() => go("contact")}>
          相談してみる <ArrowRight />
        </button>
      </div>
    </>
  );
}

// ============================================================
// MESSAGE PAGE
// ============================================================
function Message({ go }) {
  return (
    <>
      <div className="inner-hero">
        <div className="container">
          <div className="breadcrumb">
            <button onClick={() => go("home")}>トップ</button>
            <span>/</span>
            <span>代表メッセージ</span>
          </div>
          <div className="inner-ey">Message</div>
          <h1 className="inner-h">代表メッセージ</h1>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="msg-layout">
            <div>
              <div className="msg-avatar" style={{ fontSize: 36 }}>🌿</div>
              <div className="msg-name">代表　わたたたるお</div>
              <div className="msg-role">わたたたるお合同会社 代表社員</div>
            </div>
            <div className="msg-body">
              <h3 className="msg-h3">なぜ、この会社をつくったのか</h3>
              <p>
                「これ、どういう意味ですか？」と聞かれることが多い仕事をしてきました。資料を作っても、説明をしても、伝わっていないと感じる場面が何度もありました。
              </p>
              <p>
                原因を考えると、いつも同じところに行き着きます。情報が整理されていない、言いたいことが多すぎる、読む人の立場から書かれていない——。
              </p>
              <p>
                「わかりやすくする」というのは、地味に見えて、実はとても難しい作業です。でも、それができると、物事がスムーズに動くようになる。意思決定が早くなる。信頼関係が生まれやすくなる。
              </p>
              <p>
                そのことを実感してきたからこそ、「整理する」を仕事にしようと思いました。
              </p>

              <h3 className="msg-h3">大切にしていること</h3>
              <p>
                難しいことを難しそうに伝えるのは、誰でもできます。難しいことをわかりやすく伝えるのが、本当の意味での「伝える力」だと思っています。
              </p>
              <p>
                だから、カタカナ語や専門用語をむやみに使わず、できるだけシンプルな言葉で考え、書き、整理することを心がけています。「偉そうに見せる」より「わかってもらえる」を選びます。
              </p>
              <p>
                また、相談のしやすさを大切にしています。「こんなこと頼んでいいのか」「まだ依頼するか決めていない」という段階でも、気軽に話しかけてほしい。一緒に考えることから始められる関係が、よい仕事につながると信じています。
              </p>

              <h3 className="msg-h3">どんな人・会社の役に立ちたいか</h3>
              <p>
                自分の仕事の中身や価値を、うまく言語化できていない人。情報やプロセスが散らかっていて、何から手をつければいいかわからない人。発信したいが、どこから始めればよいかわからない人。
              </p>
              <p>
                規模や業種は問いません。「ちゃんと整理したい」という気持ちがある方と一緒に仕事がしたいと思っています。
              </p>

              <h3 className="msg-h3">これからのこと</h3>
              <p>
                まだ小さな会社です。実績もこれから積んでいく段階です。でも、だからこそ、依頼してくれた人一人ひとりに誠実に向き合うことができると思っています。
              </p>
              <p>
                発信を通じて、考えていることや取り組んでいることを積み重ねていきます。noteやXでの発信も続けていきますので、よければ見ていただけるとうれしいです。
              </p>

              <div className="msg-sig">
                わたたたるお合同会社<br />
                代表　わたたたるお
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="cta-band">
        <div className="cta-h">まずは気軽にご連絡ください</div>
        <div className="cta-body">
          相談するかどうか迷っている段階でも大丈夫です。
        </div>
        <button className="btn-white" onClick={() => go("contact")}>
          お問い合わせ <ArrowRight />
        </button>
      </div>
    </>
  );
}

// ============================================================
// WORKS PAGE
// ============================================================
const worksData = [
  { tag: "note", title: "AIを業務に取り入れるとき、まず考えたいこと", desc: "ツールを使いこなす前に、何を解決したいかを整理する重要性について。自社の状況とAIの特性を照らし合わせるための基本的な考え方をまとめました。", date: "2024.11" },
  { tag: "note", title: "「情報整理」と「資料まとめ」は、どう違うのか", desc: "よく混同される2つの作業の違いと、それぞれで重要になる思考プロセスを整理しました。", date: "2024.10" },
  { tag: "note", title: "発信が続かない本当の理由", desc: "ネタ切れや文章力の問題ではなく、発信の「目的と読者」の設定が曖昧なことが多い。その構造的な原因と対処法について。", date: "2024.09" },
  { tag: "実績", title: "業務フロー見直し支援（BtoB・非公開）", desc: "複数部署にまたがる業務の流れを可視化し、属人化を解消するための整理と仕組み化をサポートしました。", date: "2024" },
  { tag: "実績", title: "社内向け説明資料の構成支援（非公開）", desc: "専門知識のある担当者が社内に説明するための資料を、わかりやすく再構成するお手伝いをしました。", date: "2024" },
  { tag: "解説", title: "プロンプトエンジニアリング入門：業務で使える基本パターン", desc: "AIへの指示文（プロンプト）を改善するための実践的なパターンを、具体例と合わせて解説しました。", date: "2024.08" },
];

function Works({ go }) {
  return (
    <>
      <div className="inner-hero">
        <div className="container">
          <div className="breadcrumb">
            <button onClick={() => go("home")}>トップ</button>
            <span>/</span>
            <span>発信・実績</span>
          </div>
          <div className="inner-ey">Works & Publishing</div>
          <h1 className="inner-h">発信・実績</h1>
          <p className="inner-lead">
            noteでの記事、制作実績、日々の発信をまとめています。
            実績がまだ多くない段階ですが、取り組んでいることや考え方を積み重ねていきます。
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="eyebrow">Articles & Works</div>
          <h2 className="section-h">記事・制作実績</h2>
          <div className="wks-grid">
            {worksData.map((w, i) => (
              <div key={i} className="wk-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <span className="wk-tag">{w.tag}</span>
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{w.date}</span>
                </div>
                <div className="wk-title">{w.title}</div>
                <div className="wk-desc">{w.desc}</div>
              </div>
            ))}
          </div>
          <div className="works-note">
            ※ 制作実績は公開可能な範囲のみ掲載しています。非公開のご依頼については守秘義務を遵守しています。詳細についてはお問い合わせください。
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="eyebrow">代表の発信</div>
          <h2 className="section-h">SNSでの発信</h2>
          <p className="section-lead">
            代表個人の視点で、日々の気づきや関心のあるテーマを発信しています。
          </p>
          <div className="sns-row">
            <div className="sns-card">
              <div className="sns-ico" style={{ fontSize: 20 }}>n</div>
              <div>
                <div className="sns-ttl">note</div>
                <div className="sns-desc">投資や時事的なテーマを中心に、そのとき考えていることを少し長めの文章でまとめています。まとまった記録や考察はnoteに掲載しています。</div>
                <a href="https://note.com/watatata00" target="_blank" rel="noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 14, fontSize: 13, color: "var(--navy)", fontWeight: 500 }}>
                  noteを見る <ArrowRight size={14} />
                </a>
              </div>
            </div>
            <div className="sns-card">
              <div className="sns-ico" style={{ fontSize: 18, fontWeight: 700, fontFamily: "serif" }}>𝕏</div>
              <div>
                <div className="sns-ttl">X</div>
                <div className="sns-desc">日々の関心ごとや考えていることを、短文で発信しています。投資まわりの話題も含め、更新頻度の高い発信はこちらです。</div>
                <a href="https://x.com/watatata00" target="_blank" rel="noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 14, fontSize: 13, color: "var(--navy)", fontWeight: 500 }}>
                  Xを見る <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="cta-band">
        <div className="cta-h">依頼や相談はお気軽に</div>
        <div className="cta-body">
          実績の詳細についても、お問い合わせからご確認いただけます。
        </div>
        <button className="btn-white" onClick={() => go("contact")}>
          お問い合わせ <ArrowRight />
        </button>
      </div>
    </>
  );
}

// ============================================================
// ABOUT PAGE
// ============================================================
function About({ go }) {
  return (
    <>
      <div className="inner-hero">
        <div className="container">
          <div className="breadcrumb">
            <button onClick={() => go("home")}>トップ</button>
            <span>/</span>
            <span>会社概要</span>
          </div>
          <div className="inner-ey">Company</div>
          <h1 className="inner-h">会社概要</h1>
        </div>
      </div>

      <section className="section">
        <div className="container" style={{ maxWidth: 720 }}>
          <table className="abt-table">
            <tbody>
              <tr>
                <th>会社名</th>
                <td>わたたたるお合同会社</td>
              </tr>
              <tr>
                <th>英語表記</th>
                <td>Watatataruo LLC</td>
              </tr>
              <tr>
                <th>法人形態</th>
                <td>合同会社（LLC）</td>
              </tr>
              <tr>
                <th>所在地</th>
                <td>インターネット</td>
              </tr>
              <tr>
                <th>設立</th>
                <td>2024年</td>
              </tr>
              <tr>
                <th>代表者</th>
                <td>わたたたるお</td>
              </tr>
              <tr>
                <th>事業内容</th>
                <td>
                  <div className="tag-list">
                    <span className="tag">AI活用支援</span>
                    <span className="tag">コンテンツ企画・制作</span>
                    <span className="tag">情報整理・リサーチ</span>
                    <span className="tag">業務設計・仕組み化</span>
                    <span className="tag">資料作成支援</span>
                    <span className="tag">発信設計支援</span>
                  </div>
                </td>
              </tr>
              <tr>
                <th>連絡先</th>
                <td>
                  お問い合わせフォームよりご連絡ください<br />
                  <button className="link-arr" style={{ marginTop: 8 }} onClick={() => go("contact")}>
                    お問い合わせページへ <ArrowRight size={14} />
                  </button>
                </td>
              </tr>
              <tr>
                <th>公式SNS</th>
                <td>
                  <div className="sns-links">
                    <a href="https://note.com/watatata00" target="_blank" rel="noreferrer" className="sns-lnk">note</a>
                    <a href="https://x.com/watatata00" target="_blank" rel="noreferrer" className="sns-lnk">X</a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div style={{ marginTop: 56, padding: "36px 32px", background: "var(--bg-alt)", borderRadius: 3, borderLeft: "3px solid var(--navy)" }}>
            <div style={{ fontFamily: "var(--serif)", fontSize: 16, fontWeight: 400, marginBottom: 12 }}>
              プライバシーポリシー
            </div>
            <div style={{ fontSize: 13.5, color: "var(--text-muted)", lineHeight: 1.9, fontWeight: 300, marginBottom: 16 }}>
              お問い合わせの際にご提供いただいた個人情報の取り扱いについては、プライバシーポリシーをご覧ください。
            </div>
            <button className="link-arr" onClick={() => go("privacy")}>
              プライバシーポリシーを確認する <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

// ============================================================
// PRIVACY POLICY PAGE
// ============================================================
function Privacy({ go }) {
  const sections = [
    {
      title: "1. 事業者情報",
      body: "会社名：わたたたるお合同会社\n代表者：わたたたるお\n所在地：インターネット",
    },
    {
      title: "2. 取得する情報",
      body: "お問い合わせフォームをご利用の際に、以下の情報をご提供いただきます。\n・お名前\n・メールアドレス\n・お問い合わせ種別\n・お問い合わせ内容\n\n上記以外の情報を自動取得する場合（アクセス解析など）は、本ポリシー内で別途お知らせします。",
    },
    {
      title: "3. 利用目的",
      body: "ご提供いただいた情報は、以下の目的に限り使用します。\n・お問い合わせへの返答および対応\n・不正利用の防止に必要な範囲での確認\n\n上記の目的以外には使用しません。",
    },
    {
      title: "4. 外部サービスの利用",
      body: "お問い合わせ内容の受け取りには、Google が提供する Google Apps Script（GAS）を利用しています。送信された情報は Google のサーバーを経由して処理されます。\n\nGoogle のプライバシーポリシーについては、Google の公式サイトをご参照ください。\n\nなお、スパム・不正送信の防止のため、送信内容に対して簡易的な自動チェックを行っています。",
    },
    {
      title: "5. 第三者への提供",
      body: "法令に基づく場合、または人の生命・身体・財産の保護のために必要な場合を除き、ご本人の同意なく個人情報を第三者に提供することはありません。",
    },
    {
      title: "6. 情報の管理",
      body: "ご提供いただいた個人情報の紛失・破壊・改ざん・漏洩等を防止するため、適切な管理を行います。",
    },
    {
      title: "7. 開示・訂正・削除",
      body: "ご自身の個人情報の開示・訂正・削除をご希望の場合は、お問い合わせフォームよりご連絡ください。内容を確認のうえ、合理的な範囲で対応します。",
    },
    {
      title: "8. プライバシーポリシーの変更",
      body: "本ポリシーは、法令の改正やサービス内容の変更に伴い、予告なく改定する場合があります。変更後のポリシーは、当ページに掲載した時点から効力を持ちます。",
    },
  ];

  return (
    <>
      <div className="inner-hero">
        <div className="container">
          <div className="breadcrumb">
            <button onClick={() => go("home")}>トップ</button>
            <span>/</span>
            <span>プライバシーポリシー</span>
          </div>
          <div className="inner-ey">Privacy Policy</div>
          <h1 className="inner-h">プライバシーポリシー</h1>
          <p className="inner-lead">
            わたたたるお合同会社（以下「当社」）は、お客様の個人情報の取り扱いについて、以下のとおり定めます。
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container" style={{ maxWidth: 720 }}>
          <div style={{ borderTop: "1px solid var(--border)" }}>
            {sections.map((s, i) => (
              <div key={i} style={{ padding: "36px 0", borderBottom: "1px solid var(--border)" }}>
                <div style={{ fontFamily: "var(--serif)", fontSize: 16, fontWeight: 400, color: "var(--text)", marginBottom: 12 }}>
                  {s.title}
                </div>
                <div style={{ fontSize: 14, color: "var(--text-mid)", lineHeight: 1.95, fontWeight: 300, whiteSpace: "pre-line" }}>
                  {s.body}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 40, fontSize: 13, color: "var(--text-muted)", lineHeight: 1.8 }}>
            制定日：2026年1月<br />
            わたたたるお合同会社
          </div>

          <div style={{ marginTop: 40, display: "flex", gap: 20, flexWrap: "wrap" }}>
            <button className="link-arr" onClick={() => go("contact")}>
              お問い合わせはこちら <ArrowRight size={14} />
            </button>
            <button className="link-arr" onClick={() => go("home")}>
              トップページへ <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

// ============================================================
// CONTACT PAGE
// ============================================================

// 送信間隔制限：60秒以内の連投を防ぐ
const SUBMIT_INTERVAL_MS = 60_000;

function Contact({ go }) {
  const [form, setForm]       = useState({ name: "", email: "", kind: "", body: "" });
  // ハニーポット欄（通常ユーザーには見えない。ボットが埋めたら弾く）
  const [honeypot, setHoneypot] = useState("");
  const [sent, setSent]       = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr]         = useState("");
  const lastSubmitRef         = useRef(0); // 最終送信タイムスタンプ

  const resetForm = () => {
    setForm({ name: "", email: "", kind: "", body: "" });
    setHoneypot("");
    setSent(false);
  };

  const handleSubmit = async () => {
    // ── ハニーポットチェック（値があればボットとみなして静かに弾く） ──
    if (honeypot) {
      // 成功したように見せてボットを欺く
      setSent(true);
      return;
    }

    // ── 送信間隔チェック ──
    const now = Date.now();
    if (now - lastSubmitRef.current < SUBMIT_INTERVAL_MS) {
      const remaining = Math.ceil((SUBMIT_INTERVAL_MS - (now - lastSubmitRef.current)) / 1000);
      setErr(`送信を受け付けました。次の送信は${remaining}秒後に可能です。`);
      return;
    }

    // ── 入力バリデーション ──
    if (!form.name.trim() || !form.email.trim() || !form.body.trim()) {
      setErr("お名前・メールアドレス・お問い合わせ内容は必須項目です。");
      return;
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(form.email)) {
      setErr("メールアドレスの形式が正しくありません。");
      return;
    }
    if (form.name.trim().length > 100) {
      setErr("お名前は100文字以内でご入力ください。");
      return;
    }
    if (form.body.trim().length > 2000) {
      setErr("お問い合わせ内容は2000文字以内でご入力ください。");
      return;
    }

    setErr("");
    setLoading(true);

    try {
      // GAS は POST を受け取ると 302 リダイレクトを返す。
      // redirect:'follow' でリダイレクト先まで追い、JSON レスポンスを読む。
      // application/x-www-form-urlencoded はシンプルリクエストなので CORS プリフライトなし。
      const res = await fetch(GAS_URL, {
        method: "POST",
        redirect: "follow",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          name:     form.name.trim(),
          email:    form.email.trim(),
          kind:     form.kind || "（未選択）",
          body:     form.body.trim(),
          hp:       honeypot, // GAS側でも検証
        }).toString(),
      });

      const data = await res.json();

      if (data.result === "success") {
        lastSubmitRef.current = Date.now(); // 送信成功時のみタイムスタンプを更新
        setSent(true);
      } else {
        throw new Error(data.message || "GAS側でエラーが発生しました");
      }
    } catch (e) {
      setErr("送信中にエラーが発生しました。しばらく経ってから再度お試しいただくか、お手数ですが X または note よりご連絡ください。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="inner-hero">
        <div className="container">
          <div className="breadcrumb">
            <button onClick={() => go("home")}>トップ</button>
            <span>/</span>
            <span>お問い合わせ</span>
          </div>
          <div className="inner-ey">Contact</div>
          <h1 className="inner-h">お問い合わせ</h1>
          <p className="inner-lead">
            ご依頼・ご相談・ご質問など、どんなことでもお気軽にどうぞ。「まだ依頼するか決めていない」という段階でも歓迎です。
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="ct-layout">
            <div className="ct-info">
              <h3>お問い合わせについて</h3>
              <p>
                フォームにご記入いただき、送信してください。通常2〜3営業日以内にご返信します。
              </p>
              <p className="ct-note">
                お問い合わせ内容によっては、ご対応が難しい場合もございます。その際は、理由とともにお断りさせていただくこともあります。
              </p>
              <p className="ct-note">
                ご提供いただいた個人情報は、お問い合わせへの対応のみに使用します。詳しくは
                <button
                  onClick={() => go("privacy")}
                  style={{ color: "var(--navy)", textDecoration: "underline", background: "none", border: "none", cursor: "pointer", fontSize: "inherit", padding: 0 }}
                >
                  プライバシーポリシー
                </button>
                をご確認ください。
              </p>
              <div style={{ marginTop: 32 }}>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 500 }}>
                  SNSからも
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <a href="https://x.com/watatata00" target="_blank" rel="noreferrer" className="sns-lnk">X</a>
                  <a href="https://note.com/watatata00" target="_blank" rel="noreferrer" className="sns-lnk">note</a>
                </div>
              </div>
            </div>

            <div>
              {sent ? (
                <div className="success">
                  <div style={{ fontSize: 36, marginBottom: 16 }}>✉️</div>
                  <h3>送信しました</h3>
                  <p>
                    お問い合わせありがとうございます。<br />
                    内容を確認のうえ、2〜3営業日以内にご連絡します。<br />
                    しばらくお待ちください。
                  </p>
                  <button
                    className="link-arr"
                    style={{ marginTop: 24, display: "inline-flex" }}
                    onClick={resetForm}
                  >
                    別のお問い合わせをする <ArrowRight size={14} />
                  </button>
                </div>
              ) : (
                <div>
                  {/* ── ハニーポット欄（通常ユーザーには見えない） ── */}
                  <div className="visually-hidden" aria-hidden="true">
                    <label htmlFor="hp-field">お電話番号（入力不要）</label>
                    <input
                      id="hp-field"
                      type="text"
                      name="hp"
                      value={honeypot}
                      tabIndex={-1}
                      autoComplete="off"
                      onChange={e => setHoneypot(e.target.value)}
                    />
                  </div>

                  <div className="fgrp">
                    <label className="flbl">お名前<span className="freq">必須</span></label>
                    <input
                      className="finp"
                      type="text"
                      placeholder="山田 太郎"
                      value={form.name}
                      disabled={loading}
                      autoComplete="name"
                      onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div className="fgrp">
                    <label className="flbl">メールアドレス<span className="freq">必須</span></label>
                    <input
                      className="finp"
                      type="email"
                      placeholder="your@email.com"
                      value={form.email}
                      disabled={loading}
                      autoComplete="email"
                      onChange={e => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                  <div className="fgrp">
                    <label className="flbl">お問い合わせ種別</label>
                    <select
                      className="finp fsel"
                      value={form.kind}
                      disabled={loading}
                      onChange={e => setForm({ ...form, kind: e.target.value })}
                    >
                      <option value="">選択してください</option>
                      <option value="サービス・料金について">サービス・料金について</option>
                      <option value="案件のご相談">案件のご相談</option>
                      <option value="取材・コラボレーション">取材・コラボレーション</option>
                      <option value="その他">その他</option>
                    </select>
                  </div>
                  <div className="fgrp">
                    <label className="flbl">お問い合わせ内容<span className="freq">必須</span></label>
                    <textarea
                      className="finp ftxt"
                      placeholder="どのようなことでも、まずお気軽にご記入ください。現状や課題を教えていただけると助かります。"
                      value={form.body}
                      disabled={loading}
                      maxLength={2000}
                      onChange={e => setForm({ ...form, body: e.target.value })}
                    />
                    <div style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "right", marginTop: 4 }}>
                      {form.body.length} / 2000
                    </div>
                  </div>
                  {err && (
                    <div className="ferr">{err}</div>
                  )}
                  <button className="fsub" onClick={handleSubmit} disabled={loading}>
                    {loading ? (
                      <><div className="spinner" />送信中...</>
                    ) : (
                      "送信する"
                    )}
                  </button>
                  <div className="fnote">
                    送信いただいた内容は、お問い合わせへの返答にのみ使用します。
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ============================================================
// APP
// ============================================================
export default function App() {
  const [page, setPage] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = CSS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  useEffect(() => {
    document.title =
      page === "home"     ? "わたたたるお合同会社 | わかりにくいを整理する" :
      page === "services" ? "事業内容 | わたたたるお合同会社" :
      page === "message"  ? "代表メッセージ | わたたたるお合同会社" :
      page === "works"    ? "発信・実績 | わたたたるお合同会社" :
      page === "about"    ? "会社概要 | わたたたるお合同会社" :
      page === "contact"  ? "お問い合わせ | わたたたるお合同会社" :
      page === "privacy"  ? "プライバシーポリシー | わたたたるお合同会社" :
      "わたたたるお合同会社";
  }, [page]);

  const go = (p) => {
    setPage(p);
    setMenuOpen(false);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="page-wrap">
      <Header cur={page} go={go} open={menuOpen} setOpen={setMenuOpen} />
      {menuOpen && <MobileMenu go={go} />}
      <main>
        {page === "home"     && <Home go={go} />}
        {page === "services" && <Services go={go} />}
        {page === "message"  && <Message go={go} />}
        {page === "works"    && <Works go={go} />}
        {page === "about"    && <About go={go} />}
        {page === "contact"  && <Contact go={go} />}
        {page === "privacy"  && <Privacy go={go} />}
      </main>
      <Footer go={go} />
    </div>
  );
}
