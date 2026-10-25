import { useEffect, useState } from "react";
import { subscribeSiteSettings } from "../services/firestore";

export function useSiteSettings() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => subscribeSiteSettings((value) => {
    setSettings(value || {});
    setLoading(false);
    setError("");
  }, (reason) => {
    setError(reason && reason.message ? reason.message : "Could not load site imagery.");
    setLoading(false);
  }), []);

  return { settings, loading, error };
}
