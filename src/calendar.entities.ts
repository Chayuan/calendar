export type CalendarEvent = {
    start: number;
    end: number;
};

export interface EnhancedEvent extends CalendarEvent {
    numberOfConcurrentEvents: number;
}

export interface EventsReceivedEvent extends Event {
    detail: CalendarEvent[];
}
