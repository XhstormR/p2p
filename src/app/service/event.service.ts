import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class EventService {
    private eventChannels = new Map<string, Subject<any>>();

    public emitEvent(event: string, data: any) {
        let subject = this.eventChannels.get(event);
        if (subject) {
            subject.next(data);
            return true;
        } else {
            return false;
        }
    }

    public onEvent<T>(event: string) {
        this.registerEvent(event);
        let subject: Subject<T> = this.eventChannels.get(event)!;
        console.debug(`[EventService] onEvent ${event}`, this.eventChannels);
        return subject.asObservable().pipe(finalize(() => this.unregisterEvent(event)));
    }

    private registerEvent(event: string) {
        if (!this.eventChannels.has(event)) this.eventChannels.set(event, new Subject());
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
