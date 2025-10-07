import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventCollection, familyMemberCollection, type Event, type FamilyMember } from '@/lib/data';

export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: () => eventCollection.getAll(),
  });
}

export function useEventsForDate(date: string) {
  return useQuery({
    queryKey: ['events', 'by-date', date],
    queryFn: async () => {
      const events = await eventCollection.getAll();
      return events.filter(event => event.date === date);
    },
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (eventData: Omit<Event, '_id' | 'createdAt' | 'updatedAt'>) => 
      eventCollection.insert({
        ...eventData,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, ...eventData }: Partial<Event> & { id: string }) =>
      eventCollection.update(id, {
        ...eventData,
        updatedAt: Date.now(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => eventCollection.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

export function useFamilyMembers() {
  return useQuery({
    queryKey: ['familyMembers'],
    queryFn: () => familyMemberCollection.getAll(),
  });
}

export function useCreateFamilyMember() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (memberData: Omit<FamilyMember, '_id'>) => 
      familyMemberCollection.insert(memberData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['familyMembers'] });
    },
  });
}