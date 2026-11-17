// 퀘스트 섬 비밀번호 잠금 빌드
// 원본(암호화 전) index.html 은 저장소에 올리지 않고 비공개 폴더에만 둔다.
// 사용법: QUEST_PW='비밀번호' node tools/lock.mjs <원본폴더>
//   <원본폴더>/index.html, life/index.html, nonlife/index.html 을 암호화해
//   저장소의 같은 경로에 잠금 페이지로 써 넣는다.
// 방식: gzip → AES-256-GCM, 키 = PBKDF2-SHA256(비밀번호, tools/lock-salt.txt, 반복 ITER)
// 같은 비밀번호·소금이면 키가 같아서 한 번 입력하면 세 섬 모두 열린다.
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const ITER = 250000;
const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, "..");
const srcDir = process.argv[2];
const pw = process.env.QUEST_PW;
if (!srcDir || !pw) { console.error("사용법: QUEST_PW='비밀번호' node tools/lock.mjs <원본폴더>"); process.exit(1); }

const saltB64 = fs.readFileSync(path.join(here, "lock-salt.txt"), "utf8").trim();
const key = crypto.pbkdf2Sync(pw.normalize("NFC"), Buffer.from(saltB64, "base64"), ITER, 32, "sha256");
const tpl = fs.readFileSync(path.join(here, "lock-template.html"), "utf8");

for (const rel of ["index.html", "life/index.html", "nonlife/index.html"]) {
  const html = fs.readFileSync(path.join(srcDir, rel), "utf8");
  // 카톡 미리보기·아이콘용 head 메타는 잠금 페이지에도 그대로 둔다 (segment.js 앞까지)
  const m = html.match(/^([\s\S]*?<head>)([\s\S]*?)\n?<script src="[^"]*shared\/segment\.js"/);
  if (!m) throw new Error(rel + ": head 메타를 찾지 못함");
  const htmlTag = m[1].replace(/^<!DOCTYPE html>\s*/i, "");
  const meta = m[2].replace(/\n{2,}/g, "\n").trim();
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv("aes-256-gcm", key, iv);
  const enc = Buffer.concat([c.update(zlib.gzipSync(Buffer.from(html, "utf8"), { level: 9 })), c.final(), c.getAuthTag()]);
  const out = tpl
    .replace("<!--HTMLTAG-->", htmlTag)
    .replace("<!--META-->", meta)
    .replace("__SALT__", saltB64).replace("__ITER__", String(ITER))
    .replace("__IV__", iv.toString("base64"))
    .replace("__DATA__", () => enc.toString("base64"));
  fs.writeFileSync(path.join(repo, rel), out);
  console.log(rel, (html.length / 1024).toFixed(0) + "KB →", (out.length / 1024).toFixed(0) + "KB");
}
