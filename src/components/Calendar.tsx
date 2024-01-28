'use client';

import {
    CalendarEvent,
    EnhancedEvent,
    EventsReceivedEvent,
} from '@/calendar.entities';
import { FC, useCallback, useEffect, useState } from 'react';
import { UiCalendarEvent } from './UiCalendarEvent';

function layOutDay(events: CalendarEvent[]): void {
    window.dispatchEvent(new CustomEvent('eventsReceived', { detail: events }));
}

declare global {
    interface Window {
        layOutDay: (events: CalendarEvent[]) => void;
    }
    interface WindowEventMap {
        eventsReceived: EventsReceivedEvent;
    }
}
window.layOutDay = layOutDay;

function getMaximumNumberOfCurrentEvents(
    events: CalendarEvent[],
    timeFrame: CalendarEvent,
): number {
    let max = 0;

    for (let i = timeFrame.start; i <= timeFrame.end; i++) {
        const currentEvents = events.filter((e) => e.start <= i && e.end >= i);
        if (currentEvents.length > max) max = currentEvents.length;
    }

    return max;
}

export const Calendar: FC = () => {
    const [events, setEvents] = useState<EnhancedEvent[]>([]);

    useEffect(() => {
        const listener = (e: EventsReceivedEvent) => {
            // ensure events are sorted by first to last starting, it will ease the upcoming calculations
            let sortedEvents = e.detail.sort((a, b) => a.start - b.start);

            const enhancedEvents = sortedEvents.map((event) => {
                const maximumNumberOfConcurrentEvent =
                    getMaximumNumberOfCurrentEvents(sortedEvents, event);

                return {
                    ...event,
                    numberOfConcurrentEvents: maximumNumberOfConcurrentEvent,
                };
            });

            setEvents(enhancedEvents);
        };

        window.addEventListener('eventsReceived', listener);

        layOutDay([
            { start: 30, end: 150 },
            { start: 540, end: 600 },
            { start: 560, end: 620 },
            { start: 610, end: 670 },
        ]);

        return () => {
            window.removeEventListener('eventsReceived', listener);
        };
    }, []);

    const maximumNumberOfConcurrentEvents = Math.max(
        0,
        ...events.map((e) => e.numberOfConcurrentEvents),
    );

    const renderLegendItem = useCallback((time: string, index: number) => {
        const date = new Date('10-10-2010 9:00');
        date.setMinutes(date.getMinutes() + parseInt(time));

        const dateStrings = date
            .toLocaleTimeString('en-US', {
                timeStyle: 'short',
            })
            .split(' ');

        if (index % 2 === 0) {
            return (
                <p key={`time-${time}`} className="text-black text-xm">
                    <span>{dateStrings[0]}</span>
                    <span className="text-xs text-gray-500">
                        &nbsp;{dateStrings[1]}
                    </span>
                </p>
            );
        }

        return (
            <span className="text-gray-500 text-xs" key={`time-${time}`}>
                {dateStrings[0]}
            </span>
        );
    }, []);

    return (
        <div className="p-4 pl-10 flex bg-white">
            <div className="flex flex-col justify-between pr-2 items-end">
                {[
                    '0',
                    '30',
                    '60',
                    '90',
                    '120',
                    '150',
                    '180',
                    '110',
                    '140',
                    '170',
                    '200',
                    '230',
                    '260',
                    '290',
                    '320',
                    '350',
                    '380',
                    '410',
                    '440',
                    '470',
                    '500',
                    '530',
                    '560',
                    '590',
                    '620',
                ].map((time, index) => renderLegendItem(time, index))}
            </div>

            <div
                className={`bg-gray-100 h-[720px] w-[620px] px-[10px] relative grid grid-cols-${maximumNumberOfConcurrentEvents} grid-rows-[720]`}
            >
                {events.map((event, index) => (
                    <UiCalendarEvent
                        key={`event-${index}`}
                        numberOfColumns={maximumNumberOfConcurrentEvents}
                        {...event}
                    />
                ))}
            </div>
        </div>
    );
};
