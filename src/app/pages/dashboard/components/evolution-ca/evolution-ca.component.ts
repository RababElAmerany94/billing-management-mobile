import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NumberHelper } from 'src/app/core/helpers/number';
import { IChartData } from '../../dashboard.model';
import { Chart } from 'chart.js';
import { ChartHelper } from 'src/app/core/helpers/chart';

@Component({
    selector: 'app-evolution-ca',
    template: `
        <div class="dashboard-list">
            <canvas #chartChiffreAffaire height="250"></canvas>
        </div>
    `,
    styleUrls: ['../../../../../assets/components/dashboard.scss']
})
export class EvolutionCaComponent {

    @ViewChild('chartChiffreAffaire', { static: true }) canvas: ElementRef;

    @Input()
    set data(value: IChartData) {
        if (value != null) {
            this.initChart(value);
        }
    }

    constructor(
        private translate: TranslateService
    ) { }

    initChart(chartData: IChartData) {
        const _ = new Chart(this.canvas.nativeElement.getContext('2d'), {
            type: 'bar',
            data: this.initChartData(chartData),
            options: ChartHelper.optionsChart((label, value) => {
                return `${NumberHelper.formatNumberCurrency(value)}`;
            })
        });
    }

    /**
     * initialize chart data
     */
    initChartData(data: IChartData): { labels: string[], datasets: any[] } {
        const chartData = {
            labels: this.translateLabels(data.labels),
            datasets: [
                {
                    label: this.translate.instant('LABELS.CHIFFRE_AFFAIRE'),
                    backgroundColor: '#fd397a',
                    borderColor: '#fd397a',
                    data: data.serie
                }
            ]
        };
        return chartData;
    }

    /**
     * translate label of chart
     */
    translateLabels(labels: string[]): string[] {
        const result: string[] = [];
        labels.forEach(element => {
            result.push(this.translate.instant(`MONTHS.${element}`));
        });
        return result;
    }

}
