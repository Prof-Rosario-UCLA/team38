import { useState, useEffect } from 'react';
import axios from 'axios';

interface RawFavorites {
    NFLFavorites?: string[];
    NBAFavorites?: string[];
    MLBFavorites?: string[];
  }
  
  
export default function useFetchFavTeams(userID: string | undefined) {
    const [teamsBySport, setTeamsBySport] = useState<RawFavorites>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userID) return;
        console.log(`userID in fetchFavTeams: ${userID}`);
        const fetchTeams = async () => {
            try {
                setLoading(true);
                let url = `http://localhost:3000/favorite-teams/${userID}`;
                const response = await axios.get(url);
      
                const dataObj = response.data as RawFavorites;

                console.log("raw dataObj", dataObj);
                setTeamsBySport(dataObj);
                setError(null);
            } catch (err: any) {
                setError(err.message || 'An error occurred while fetching teams');
                setTeamsBySport({});
            } finally {
                setLoading(false);
            }
        };

        fetchTeams();
    }, [userID]);

    return { teamsBySport, loading, error };
}