import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { Calendar } from '@/components/Calendar';
import { FamilyMemberManager } from '@/components/FamilyMemberManager';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-6 space-y-6">
          <FamilyMemberManager />
          <Calendar />
        </div>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;