import { TaskFormDialog } from '@/components/task-form-dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

import { cn } from '@/lib/utils';
import { paths } from '@/router';
import { SquarePlus } from 'lucide-react';
import { NavLink, Outlet } from 'react-router';

function RootRoute() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppSidebar />
      <main className="w-full h-screen relative p-4 overflow-auto flex flex-col">
        {children}
      </main>
    </>
  );
}

function AppSidebar() {
  const { state, isMobile } = useSidebar();

  const MobileMenu = () => {
    return (
      <div className="fixed bottom-0 left-0 w-full pointer-events-none p-2 flex justify-end items-center z-[9999]">
        <div className="bg-background border p-2 rounded-md w-fit flex gap-2 justify-center items-center pointer-events-auto h-12">
          {paths.map(
            ({ path, icon }) =>
              path && (
                <Button
                  key={path}
                  variant="secondary"
                  className="cursor-default size-8"
                  asChild
                >
                  <NavLink to={path}>{icon}</NavLink>
                </Button>
              ),
          )}
          <Separator orientation="vertical" />
          <TaskFormDialog>
            <Button variant="secondary" className="size-8">
              <SquarePlus />
            </Button>
          </TaskFormDialog>
        </div>
      </div>
    );
  };

  return (
    <>
      {isMobile && <MobileMenu />}
      <Sidebar variant="inset" collapsible="icon" className="border-r">
        <SidebarHeader className="flex items-center">
          <SidebarTriggerLogo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {paths.map(
                  ({ path, title, icon }) =>
                    path && (
                      <SidebarMenuItem key={path}>
                        <SidebarMenuButton className="cursor-default" asChild>
                          <NavLink to={path}>
                            {icon}
                            {state === 'expanded' && title}
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ),
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <TaskFormDialog>
            <SidebarMenuButton variant="outline">
              <SquarePlus />
              {state === 'expanded' && 'Add Task'}
            </SidebarMenuButton>
          </TaskFormDialog>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}

function SidebarTriggerLogo() {
  const { state, toggleSidebar } = useSidebar();

  return (
    <button onClick={toggleSidebar}>
      <div
        className={cn(
          'transition-transform duration-200 ease-linear',
          state === 'expanded' ? 'scale-x-[1]' : 'scale-x-[-1]',
        )}
      >
        🐢
      </div>
    </button>
  );
}

export { RootRoute };
