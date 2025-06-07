import { useState, useEffect } from "react";
import axios from "axios";

type TeamDetail = any; // Replace with a better type if needed

export default function useFetchTeamDetails(
  sport: string,
  league: string,
  abbreviations: string[]
) {
  const [data, setData] = useState<TeamDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!abbreviations.length) {
      setData([]);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const responses = await Promise.all(
          abbreviations.map((abbr) =>
            axios.get(
              `https://site.api.espn.com/apis/site/v2/sports/${sport}/${league}/teams/${abbr.toLowerCase()}`
            )
          )
        );
        console.log("Fetched team details:", responses);
        setData(responses.map((res) => res.data));
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to fetch team data.");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sport, league, JSON.stringify(abbreviations.slice().sort())]);

  return { data, loading, error };
}
