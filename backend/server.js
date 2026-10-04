import express from "express";
import cors from "cors";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";

const app = express();
const port = Number(process.env.PORT || 5000);
const dataFile = process.env.DATA_FILE || path.join(path.dirname(fileURLToPath(import.meta.url)), "db.json");
const readDb = () => {
  try { return { users: [], orders: [], pickups: [], ...JSON.parse(fs.readFileSync(dataFile, "utf8")) }; }
  catch (error) { if (error.code !== "ENOENT") console.error("Could not read database:", error.message); return { users: [], orders: [], pickups: [] }; }
};
const writeDb = (db) => { fs.mkdirSync(path.dirname(dataFile), { recursive: true }); const temp = `${dataFile}.tmp`; fs.writeFileSync(temp, JSON.stringify(db, null, 2)); fs.renameSync(temp, dataFile); };
const catalog = [
  { id: "rose", name: "Rose", price: 2, type: "flower" }, { id: "marigold", name: "Marigold", price: 1.5, type: "flower" },
  { id: "lotus", name: "Lotus", price: 15, type: "flower" }, { id: "hibiscus", name: "Hibiscus", price: 2, type: "flower" }, { id: "white-chrysanthemum", name: "White Chrysanthemum", price: 3, type: "flower" },
  { id: "datura", name: "Datura", price: 20, type: "flower" }, { id: "parijata", name: "Parijata", price: 35, type: "flower" },
  { id: "palash", name: "Palash", price: 30, type: "flower" }, { id: "kadamba", name: "Kadamba", price: 45, type: "flower" },
  { id: "rose-garland", name: "Rose Garland", price: 80, type: "garland" }, { id: "marigold-garland", name: "Marigold Garland", price: 50, type: "garland" }, { id: "mixed-garland", name: "Mixed Garland", price: 60, type: "garland" },
  ...[10, 20, 30, 50].map((price) => ({ id: `pack-${price}`, name: `Daily Pack ₹${price}`, price, type: "pack" })),
];
const couponBook = { NEWUSER50: { percent: 50, newOnly: true }, RECYCLE20: { percent: 20 }, PHOOL10: { percent: 10 }, TRAY5: { percent: 5, minDistinctItems: 3, oneTimeOnly: true } };
const safeUser = ({ id, name, email, phoolcoins = 0, discountCredit = 0 }) => ({ id, name, email, phoolcoins, discountCredit });
const hashPassword = (password, salt = randomBytes(16).toString("hex")) => `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
const matchesPassword = (password, stored) => { const [salt, hash] = (stored || "").split(":"); if (!salt || !hash) return false; const actual = scryptSync(password, salt, 64); const expected = Buffer.from(hash, "hex"); return expected.length === actual.length && timingSafeEqual(actual, expected); };
const requireAuth = (req, res, next) => { const token = req.get("authorization")?.replace(/^Bearer\s+/i, ""); const db = readDb(); const user = db.users.find((candidate) => candidate.token === token); if (!user) return res.status(401).json({ error: "Please sign in to continue." }); req.user = user; next(); };
app.use(cors({ origin: process.env.FRONTEND_ORIGIN ? process.env.FRONTEND_ORIGIN.split(",") : true }));
app.use(express.json({ limit: "100kb" }));
app.get("/api/health", (_req, res) => res.json({ ok: true, service: "BloomFlash API" }));
app.get("/api/products", (req, res) => { const q = String(req.query.q || "").toLowerCase(); res.json(catalog.filter((p) => p.name.toLowerCase().includes(q))); });
app.get("/api/pincode/:pin", (req, res) => { const valid = /^\d{6}$/.test(req.params.pin); if (!valid) return res.status(400).json({ error: "Enter a valid 6-digit PIN code." }); res.json({ pincode: req.params.pin, deliverable: /^(11|12|20|22|40|56|60)\d{4}$/.test(req.params.pin), eta: "Availability and delivery estimate confirmed at checkout" }); });
app.post("/api/auth/signup", (req, res) => { const name = String(req.body.name || "").trim(); const email = String(req.body.email || "").trim().toLowerCase(); const password = String(req.body.password || ""); if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || password.length < 8) return res.status(400).json({ error: "Enter your name, a valid email, and a password of at least 8 characters." }); const db = readDb(); if (db.users.some((u) => u.email === email)) return res.status(409).json({ error: "An account with this email already exists." }); const user = { id: randomUUID(), name, email, passwordHash: hashPassword(password), token: randomBytes(32).toString("hex"), phoolcoins: 0, discountCredit: 0 }; db.users.push(user); writeDb(db); res.status(201).json({ token: user.token, user: safeUser(user) }); });
app.post("/api/auth/signin", (req, res) => { const email = String(req.body.email || "").trim().toLowerCase(); const db = readDb(); const user = db.users.find((u) => u.email === email); if (!user || !matchesPassword(String(req.body.password || ""), user.passwordHash)) return res.status(401).json({ error: "Email or password is incorrect." }); user.token = randomBytes(32).toString("hex"); writeDb(db); res.json({ token: user.token, user: safeUser(user) }); });
app.get("/api/auth/me", requireAuth, (req, res) => res.json(safeUser(req.user)));
app.post("/api/auth/signout", requireAuth, (req, res) => { const db = readDb(); const user = db.users.find((u) => u.id === req.user.id); user.token = null; writeDb(db); res.json({ ok: true }); });
app.post("/api/coupons/apply", requireAuth, (req, res) => {
  const code = String(req.body.code || "").toUpperCase();
  const coupon = couponBook[code];
  if (!coupon) return res.status(404).json({ error: "That code is not available." });
  if (coupon.newOnly && readDb().orders.some((o) => o.userId === req.user.id)) return res.status(400).json({ error: "This offer is for your first order." });
  if (coupon.oneTimeOnly && req.body.mode !== "one-time") return res.status(400).json({ error: "This offer applies to one-time flower orders only." });
  if (coupon.minDistinctItems) {
    const eligible = new Set((Array.isArray(req.body.items) ? req.body.items : []).filter((item) => catalog.some((product) => product.id === item.id && product.type !== "pack")).map((item) => item.id));
    if (eligible.size < coupon.minDistinctItems) return res.status(400).json({ error: `Add ${coupon.minDistinctItems} different flower items to use this offer.` });
  }
  res.json({ code, percent: coupon.percent });
});
app.post("/api/orders", requireAuth, (req, res) => {
  const { items = [], address, payment, mode = "one-time", coupon } = req.body;
  if (!Array.isArray(items) || items.length === 0 || !address || !payment) return res.status(400).json({ error: "A cart, delivery address, and payment method are required." });
  if (!["one-time", "subscription"].includes(mode)) return res.status(400).json({ error: "Choose a valid order type." });
  const normalized = items.map((item) => {
    const isSubscriptionPlan = mode === "subscription" && /^subscription-pack-(10|20|30|50)$/.test(String(item.id));
    const productId = isSubscriptionPlan ? String(item.id).replace(/^subscription-/, "") : item.id;
    const product = catalog.find((p) => p.id === productId);
    const quantity = Number(item.quantity);
    if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 50) return null;
    if (mode === "subscription" && (!isSubscriptionPlan || product.type !== "pack" || quantity !== 1)) return null;
    if (mode === "one-time" && String(item.id).startsWith("subscription-")) return null;
    return { id: product.id, name: isSubscriptionPlan ? `${product.name} monthly subscription` : product.name, price: product.price * (isSubscriptionPlan ? 27 : 1), quantity, unit: isSubscriptionPlan ? "month" : undefined };
  });
  if (normalized.some((item) => !item)) return res.status(400).json({ error: "Your cart contains an invalid item." });
  const db = readDb(); const user = db.users.find((u) => u.id === req.user.id);
  const subtotal = normalized.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const couponCode = String(coupon || "").toUpperCase(); const offer = couponCode ? couponBook[couponCode] : null;
  if (couponCode && !offer) return res.status(400).json({ error: "That code is not available." });
  if (offer?.newOnly && db.orders.some((o) => o.userId === user.id)) return res.status(400).json({ error: "This offer is for your first order." });
  if (offer?.oneTimeOnly && mode !== "one-time") return res.status(400).json({ error: "This offer applies to one-time flower orders only." });
  if (offer?.minDistinctItems) {
    const eligible = new Set(normalized.filter((item) => catalog.some((product) => product.id === item.id && product.type !== "pack")).map((item) => item.id));
    if (eligible.size < offer.minDistinctItems) return res.status(400).json({ error: `Add ${offer.minDistinctItems} different flower items to use this offer.` });
  }
  const afterCoupon = Math.max(0, Math.round(subtotal * (1 - (offer?.percent || 0) / 100) * 100) / 100);
  const creditUsed = Math.min(user.discountCredit, afterCoupon); user.discountCredit -= creditUsed;
  const total = Math.round((afterCoupon - creditUsed) * 100) / 100; const coinsEarned = Math.floor(total / 10); user.phoolcoins += coinsEarned;
  const order = { id: `BF-${randomUUID().slice(0, 8).toUpperCase()}`, userId: user.id, items: normalized, address, payment, mode, subtotal, creditUsed, total, coinsEarned, status: "placed", createdAt: new Date().toISOString(), eta: null };
  db.orders.unshift(order); writeDb(db); res.status(201).json(order);
});
app.get("/api/orders", requireAuth, (req, res) => res.json(readDb().orders.filter((o) => o.userId === req.user.id)));
app.get("/api/wallet", requireAuth, (req, res) => { const u = readDb().users.find((item) => item.id === req.user.id); res.json({ phoolcoins: u.phoolcoins, discountCredit: u.discountCredit }); });
app.get("/api/pickups", requireAuth, (req, res) => { const db = readDb(); res.json(db.pickups.filter((pickup) => db.orders.some((order) => order.id === pickup.orderId && order.userId === req.user.id))); });
app.post("/api/pickups", requireAuth, (req, res) => { const db = readDb(); const order = db.orders.find((o) => o.id === req.body.orderId && o.userId === req.user.id); if (!order) return res.status(404).json({ error: "Order not found." }); if (db.pickups.some((p) => p.orderId === order.id)) return res.status(409).json({ error: "A flower return is already scheduled for this order." }); const user = db.users.find((u) => u.id === req.user.id); const reward = Math.round(order.total * 0.1); user.discountCredit += reward; const pickup = { id: `PK-${randomUUID().slice(0, 8).toUpperCase()}`, orderId: order.id, status: "scheduled", reward, createdAt: new Date().toISOString() }; db.pickups.push(pickup); writeDb(db); res.status(201).json(pickup); });
app.post("/api/concierge/plan", (req, res) => {
  const { occasion = "daily puja", budget = 150, frequency = "daily", flowers = "mixed" } = req.body;
  const amount = Math.max(30, Math.min(500, Number(budget) || 150));
  const normalizedOccasion = String(occasion).trim().slice(0, 60) || "Daily puja";
  const occasionKey = normalizedOccasion.toLowerCase();
  const festive = /festival|celebrat|wedding|birthday|anniversary|aarti|special|temple/.test(occasionKey);
  const preference = String(flowers).toLowerCase();
  const varietyOrder = preference === "mixed" ? ["marigold", "rose", "hibiscus", "white-chrysanthemum", "lotus"] : [preference, "marigold", "rose", "hibiscus", "white-chrysanthemum", "lotus"].filter((id, index, all) => all.indexOf(id) === index);
  const candidates = varietyOrder.map((id) => catalog.find((p) => p.id === id)).filter(Boolean);
  const garlandThreshold = festive ? 60 : 150;
  if (amount >= garlandThreshold) candidates.push(catalog.find((p) => p.id === (festive ? "mixed-garland" : "marigold-garland")));
  const usable = candidates.filter((p, index, all) => p && p.price <= amount && all.findIndex((candidate) => candidate?.id === p.id) === index);
  const budgetTarget = Math.floor(amount * (festive ? 0.9 : 0.86) * 100) / 100;
  const allocation = new Map(); let total = 0;
  const initial = usable.slice(0, Math.min(3, usable.length));
  for (const product of initial) { allocation.set(product.id, 1); total += product.price; }
  const ranked = [...usable].sort((a, b) => { const wa = a.type === "garland" ? (festive ? 0 : 1) : (a.id === preference ? -1 : 0); const wb = b.type === "garland" ? (festive ? 0 : 1) : (b.id === preference ? -1 : 0); return wa - wb || a.price - b.price; });
  let changed = true;
  while (changed) { changed = false; for (const product of ranked) { const qty = allocation.get(product.id) || 0; const limit = product.type === "garland" ? Math.min(5, Math.max(1, Math.floor(amount / product.price))) : Math.min(40, Math.max(1, Math.floor(budgetTarget / product.price))); if (qty < limit && total + product.price <= budgetTarget) { allocation.set(product.id, qty + 1); total = Math.round((total + product.price) * 100) / 100; changed = true; } } }
  const selection = usable.filter((product) => allocation.has(product.id)).map((product) => ({ id: product.id, name: product.name, price: product.price, quantity: allocation.get(product.id) }));
  total = Math.round(selection.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100) / 100;
  const titleOccasion = normalizedOccasion.replace(/\b\w/g, (c) => c.toUpperCase());
  res.json({ title: titleOccasion + " · " + (frequency === "weekly" ? "Weekly" : "Daily") + " edit", note: selection.length + " considered selections, scaled to your ₹" + amount + " per-delivery budget.", items: selection, estimatedTotal: total, frequency, returnReminder: "Return your used flowers when convenient to receive wallet credit equal to 10% of this order." });
});
app.use((err, _req, res, _next) => { console.error(err); res.status(500).json({ error: "Something went wrong. Please try again." }); });
app.listen(port, () => console.log(`BloomFlash API ready on port ${port}`));
