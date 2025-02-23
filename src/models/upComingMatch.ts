

export type Match = {
    id: string;
    scheduledDate: Date;
    completedAt: Date;
    matchDay: MatchDay;
    home: Team;
    away: Team;

};

export type MatchDay = {
    number: string;
};

export type Team = {
    name: string;
    franchise: Franchise;
}

export type Franchise = {
    prefix: string;
    name: string;
}