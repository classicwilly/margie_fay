import express from "express";

export function requireAuth(req, res, next) {
  const session = req.cookies && req.cookies.gwsess;
  if (!session) return res.status(401).json({ error: "Not authenticated" });
  // In prod, verify session token and user
  next();
}

export function auditLoggerFactory(app) {
  return (action, meta = {}) => {
    try {
      const logger = app.get("logger") || console.log;
      const entry = { ts: new Date().toISOString(), action, meta };
      // Write to structured logs and to an audit storage later
      logger("AUDIT", JSON.stringify(entry));
      // optimistic: push to a queue or append to an audit db (left unimplemented)
      const auditStore = app.get("auditStore");
      if (auditStore && auditStore.push) auditStore.push(entry);
    } catch (e) {
      console.warn("Failed writing audit entry", e);
    }
  };
}

export function roleCheck(allowed = []) {
  return (req, res, next) => {
    // placeholder role check; later this will check the user's role
    const userRoles = (req.user && req.user.roles) || [];
    if (allowed.length === 0) return next();
    const matches = allowed.some((r) => userRoles.includes(r));
    if (!matches) return res.status(403).json({ error: "Forbidden" });
    next();
  };
}
