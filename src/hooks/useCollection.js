import { useEffect, useState } from "react";

export function useCollection(subscribe) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    const unsubscribe = subscribe((nextItems) => {
      setItems(nextItems);
      setLoading(false);
    }, (reason) => {
      setError(reason && reason.message ? reason.message : "Could not load this information.");
      setLoading(false);
    });
    return () => unsubscribe && unsubscribe();
  }, [subscribe]);

  return { items, loading, error };
}
