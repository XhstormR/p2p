import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { finalize } from "rxjs/operators";
import { EventTypeMap } from "../event.model";

@Injectable({
    providedIn: "root",
})
export class EventService {
    private eventChannels = new Map<string, Subject<any>>();

    public emitEvent<T extends keyof EventTypeMap, U extends EventTypeMap[T]>(event: T, data: U) {
        let subject = this.eventChannels.get(event);
        if (subject) {
            subject.next(data);
            return true;
        } else {
            return false;
        }
    }

    public onEvent<T extends keyof EventTypeMap, U extends EventTypeMap[T]>(event: T) {
        let subject: Subject<U> = this.eventChannels.get(event) || this.registerEvent(event);
        console.debug(`[EventService] onEvent ${event}`, this.eventChannels);
        return subject.asObservable().pipe(finalize(() => this.unregisterEvent(event)));
    }

    private registerEvent(event: string) {
        let subject = this.eventChannels.get(event) || new Subject();
        this.eventChannels.set(event, subject);
        return subject;
    }

    private unregisterEvent(event: string) {
        let subject = this.eventChannels.get(event);
        if (subject && !subject.observed) {
            subject.unsubscribe();
            this.eventChannels.delete(event);
            console.debug(`[EventService] unregisterEvent ${event} `, this.eventChannels);
        }
    }
}
