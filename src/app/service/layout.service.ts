import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import '../prototype.utils';

@Injectable({
    providedIn: 'root',
})
export class LayoutService {
    readonly isXSmall = this.breakpointObserver
        .observe(Breakpoints.XSmall)
        .pipe(
            map(result => result.matches),
            shareReplay(),
        )
        ._toSignal();

    constructor(private breakpointObserver: BreakpointObserver) {}
}
