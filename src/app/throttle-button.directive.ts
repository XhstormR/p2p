import { Directive, ElementRef, HostListener, Input, numberAttribute } from '@angular/core';

@Directive({
    selector: 'button[app-throttle-button]',
    standalone: true,
})
export class ThrottleButtonDirective {
    @Input({ transform: numberAttribute })
    throttleTime = 4_000;

    private target: HTMLButtonElement;

    constructor(el: ElementRef) {
        this.target = el.nativeElement;
    }

    @HostListener('click')
    onClick() {
        this.target.disabled = true;
        setTimeout(() => (this.target.disabled = false), this.throttleTime);
    }
}
