import * as React from "react";
import { Container } from "../common/components/container";
import * as Containers from "../common/components/containers";
import { useDataContext } from "../DataContext";
import { shortTeamNameTranslator } from "../common/utils/player-utils";
import { Loading } from "../common/components/loading";
import Select, { MultiValue } from "react-select";
import { selectClassNames } from "../common/utils/select-utils";
import { Player } from "../models/player";
import {TeamPercentiles} from "./team/teamPercentiles";
import {Exandable} from "../common/components/containers/Expandable";
import {SetStateAction} from "react";
import { Link, useRoute } from "wouter";
import { PlayerRow } from "./franchise/player-row";
import { franchiseImages } from "../common/images/franchise";
import { FranchiseManagementNamePlate } from "./franchises/franchiseManagementNamePlate";
import { FaExternalLinkAlt } from "react-icons/fa";


const FranchisesFranchise = React.lazy(() =>import('./franchises/franchise').then(module => ({default: module.FranchisesFranchise})));

const tierCssColors = {
	Recruit: "text-red-400",
	Prospect: "text-orange-400",
	Contender: "text-yellow-400",
	Challenger: "text-green-400",
	Elite: "text-blue-400",
	Premier: "text-purple-400",
}


export function MediaTools() {
    const { franchises = [], tiers, loading } = useDataContext();
    const [selectedTier, setSelectedTier] = React.useState<string | null>(null);

    const teamCounts = {
        recruit: franchises.reduce(
            (acc, franchise) => acc + (franchise.teams?.find(t => t.tier.name === "Recruit") ? 1 : 0),
            0,
        ),
        prospect: franchises.reduce(
            (acc, franchise) => acc + (franchise.teams?.find(t => t.tier.name === "Prospect") ? 1 : 0),
            0,
        ),
        contender: franchises.reduce(
            (acc, franchise) => acc + (franchise.teams?.find(t => t.tier.name === "Contender") ? 1 : 0),
            0,
        ),
        challenger: franchises.reduce(
            (acc, franchise) => acc + (franchise.teams?.find(t => t.tier.name === "Challenger") ? 1 : 0),
            0,
        ),
        elite: franchises.reduce(
            (acc, franchise) => acc + (franchise.teams?.find(t => t.tier.name === "Elite") ? 1 : 0),
            0,
        ),
        premier: franchises.reduce(
            (acc, franchise) => acc + (franchise.teams?.find(t => t.tier.name === "Premier") ? 1 : 0),
            0,
        ),
    };


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
                                        <div
                                            className={`font-bold capitalize text-${tiers?.find(item => item.tier.name.toLowerCase() === key)?.tier.color ?? ""}-400`}
                                        >
                                            {key}
                                        </div>
                                        <div>{(teamCounts[key as keyof typeof teamCounts] ?? 0) / 2} Matches</div>
                                    </div>
                            ))}
                        </div>


                        
        </Container>
    );
}