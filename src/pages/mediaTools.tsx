import * as React from "react";
import { Container } from "../common/components/container";
import { useDataContext } from "../DataContext";
import { useQuery } from "@tanstack/react-query";
import { Loading } from "../common/components/loading";
import { Match } from "../models/upComingMatch";
import { Team } from "../models/upComingMatch";
import { useLocation } from "wouter";
const FranchisesFranchise = React.lazy(() =>import('./franchises/franchise').then(module => ({default: module.FranchisesFranchise})));

const tierCssColors = {
	Recruit: "text-red-400",
	Prospect: "text-orange-400",
	Contender: "text-yellow-400",
	Challenger: "text-green-400",
	Elite: "text-blue-400",
	Premier: "text-purple-400",
}

type Props = {
    match: Match;
    team?: Team;
};

const GET_MATCHES_QUERY = `
query Matches($season: Int!, $tier: String) {
  matches(season: $season, tier: $tier, afterToday: true) {
    id
    scheduledDate
    matchDay {
      number
    }
    home {
      name
      franchise {
        name
        prefix
      }
    }
    away {
      name
      franchise {
        name
        prefix
      }
    }
    completedAt
  }
}`


export function CurrentMatchCards({match, team}: Props) {
    const [, setLocation] = useLocation();
    const handleClick = () => {
        setLocation(`/media-tools/${match.id}`);
    };

    const matchDate = {
        month: new Date(match.scheduledDate).getMonth() + 1,
        day: new Date(match.scheduledDate).getDate(),
        hour: new Date(match.scheduledDate).getHours() % 12,
    };
    const isHomeTeam = match.home.name === team?.name;

    return (
        <div key={match.id} onClick={handleClick} className="cursor-pointer">
            <p>{match.matchDay.number} : {match.home.name} vs {match.away.name}</p>
        </div>
    )
}

export function MediaTools() {
    const { franchises = [], tiers, currentSeason, loading } = useDataContext();
    const [selectedTier, setSelectedTier] = React.useState<string | null>(null);
    const [fetchMatches, setFetchMatches] = React.useState<boolean>(false);
    const handleFetchMatches = () => {
        setFetchMatches(true);
    };

    const getMatches = async (season: number, tier : string) => {
        const response = await fetch("https://core.csconfederation.com/graphql", {
            method: "POST", 
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: GET_MATCHES_QUERY,
                variables: { season, tier },
            }),
        });   
        const result = await response.json();
        return result.data.matches;
    }

    const {data = [], isLoading, refetch } = useQuery({
        queryKey: ["matches", currentSeason, selectedTier],
        queryFn: () => getMatches(currentSeason, selectedTier ?? ""),
    })

    const teamCounts = {
        Recruit: franchises.reduce(
            (acc, franchise) => acc + (franchise.teams?.find(t => t.tier.name === "Recruit") ? 1 : 0),
            0,
        ),
        Prospect: franchises.reduce(
            (acc, franchise) => acc + (franchise.teams?.find(t => t.tier.name === "Prospect") ? 1 : 0),
            0,
        ),
        Contender: franchises.reduce(
            (acc, franchise) => acc + (franchise.teams?.find(t => t.tier.name === "Contender") ? 1 : 0),
            0,
        ),
        Challenger: franchises.reduce(
            (acc, franchise) => acc + (franchise.teams?.find(t => t.tier.name === "Challenger") ? 1 : 0),
            0,
        ),
        Elite: franchises.reduce(
            (acc, franchise) => acc + (franchise.teams?.find(t => t.tier.name === "Elite") ? 1 : 0),
            0,
        ),
        Premier: franchises.reduce(
            (acc, franchise) => acc + (franchise.teams?.find(t => t.tier.name === "Premier") ? 1 : 0),
            0,
        ),
    };

    const currentDate = new Date();

    // Find the closest match date
    const closestMatchDate = data.reduce((closest: Date, match: Match) => {
        const matchDate = new Date(match.scheduledDate);
        return Math.abs(matchDate.getTime() - currentDate.getTime()) < Math.abs(closest.getTime() - currentDate.getTime())
            ? matchDate
            : closest;
    }, new Date(data[0]?.scheduledDate || currentDate));

    // Filter matches to only include those on the closest match date
    const closestMatches = data.filter((match: Match) => {
        const matchDate = new Date(match.scheduledDate);
        return matchDate.toDateString() === closestMatchDate.toDateString();
    });

    


    return (
        <Container>
            <div className="mx-auto max-w-lg text-center">
				<h2 className="text-3xl font-bold sm:text-4xl">Media Tools</h2>
				<p className="mt-4 text-gray-300">Match Selector</p>
			</div>

            <div className="flex flex-row flex-wrap gap-4 m-auto text-xs my-3 text-center">
                <div className="grow rounded-lg py-2">
                    <div className={`font-bold`}>Franchises</div>
                    <div>{franchises.length}</div>
                </div>

                {Object.keys(teamCounts)
                    .reverse()
                    .map(key => (
                        <div className={`grow cursor-pointer rounded-lg py-2 ${key === selectedTier ? "bg-gray-700" : ""}`} onClick={() => setSelectedTier(key === selectedTier ? null : key)}>
                            <div className={`font-bold capitalize text-${tiers?.find(item => item.tier.name === key)?.tier.color ?? ""}-400`}>
                                            {key}
                            </div>

                            <div>{(teamCounts[key as keyof typeof teamCounts] ?? 0) / 2} Matches</div>

                        </div>
                        ))}
            </div>

            
            
            

            <div className="flex flex-col gap-2">
                <button onClick={() => refetch()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Fetch Matches
                </button>
            </div>
            
            

            <div>{isLoading ? <Loading /> : closestMatches.map((match: Match) => (
                <div key={match.id} className="mb-4"> {/* Add margin-bottom to create space between matches */}
                    <CurrentMatchCards match={match} />
                </div>
            ))}</div>

        

                        
        </Container>
    );
}