import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EisenhowerMatrix } from './components/eisenhower-matrix';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6 px-4">
        <Tabs defaultValue="eisenhower" className="w-full max-w-6xl mx-auto">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="eisenhower">Eisenhower Matrix</TabsTrigger>
            <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
          </TabsList>
          <TabsContent value="eisenhower" className="mt-6">
            <EisenhowerMatrix />
          </TabsContent>
          <TabsContent value="kanban" className="mt-6">
            <div className="p-4 bg-white rounded-lg shadow">
              <h1 className="text-2xl font-bold mb-4">Kanban Board</h1>
              <p className="text-gray-500">Coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export { App };
