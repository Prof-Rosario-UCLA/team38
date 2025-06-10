import { useState, useEffect } from 'react';
import axios from 'axios';

interface RawFavorites {
    NFLFavorites?: string[];
    NBAFavorites?: string[];
    MLBFavorites?: string[];
  }

  const isLocal = false;
  
export default function useFetchFavTeams(userID: string | undefined) {
    const [teamsBySport, setTeamsBySport] = useState<RawFavorites>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userID) return;
        const fetchTeams = async () => {
            try {
                setLoading(true);
                let url = isLocal ? `http://localhost:8080/favorite-teams/${userID}` : `https://cs144-25s-dhruvpareek12.uw.r.appspot.com/favorite-teams/${userID}`;
                const response = await axios.get(url);
      
                const dataObj = response.data as RawFavorites;

                setTeamsBySport(dataObj);
                setError(null);
            } catch (err: any) {
                if(err.response.status !== 404){
                    setError(err.message || 'An error occurred while fetching teams');
                }
                setTeamsBySport({});
            } finally {
                setLoading(false);
            }
        };

        fetchTeams();
    }, [userID]);

    return { teamsBySport, loading, error };
}