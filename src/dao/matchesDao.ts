import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { appConfig } from "../dataConfig";
import { CscLatestSeason } from "../models/csc-season-tiers-types";

const fetchMatches = async (season: number, tier: string) => {
    const response = await fetch(appConfig.endpoints.cscGraphQL.core, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: `
                query Matches($season: Int!, $tier: String) {
                    matches(season: $season, tier: $tier) {
                        id
                        scheduledDate
                        completedAt
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
                        stats {
                            homeScore
                            awayScore
                            mapName
                        }
                        lobby {
                            mapBans {
                                map
                                team {
                                    name
                                }
                                number
                            }
                        }
                        demoUrl
                    }
                }
            `,
            variables: { season, tier },
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch matches");
    }

    const data = await response.json();
    return data.data.matches;
};

export const useMatches = (season: number, tier: string): UseQueryResult<any, Error> => {
    return useQuery(["matches", season, tier], () => fetchMatches(season, tier));
};
