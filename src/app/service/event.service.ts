import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { error } from '../utils';

@Injectable({
    providedIn: 'root',
})
export class EventService implements OnDestroy {
    private eventChannels = new Map<string, Subject<any>>();
    private subscriptions: Subscription[] = [];

    public emitEvent(event: string, data: any) {
        this.eventChannels.get(event)?.next(data);
    }

    public onEvent<T>(event: string, callback: (value: T) => void) {
        this.registerEvent(event);
        let subject = this.eventChannels.get(event) || error('');
        let subscription = subject.subscribe(callback);
        subscription.add(() => this.unregisterEvent(event));
        this.subscriptions.push(subscription);
        console.debug(`[EventService] onEvent ${event}`, this.eventChannels);
        return subscription;
    }

    ngOnDestroy() {
        this.subscriptions.forEach(v => v.unsubscribe());
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
