import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetNameOfUserById } from './get-name-of-user-by-id.pipe';
import { TruncatePipe } from './truncate.pipe';
import { RoundingNumberPipe } from './rounding-number.pipe';
import { CurrencyPipe } from './currency.pipe';
import { GetImageBase64ByName } from './get-image-base64-by-name.pipe';

@NgModule({
    declarations: [
        CurrencyPipe,
        GetNameOfUserById,
        TruncatePipe,
        RoundingNumberPipe,
        GetImageBase64ByName
    ],
    imports: [
        CommonModule
    ],
    exports: [
        CurrencyPipe,
        GetNameOfUserById,
        TruncatePipe,
        RoundingNumberPipe,
        GetImageBase64ByName
    ],
    providers: [],
})
export class PipesModule { }
