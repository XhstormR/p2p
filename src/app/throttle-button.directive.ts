import { Directive, input, model } from "@angular/core";

@Directive({
    selector: "button[appThrottleButton]",
    host: {
        "[disabled]": "disabled()",
        "(click)": "onClick()",
    },
})
export class ThrottleButtonDirective {
    throttleTime = input(4_000);
    disabled = model(false);

    onClick() {
        this.disabled.set(true);
        setTimeout(() => this.disabled.set(false), this.throttleTime());
    }
}
