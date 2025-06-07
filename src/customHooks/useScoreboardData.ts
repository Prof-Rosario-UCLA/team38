import { useEffect, useState } from "react";
import axios from "axios";

const useScoreboardData = (
  sport: "basketball" | "football" | "baseball",
  league: "nba" | "nfl" | "mlb"
) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScoreboard = async () => {
      try {
        const res = await axios.get(
          `https://site.api.espn.com/apis/site/v2/sports/${sport}/${league}/scoreboard`
        );
        setData(res.data.events || []);
      } catch (err) {
        console.error("Error fetching scoreboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchScoreboard();
    const interval = setInterval(fetchScoreboard, 60000); // refresh every 60s

    return () => clearInterval(interval);
  }, [sport, league]);

  return { data, loading };
};

export default useScoreboardData;
