import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

const VOTER_ID_KEY = "sanur_voter_id";

function getVoterId() {
  let id = localStorage.getItem(VOTER_ID_KEY);
  if (!id) {
    id = (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`);
    localStorage.setItem(VOTER_ID_KEY, id);
  }
  return id;
}

// counts: { [listingId]: totalVoteCount }
// voted:  { [listingId]: true } — listings the current visitor has voted for
export function useVotes() {
  const [counts, setCounts] = useState({});
  const [voted, setVoted] = useState({});
  const [loading, setLoading] = useState(true);
  const voterId = getVoterId();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const { data, error } = await supabase.from("votes").select("listing_id, voter_id");
      if (cancelled) return;
      if (error) {
        console.error("Failed to load votes:", error);
        setLoading(false);
        return;
      }
      const c = {};
      const v = {};
      (data || []).forEach(row => {
        c[row.listing_id] = (c[row.listing_id] || 0) + 1;
        if (row.voter_id === voterId) v[row.listing_id] = true;
      });
      setCounts(c);
      setVoted(v);
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [voterId]);

  const vote = useCallback(async (listingId) => {
    if (voted[listingId]) return;

    // Optimistic update — feels instant, corrected below if it fails
    setVoted(v => ({ ...v, [listingId]: true }));
    setCounts(c => ({ ...c, [listingId]: (c[listingId] || 0) + 1 }));

    const { error } = await supabase.from("votes").insert({ listing_id: listingId, voter_id: voterId });

    if (error) {
      if (error.code === "23505") {
        // Already recorded (e.g. duplicate tap or another tab) — safe to leave optimistic state as-is
        return;
      }
      // Real failure — roll back the optimistic update
      console.error("Vote failed:", error);
      setVoted(v => { const n = { ...v }; delete n[listingId]; return n; });
      setCounts(c => ({ ...c, [listingId]: Math.max((c[listingId] || 1) - 1, 0) }));
    }
  }, [voted, voterId]);

  return { counts, voted, vote, loading };
}
