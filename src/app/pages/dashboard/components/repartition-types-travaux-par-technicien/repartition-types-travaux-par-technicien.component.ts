import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Chart } from 'chart.js';
import { TypeTravaux } from 'src/app/core/enums/type-travaux.enum';
import { ChartHelper } from 'src/app/core/helpers/chart';
import { ColorsHelper } from 'src/app/core/helpers/colors';
import { ConversionHelper } from 'src/app/core/helpers/conversion';
import { CopyHelper } from 'src/app/core/helpers/copy';
import { NumberHelper } from 'src/app/core/helpers/number';
import { IRepartitionTypesTravauxParTechnicien } from '../../dashboard.model';

@Component({
    selector: 'app-repartition-types-travaux-par-technicien',
    template: `
        <div class='dashboard-list'>
            <canvas #chart height='250'></canvas>
        </div>
    `,
    styleUrls: ['../../../../../assets/components/dashboard.scss']
})
export class RepartitionTypesTravauxParTechnicienComponent {

    @ViewChild('chart', { static: true }) chart: ElementRef;

    @Input()
    set data(value: IRepartitionTypesTravauxParTechnicien[]) {
        if (value != null) {
            this.initializationChart(value);
        }
    }

    constructor(
        private translate: TranslateService
    ) { }

    initializationChart(data: IRepartitionTypesTravauxParTechnicien[]) {
        const barChartData = this.initializeChartData(data);
        const _ = new Chart(this.chart.nativeElement, {
            type: 'horizontalBar',
            data: barChartData,
            options: ChartHelper.optionsHorizontalBar((label, value) => {
                return `${label}: ${NumberHelper.formatNumberPrice(value)} m²`;
            })
        });
    }

    initializeChartData(data: IRepartitionTypesTravauxParTechnicien[]) {
        if (data.length > 0) {
            const typesTravaux = ConversionHelper.convertEnumToListKeysValues<number, string>(TypeTravaux, 'number');
            const colors = CopyHelper.copy(ColorsHelper.colors);
            return {
                labels: data.map(e => e.technicien),
                datasets: typesTravaux.map(type => {
                    return {
                        label: this.translate.instant(`TYPE_TRAVAUX.${type.value}`),
                        backgroundColor: colors.shift(),
                        data: data.map(item => {
                            const result = item.surfaceParTypeTravaux.find(e => e.typeTravaux === type.value);
                            return result == null ? 0 : result.surfaceTraiter;
                        })
                    };
                })
            };
        }
    }

}
