import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRouter } from './router';
import { SidebarProvider } from '@/components/ui/sidebar';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider defaultOpen={false}>
        <AppRouter />
      </SidebarProvider>
    </QueryClientProvider>
  );
}

export { App };
