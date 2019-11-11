export class FAQ {
    id: number;
    sporsmal: string;
    svar: string;
}

export interface IFAQ {
    id: number;
    sporsmal: string;
    svar: string;
}

export class InnSporsmal {
    id: number;
    navn: string;
    epost: string;
    sporsmal: string;
}

export interface IInnsporsmal {
    id: number;
    navn: string;
    epost: string;
    sporsmal: string;
}
