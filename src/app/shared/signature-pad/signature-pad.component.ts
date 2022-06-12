import { Component, ViewChild, Output, Input, EventEmitter } from '@angular/core';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { Platform } from '@ionic/angular';

@Component({
    selector: 'app-signature-pad',
    template: `
        <ng-container *ngIf="options" >
            <ion-label>{{ label }} </ion-label>
            <div
                [ngStyle]="{ 'height': (options.canvasWidth+ 25)+'px', 'width': options.canvasWidth+'px' }"
                class="signature-container"
                *ngIf="!readonly">
                <ion-icon
                    name="close-outline"
                    size="large"
                    (click)="clearCanvas()">
                </ion-icon>
                <signature-pad
                    id="signatureCanvas"
                    [options]="options"
                    (onEndEvent)="drawComplete()">
                </signature-pad>
            </div>
            <div class="signature-container" *ngIf="readonly">
                <img [src]="Signature" >
            </div>
        </ng-container>
    `
})
export class SignaturePadComponent {

    @ViewChild(SignaturePad, { static: false })
    signaturePad: SignaturePad;

    @Input()
    id: string;

    @Input()
    label: string;

    @Input()
    readonly = false;

    @Output()
    signature = new EventEmitter<string>();

    @Input()
    Signature: string;

    /*** signature pad options */
    options: {
        canvasWidth: number;
        canvasHeight: number;
    };

    constructor(
        public platform: Platform) {
        this.options = {
            canvasWidth: (platform.width() - platform.width() * .28),
            canvasHeight: (platform.width() - platform.width() * .28)
        };
    }

    drawComplete(): void {
        this.signature.emit(this.signaturePad.toDataURL());
    }

    /** clear canvas de signature */
    clearCanvas(): void {
        this.signaturePad.clear();
        this.signature.emit('');
    }

}
