import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useCreateEvent, useUpdateEvent, useDeleteEvent, useFamilyMembers } from '@/hooks/use-calendar';
import { format } from '@/lib/date-utils';
import { toast } from 'sonner';
import { Trash, User } from '@phosphor-icons/react';
import type { Event } from '@/lib/data';

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date | null;
  event?: Event;
}

export function EventDialog({ open, onOpenChange, selectedDate, event }: EventDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [category, setCategory] = useState<Event['category']>('other');
  const [isAllDay, setIsAllDay] = useState(false);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();
  const { data: familyMembers = [] } = useFamilyMembers();

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || '');
      setDate(event.date);
      setTime(event.time || '');
      setEndTime(event.endTime || '');
      setCategory(event.category);
      setIsAllDay(event.isAllDay);
      setSelectedMemberIds(event.familyMemberIds);
    } else if (selectedDate) {
      setTitle('');
      setDescription('');
      setDate(format(selectedDate, 'yyyy-MM-dd'));
      setTime('');
      setEndTime('');
      setCategory('other');
      setIsAllDay(false);
      setSelectedMemberIds([]);
    }
  }, [event, selectedDate, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!date) {
      toast.error('Please select a date');
      return;
    }

    const eventData = {
      title: title.trim(),
      description: description.trim() || undefined,
      date,
      time: isAllDay ? undefined : time || undefined,
      endTime: isAllDay ? undefined : endTime || undefined,
      category,
      isAllDay,
      familyMemberIds: selectedMemberIds,
    };

    try {
      if (event) {
        await updateEvent.mutateAsync({ id: event._id, ...eventData });
        toast.success('Event updated successfully');
      } else {
        await createEvent.mutateAsync(eventData);
        toast.success('Event created successfully');
      }
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to save event');
    }
  };

  const handleDelete = async () => {
    if (!event) return;
    
    try {
      await deleteEvent.mutateAsync(event._id);
      toast.success('Event deleted successfully');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  const toggleMember = (memberId: string) => {
    setSelectedMemberIds(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {event ? 'Edit Event' : 'Add New Event'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter event description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={(value: Event['category']) => setCategory(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="appointment">Appointment</SelectItem>
                  <SelectItem value="birthday">Birthday</SelectItem>
                  <SelectItem value="holiday">Holiday</SelectItem>
                  <SelectItem value="activity">Activity</SelectItem>
                  <SelectItem value="reminder">Reminder</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="all-day"
              checked={isAllDay}
              onCheckedChange={setIsAllDay}
            />
            <Label htmlFor="all-day">All day event</Label>
          </div>

          {!isAllDay && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="time">Start Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-time">End Time</Label>
                <Input
                  id="end-time"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
          )}

          {familyMembers.length > 0 && (
            <div className="space-y-2">
              <Label>Family Members</Label>
              <div className="flex flex-wrap gap-2">
                {familyMembers.map(member => (
                  <Badge
                    key={member._id}
                    variant={selectedMemberIds.includes(member._id) ? "default" : "outline"}
                    className="cursor-pointer"
                    style={{
                      backgroundColor: selectedMemberIds.includes(member._id) ? member.color : undefined,
                      borderColor: member.color,
                    }}
                    onClick={() => toggleMember(member._id)}
                  >
                    <User size={12} className="mr-1" />
                    {member.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <div>
              {event && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={deleteEvent.isPending}
                >
                  <Trash size={16} className="mr-1" />
                  Delete
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createEvent.isPending || updateEvent.isPending}
              >
                {event ? 'Update' : 'Create'} Event
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}