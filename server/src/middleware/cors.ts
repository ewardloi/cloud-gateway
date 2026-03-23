import corsMiddleware from "cors";

const CORS_MODE = process.env.CORS_MODE ?? "allow-all";

export const cors = () => {
  if (CORS_MODE === "allow-all") {
    return corsMiddleware({ origin: "*" });
  }

  return corsMiddleware({
    origin: (origin, callback) => {
      if (!origin || ([] as string[]).includes(origin)) callback(null, true);
      else callback(new Error("CORS blocked"));
    },
  });
};
