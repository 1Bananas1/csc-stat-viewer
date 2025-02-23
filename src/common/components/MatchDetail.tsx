import * as React from "react";


export function MatchDetail() {
    const { matchId } = useParams();

    return (
        <div>
            <h1>Match Detail</h1>
            <p>Match ID: {matchId}</p>
        </div>
    );
}