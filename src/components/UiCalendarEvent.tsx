import { EnhancedEvent } from '@/calendar.entities';
import { FC } from 'react';

interface CalendarEventProps extends EnhancedEvent {
    numberOfColumns: number;
}

export const UiCalendarEvent: FC<CalendarEventProps> = ({
    start,
    end,
    numberOfConcurrentEvents,
    numberOfColumns,
}) => {
    return (
        <div
            className={`bg-white p-4 border border-l-4 border-l-blue-800 
            ${numberOfConcurrentEvents === 1 ? 'col-span-full' : ''}
            col-span-${numberOfColumns - numberOfConcurrentEvents + 1}
        `}
            style={{
                gridRowStart: start,
                gridRowEnd: end,
            }}
        >
            <p className="text-blue-500 font-bold text-sm">Sample Item</p>
            <p className="text-gray-500 text-xs">Sample Location</p>
        </div>
    );
};
