import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Plus, CaretLeft, CaretRight } from '@phosphor-icons/react';
import { format, getCalendarDays, isToday, addMonths } from '@/lib/date-utils';
import { useEvents } from '@/hooks/use-calendar';
import { EventDialog } from './EventDialog';
import { cn } from '@/lib/utils';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);

  const { data: events = [] } = useEvents();

  const calendarDays = getCalendarDays(currentDate.getFullYear(), currentDate.getMonth());
  const currentMonth = format(currentDate, 'yyyy-MM');

  const getEventsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return events.filter(event => event.date === dateStr);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsEventDialogOpen(true);
  };

  const handlePreviousMonth = () => {
    setCurrentDate(prev => addMonths(prev, -1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  const handleAddEvent = () => {
    setSelectedDate(new Date());
    setIsEventDialogOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <CalendarIcon size={32} className="text-primary" />
            <h1 className="text-3xl font-bold">Family Calendar</h1>
          </div>
        </div>
        <Button onClick={handleAddEvent} className="gap-2">
          <Plus size={20} />
          Add Event
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePreviousMonth}>
              <CaretLeft size={16} />
            </Button>
            <Button variant="outline" size="sm" onClick={handleNextMonth}>
              <CaretRight size={16} />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
          {WEEKDAYS.map(day => (
            <div key={day} className="bg-muted p-3 text-center font-medium text-sm">
              {day}
            </div>
          ))}
          
          {calendarDays.map((day, index) => {
            const dayEvents = getEventsForDate(day);
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isDayToday = isToday(day);

            return (
              <div
                key={index}
                className={cn(
                  "bg-card min-h-24 p-2 cursor-pointer hover:bg-muted/50 transition-colors",
                  !isCurrentMonth && "text-muted-foreground bg-muted/30"
                )}
                onClick={() => handleDateClick(day)}
              >
                <div className={cn(
                  "text-sm font-medium mb-1",
                  isDayToday && "bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center"
                )}>
                  {day.getDate()}
                </div>
                
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map(event => (
                    <Badge
                      key={event._id}
                      variant="secondary"
                      className="text-xs block truncate"
                    >
                      {event.title}
                    </Badge>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-muted-foreground">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <EventDialog
        open={isEventDialogOpen}
        onOpenChange={setIsEventDialogOpen}
        selectedDate={selectedDate}
      />
    </div>
  );
}