import * as React from "react";
import { useRoute } from "wouter";
import { Container } from "../common/components/container";

export function MatchDetail() {
    const [matchId] = useRoute("/media-tools/:matchId");

    return (
        <Container>
            <h1>Match Detail</h1>
            <p>Match ID: {matchId}</p>
            {/* You can add more detailed information about the match here */}
        </Container>
    );
}