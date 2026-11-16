// 服务端存储层:JSON 文件持久化 + 内存会话
// 对齐原站实证行为:购物车按 fileId 去重、Session 化
import fs from "fs";
import path from "path";
import crypto from "crypto";

const DATA_DIR = path.join(process.cwd(), ".server-data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const CARTS_FILE = path.join(DATA_DIR, "carts.json");
const SHARES_FILE = path.join(DATA_DIR, "shares.json");

function ensure() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}
function readJson<T>(file: string, fallback: T): T {
  ensure();
  try { return JSON.parse(fs.readFileSync(file, "utf8")) as T; } catch { return fallback; }
}
function writeJson(file: string, data: unknown) {
  ensure();
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

/* ---------------- 会话(内存 + cookie sid) ---------------- */
const sessions = new Map<string, { username: string; expires: number }>();
const SESSION_TTL = 24 * 60 * 60 * 1000;

export function createSession(username: string): string {
  const sid = crypto.randomBytes(24).toString("hex");
  sessions.set(sid, { username, expires: Date.now() + SESSION_TTL });
  return sid;
}
export function getSessionUser(sid?: string | null): string | null {
  if (!sid || !sessions.has(sid)) return null;
  const s = sessions.get(sid)!;
  if (Date.now() > s.expires) { sessions.delete(sid); return null; }
  return s.username;
}

/* ---------------- 用户(注册/登录,scrypt 哈希) ----------------
 * 改进原站缺陷:原站密码走 GET query(见逆向报告 §12.5),本实现一律 POST + scrypt
 */
interface UserRecord { username: string; email: string; salt: string; hash: string; firstname: string; lastname: string; phone: string; createdAt: string }

export function registerUser(input: { username: string; email: string; password: string; firstname: string; lastname: string; phone: string }):
  { state: "SUCCESS" } | { state: "EXIST" } | { state: "INVALID" } {
  if (!input.username || !input.email || !input.password || input.password.length < 6) return { state: "INVALID" };
  const users = readJson<UserRecord[]>(USERS_FILE, []);
  if (users.some(u => u.username === input.username || u.email === input.email)) return { state: "EXIST" };
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(input.password, salt, 32).toString("hex");
  users.push({ ...input, salt, hash, createdAt: new Date().toISOString() });
  writeJson(USERS_FILE, users);
  return { state: "SUCCESS" };
}

export function loginUser(username: string, password: string): boolean {
  const users = readJson<UserRecord[]>(USERS_FILE, []);
  const u = users.find(x => x.username === username);
  if (!u) return false;
  const hash = crypto.scryptSync(password, u.salt, 32).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(u.hash));
}

/* ---------------- 购物车(Session 级,按 fileId 去重——原站实测行为) ---------------- */
type Cart = { items: { fileId: string; code: string; addedAt: string }[] };

export function addToCart(sid: string | null, fileId: string, code: string): number {
  if (!sid) return 0;
  const carts = readJson<Record<string, Cart>>(CARTS_FILE, {});
  const cart = carts[sid] ?? { items: [] };
  if (!cart.items.some(i => i.fileId === fileId)) {
    cart.items.push({ fileId, code, addedAt: new Date().toISOString() });
  }
  carts[sid] = cart;
  writeJson(CARTS_FILE, carts);
  return cart.items.length;
}

export function getCart(sid: string | null): Cart {
  if (!sid) return { items: [] };
  return readJson<Record<string, Cart>>(CARTS_FILE, {})[sid] ?? { items: [] };
}

export function removeFromCart(sid: string | null, fileId: string): number {
  if (!sid) return 0;
  const carts = readJson<Record<string, Cart>>(CARTS_FILE, {});
  const cart = carts[sid];
  if (!cart) return 0;
  cart.items = cart.items.filter(i => i.fileId !== fileId);
  carts[sid] = cart;
  writeJson(CARTS_FILE, carts);
  return cart.items.length;
}

/* ---------------- 分享(记录到文件,演示不真发邮件) ---------------- */
export function recordShare(input: { name: string; email: string; itemCode?: string }) {
  const shares = readJson<unknown[]>(SHARES_FILE, []);
  shares.push({ ...input, at: new Date().toISOString() });
  writeJson(SHARES_FILE, shares);
}
