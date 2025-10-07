import { z } from 'zod';
import { collection } from '@github/spark/db';

export const familyMember = z.object({
  name: z.string(),
  color: z.string(),
  avatar: z.string().optional(),
});

export const familyMemberCollection = collection(familyMember, 'familyMembers');

export const event = z.object({
  title: z.string(),
  description: z.string().optional(),
  date: z.string(), // ISO date string
  time: z.string().optional(), // HH:MM format
  endTime: z.string().optional(), // HH:MM format
  familyMemberIds: z.array(z.string()).default([]),
  category: z.enum(['appointment', 'birthday', 'holiday', 'activity', 'reminder', 'other']).default('other'),
  isAllDay: z.boolean().default(false),
  createdAt: z.number().default(() => Date.now()),
  updatedAt: z.number().default(() => Date.now()),
});

export const eventCollection = collection(event, 'events');

export type FamilyMember = z.infer<typeof familyMember> & { _id: string };
export type Event = z.infer<typeof event> & { _id: string };