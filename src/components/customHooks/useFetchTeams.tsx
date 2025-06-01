import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useFetchTeams(league: string) {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                setLoading(true);
                let url = '';
                
                switch (league) {
                    case 'NBA':
                        url = 'http://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams';
                        break;
                    case 'NFL':
                        url = 'http://site.api.espn.com/apis/site/v2/sports/football/nfl/teams';
                        break;
                    case 'MLB':
                        url = 'http://site.api.espn.com/apis/site/v2/sports/baseball/mlb/teams';
                        break;
                    default:
                        throw new Error('Invalid league selected');
                }

                const response = await axios.get(url);
                const raw = response.data.sports[0].leagues[0].teams;
                const justTeams = raw.map((wrapper: { team: any }) => wrapper.team);
                setTeams(justTeams);
                setError(null);
            } catch (err: any) {
                setError(err.message || 'An error occurred while fetching teams');
                setTeams([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTeams();
    }, [league]);

    return { teams, loading, error };
}