import { Request, Response, NextFunction } from "express";

export const httpsRedirect =
  (httpsPort: number) => (req: Request, res: Response, next: NextFunction) => {
    if (req.secure || req.headers["x-forwarded-proto"] === "https")
      return next();
    res.redirect(301, `https://${req.hostname}:${httpsPort}${req.url}`);
  };
