import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { IRepartitionDossiersTechnicien } from '../../dashboard.model';
import { Chart } from 'chart.js';
import { NumberHelper } from 'src/app/core/helpers/number';
import { ChartHelper } from 'src/app/core/helpers/chart';
import { ColorsHelper } from 'src/app/core/helpers/colors';
import { CopyHelper } from 'src/app/core/helpers/copy';

@Component({
    selector: 'app-repartition-dossiers-par-technicien',
    template: `
        <div class='dashboard-list'>
            <canvas #chart height='250'></canvas>
        </div>
    `,
    styleUrls: ['../../../../../assets/components/dashboard.scss']
})
export class RepartitionDossiersParTechnicienComponent {

    @ViewChild('chart', { static: true }) canvas: ElementRef;

    @Input()
    set data(value: IRepartitionDossiersTechnicien[]) {
        if (value != null) {
            this.initializationChart(value);
        }
    }

    constructor() { }

    initializationChart(data: IRepartitionDossiersTechnicien[]) {
        const _ = new Chart(this.canvas.nativeElement.getContext('2d'), {
            type: 'horizontalBar',
            data: this.initChartData(data),
            options: ChartHelper.optionsChart((label, value) => {
                return NumberHelper.formatNumberPrice(value);
            })
        });
    }

    /**
     * initialize chart data
     */
    initChartData(data: IRepartitionDossiersTechnicien[]): { labels: string[], datasets: any[] } {
        const colors = CopyHelper.copy(ColorsHelper.colors);
        const chartData = {
            labels: data.map(e => e.technicien),
            datasets: [
                {
                    label: '',
                    backgroundColor: colors.shift(),
                    data: data.map(e => e.nombreDossiers)
                }
            ]
        };
        return chartData;
    }

}
