import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FAQ, IFAQ } from "./KundeService";
import { InnSporsmal, IInnsporsmal } from "./KundeService";

@Component({
  selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./StyleSheet.scss']
})
export class AppComponent {
    visInnsporsmal: boolean;
    InnsporsmalStatus: string;
    visInnsporsmalListe: boolean;
    alleInnsporsmal: Array<InnSporsmal>;
    InnsporsmalSkjema: FormGroup;
    laster: boolean; 

    visHjem: boolean;

    visFAQ: boolean;
    FAQStatus: string;
    visFAQListe: boolean;
    alleFAQ: Array<FAQ>;
    FAQ: FormGroup;


    constructor(private _http: HttpClient, private fb: FormBuilder) {
        this.InnsporsmalSkjema = fb.group({
            id: [""],
            navn: [null, Validators.compose([Validators.required, Validators.pattern("[a-zA-ZøæåØÆÅ\\-.0-9]{2,50}")])],
            epost: [null, Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")])],
            sporsmal: [null, Validators.compose([Validators.required, Validators.pattern("^[a-zøæåA-ZØÆÅ.0-9.? \\-]{5,50}$")])],
        });
    } 

    ngOnInit() {
        this.laster = true;

        //this.hentAlleFAQ();
        //this.visFAQ = false;
        //this.visFAQListe = true;
        this.visHjem = true;
        this.hentAlleInnsporsmal();
        this.visInnsporsmal = false;
        this.visInnsporsmalListe = false;
    }

    hentAlleInnsporsmal() {
        this._http.get<IInnsporsmal[]>("api/innsporsmal/")
            .subscribe(
                Innsporsmalene => {
                    this.alleInnsporsmal = Innsporsmalene;
                    this.laster = false;
                    console.log("Ferdig med post-api/innsporsmal");
                },
                error => alert(error),
            );
    };

    onSubmit() {
        if (this.InnsporsmalStatus == "Registrer") {
            this.lagreInnsporsmal();
        }
        else if (this.InnsporsmalStatus == "Endre") {
            this.endreEtInnsporsmal();
        }
        else {
            alert("Feil i applikasjonen!");
        }
    }

    registrerInnsporsmal() {
        this.InnsporsmalSkjema.setValue({
            id: "",
            navn: "",
            epost: "",
            sporsmal: ""
        });
        //Setter statusen til skjemaet som "uberørt" slik at det ikke blir skrevet ut valederings-feilmeldinger
        this.InnsporsmalSkjema.markAsPristine();
        this.visInnsporsmalListe = false;
        this.InnsporsmalStatus = "Registrer";
        this.visInnsporsmal = true;
        this.visHjem = false;
    }

    tilbakeTilInnsporsmal() {
        this.visInnsporsmalListe = true;
        this.visInnsporsmal = false;
        this.visHjem = false;
    }

    tilbakeTilHjem() {
        this.visInnsporsmalListe = false;
        this.visInnsporsmal = false;
        this.visHjem = true;
    }

    tilbakeTilInnsendigAvSporsmal() {
        this.visInnsporsmalListe = false;
        this.visInnsporsmal = true;
        this.visHjem = false;
    }

    lagreInnsporsmal() {
        var lagretInnsporsmal = new InnSporsmal();

        lagretInnsporsmal.navn = this.InnsporsmalSkjema.value.navn;
        lagretInnsporsmal.epost = this.InnsporsmalSkjema.value.epost;
        lagretInnsporsmal.sporsmal = this.InnsporsmalSkjema.value.sporsmal;

        const body: string = JSON.stringify(lagretInnsporsmal);
        const headers = new HttpHeaders({ "Content-Type": "application/json" });

        this._http.post("api/innsporsmal", body, { headers: headers })
            .subscribe(
                () => {
                    this.hentAlleInnsporsmal();
                    this.visInnsporsmal = false;
                    this.visInnsporsmalListe = true;
                    this.visHjem = false;
                    console.log("Ferdig med post-api/innsporsmal");
                },
                error => alert(error),
            );
    };

    slettInnsporsmal(id: number) {
        this._http.delete("api/innsporsmal/" + id)
            .subscribe(
                () => {
                    this.hentAlleInnsporsmal();
                    console.log("Ferdig med delete-api/innsporsmal");
                },
                error => alert(error),
            );
    };

    endreInnsporsmal(id: number) {
        this._http.get<IInnsporsmal>("api/innsporsmal/" + id)
            .subscribe(
                innsporsmal => {
                    this.InnsporsmalSkjema.patchValue({ id: innsporsmal.id });
                    this.InnsporsmalSkjema.patchValue({ navn: innsporsmal.navn });
                    this.InnsporsmalSkjema.patchValue({ epost: innsporsmal.epost });
                    this.InnsporsmalSkjema.patchValue({ sporsmal: innsporsmal.sporsmal });
                    console.log("Ferdig med get-api/innsporsmal");
                },
                error => alert(error),
        );
        this.InnsporsmalStatus = "Endre";
        this.visInnsporsmal = true;
        this.visInnsporsmalListe = false;
        this.visHjem = false;
    }

    endreEtInnsporsmal() {
        const endretInnsporsmal = new InnSporsmal();

        endretInnsporsmal.sporsmal = this.InnsporsmalSkjema.value.sporsmal;

        const body: string = JSON.stringify(endretInnsporsmal);
        const headers = new HttpHeaders({ "Content-Type": "application/json" });

        this._http.put("api/innsporsmal/" + this.InnsporsmalSkjema.value.id, body, { headers: headers })
            .subscribe(
                () => {
                    this.hentAlleInnsporsmal();
                    this.visInnsporsmal = false;
                    this.visInnsporsmalListe = true;
                    this.visHjem = false;
                    console.log("Ferdig med post-api/innsporsmal");
                },
                error => alert(error)
            );
    }

    /*
    hentAlleFAQ() {
        this._http.get<IFAQ[]>("api/faq/")
            .subscribe(
                FAQene => {
                    this.alleFAQ = FAQene;
                    this.laster = false;
                    console.log("Ferdig med post-api/faq");
                },
                error => alert(error),
            );
    };

    onSubmit() {
        if (this.FAQStatus == "Registrer") {
            this.lagreFAQ();
        }
        else if (this.FAQStatus == "Endre") {
            this.endreEnFAQ();
        }
        else {
            alert("Feil i applikasjonen!");
        }
    }
    
    registrerFAQ() {
        this.FAQ.setValue({
            id: "",
            sporsmal: "",
            svar: ""
        });
    
        //Setter statusen til skjemaet som "uberørt" slik at det ikke blir skrevet ut valederings-feilmeldinger
        this.FAQ.markAsPristine();
        this.visFAQ = false;
        this.FAQStatus = "Registrer";
        this.visFAQ = true;
    }
    
    tilbakeTilFAQ() {
        this.visFAQListe = true;
        this.visFAQ = false;
    }
    
    lagreFAQ() {
        var lagretFAQ = new FAQ();
    
        lagretFAQ.sporsmal = this.FAQ.value.sporsmal;
        lagretFAQ.svar = this.FAQ.value.svar;
    
        const body: string = JSON.stringify(lagretFAQ);
        const headers = new HttpHeaders({ "Content-Type": "application/json" });
    
        this._http.post("api/faq", body, { headers: headers })
            .subscribe(
                () => {
                    this.hentAlleFAQ();
                    this.visFAQ = false;
                    this.visFAQListe = true;
                    console.log("Ferdig med post-api/faq");
                },
                error => alert(error),
            );
    };
    
    slettFAQ(id: number) {
        this._http.delete("api/faq/" + id)
            .subscribe(
                () => {
                    this.hentAlleFAQ();
                    console.log("Ferdig med delete-api/faq");
                },
                error => alert(error),
            );
    };
    
    endreFAQ(id: number) {
        this._http.get<IFAQ>("api/faq/" + id)
            .subscribe(
                faq => {
                    this.FAQ.patchValue({ id: faq.id });
                    this.FAQ.patchValue({ sporsmal: faq.sporsmal });
                    this.FAQ.patchValue({ svar: faq.svar });
                    console.log("Ferdig med get-api/faq");
                },
                error => alert(error),
            );
        this.FAQStatus = "Endre";
        this.visFAQ = true;
        this.visFAQListe = false;
    }
    
    endreEnFAQ() {
        const endretFAQ = new FAQ();
    
        endretFAQ.sporsmal = this.FAQ.value.sporsmal;
        endretFAQ.svar = this.FAQ.value.svar;
    
        const body: string = JSON.stringify(endretFAQ);
        const headers = new HttpHeaders({ "Content-Type": "application/json" });
    
        this._http.put("api/faq/" + this.FAQ.value.id, body, { headers: headers })
            .subscribe(
                () => {
                    this.hentAlleFAQ();
                    this.visFAQ = false;
                    this.visFAQListe = true;
                    console.log("Ferdig med post-api/faq");
                },
                error => alert(error)
            );
    }
    */

    isExpanded = false;

    collapse() {
        this.isExpanded = false;
    }

    toggle() {
        this.isExpanded = !this.isExpanded;
    }
}
