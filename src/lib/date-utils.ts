export function format(date: Date, formatStr: string): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const replacements: Record<string, string> = {
    'yyyy': year.toString(),
    'MMMM': monthNames[month - 1],
    'MM': month.toString().padStart(2, '0'),
    'dd': day.toString().padStart(2, '0'),
    'HH': hours.toString().padStart(2, '0'),
    'mm': minutes.toString().padStart(2, '0'),
  };

  return formatStr.replace(/yyyy|MMMM|MM|dd|HH|mm/g, (match) => replacements[match]);
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function startOfWeek(date: Date): Date {
  const day = date.getDay();
  const diff = date.getDate() - day;
  return new Date(date.setDate(diff));
}

export function endOfWeek(date: Date): Date {
  const day = date.getDay();
  const diff = date.getDate() + (6 - day);
  return new Date(date.setDate(diff));
}

export function addMonths(date: Date, amount: number): Date {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + amount);
  return newDate;
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

export function getDaysInMonth(year: number, month: number): Date[] {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  const days: Date[] = [];
  
  for (let day = 1; day <= end.getDate(); day++) {
    days.push(new Date(year, month, day));
  }
  
  return days;
}

export function getCalendarDays(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startCalendar = new Date(firstDay);
  startCalendar.setDate(startCalendar.getDate() - firstDay.getDay());
  
  const days: Date[] = [];
  const currentDay = new Date(startCalendar);
  
  // Get 6 weeks worth of days (42 days)
  for (let i = 0; i < 42; i++) {
    days.push(new Date(currentDay));
    currentDay.setDate(currentDay.getDate() + 1);
  }
  
  return days;
}