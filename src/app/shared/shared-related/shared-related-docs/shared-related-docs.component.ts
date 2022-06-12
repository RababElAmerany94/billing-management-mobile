import { Component, OnInit, Input } from '@angular/core';
import { IDocumentAssociate } from 'src/app/core/models/general/documentAssociate.model';
import { DocType } from 'src/app/core/enums/doctype.enums';
import { TranslateService } from '@ngx-translate/core';
import { RouteName } from 'src/app/core/enums/route.enum';
import { NavController } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';
import { ModeEnum } from 'src/app/core/enums/mode.enum';

@Component({
    selector: 'app-shared-related-docs',
    templateUrl: './shared-related-docs.component.html'
})
export class SharedRelatedDocsComponent implements OnInit {

    @Input()
    set data(value: any) {
        if (value != null) {
            this.items = value;
        }
    }

    /** related docs types */
    doctype = DocType;

    /** type of document */
    type = DocType;

    /** list of related docs */
    items: IDocumentAssociate[];

    navigationExtras: NavigationExtras;

    constructor(
        private translate: TranslateService,
        public navCtrl: NavController,
        public router: Router,
    ) { }

    ngOnInit() { }

    /** display header data */
    getHeader = () => [
        this.translate.instant('LABELS.TYPE'),
        this.translate.instant('LABELS.REFERENCE'),
        this.translate.instant('LABELS.DATE_CREATION'),
    ]

    /** display details of document  */
    goToDocument(id: string, type: any) {

        switch (type) {

            case this.doctype.Dossier:
                this.navigationExtras = {
                    queryParams: {
                        mode: ModeEnum.Show,
                        id,
                        isNavigationRoute: true
                    }
                };
                this.router.navigate([`/${RouteName.Dossier}`], this.navigationExtras);
                break;

            case this.doctype.BonCommande:
                this.navigationExtras = {
                    queryParams: {
                        mode: ModeEnum.Show,
                        id,
                        isNavigationRoute: true
                    }
                };
                this.router.navigate([`/${RouteName.BonCommande}`], this.navigationExtras);
                break;

            case this.doctype.Devis:
                const navigationExtras: NavigationExtras = {
                    queryParams: {
                        mode: ModeEnum.Show,
                        isNavigationRoute: true,
                        id
                    }
                };
                this.router.navigate([`/${RouteName.Devis}`], navigationExtras);
                break;

            default:
                break;
        }
    }

}
