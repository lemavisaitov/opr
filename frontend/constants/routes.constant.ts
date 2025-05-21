export const ROUTES = {
  home: "/home/upload",
  profile: "/profile",
} as const;

export const API_ROUTES = {
  upload: "http://localhost:5000/api/v1/predict",
} as const;
