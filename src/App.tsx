import { Authenticated, Unauthenticated } from "convex/react";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { useState } from "react";
import { CreateCampaign } from "./CreateCampaign";
import { ReviewPosts } from "./ReviewPosts";
import { CompanyAssets } from "./CompanyAssets";
import { CampaignHistory } from "./CampaignHistory";
import { Navigation } from "./Navigation";
import { Menu } from "lucide-react";
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from "./components/ui/sidebar";
import { Separator } from "./components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./components/ui/breadcrumb";

export default function App() {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<"home" | "company" | "history">("home");

  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen flex w-full">
        <Authenticated>
          <Sidebar>
            <Navigation currentTab={currentTab} onTabChange={setCurrentTab} />
          </Sidebar>
          <SidebarInset className="flex-1 w-0">
            <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      {currentTab === "home"
                        ? "Home"
                        : currentTab === "company"
                          ? "Company Assets"
                          : "Campaign History"}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </header>
            <main className="flex-1 p-4">
              <div className="flex flex-col gap-8">
                <Content
                  currentTab={currentTab}
                  selectedCampaignId={selectedCampaignId}
                  setSelectedCampaignId={setSelectedCampaignId}
                  setCurrentTab={setCurrentTab}
                />
              </div>
            </main>
          </SidebarInset>
        </Authenticated>
        <Unauthenticated>
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
              <SignInForm />
            </div>
          </div>
        </Unauthenticated>
        <Toaster />
      </div>
    </SidebarProvider>
  );
}

function Content({
  currentTab,
  selectedCampaignId,
  setSelectedCampaignId,
  setCurrentTab,
}: {
  currentTab: "home" | "company" | "history";
  selectedCampaignId: string | null;
  setSelectedCampaignId: (id: string | null) => void;
  setCurrentTab: (tab: "home" | "company" | "history") => void;
}) {
  return (
    <div className="flex flex-col gap-8">
      <Unauthenticated>
        <div className="text-center">
          <h1 className="text-5xl font-bold accent-text mb-4">
            AI Marketing Agent
          </h1>
          <p className="text-xl text-slate-600">Sign in to get started</p>
        </div>
        <SignInForm />
      </Unauthenticated>
      <Authenticated>
        {selectedCampaignId ? (
          <ReviewPosts
            campaignId={selectedCampaignId}
            onBack={() => setSelectedCampaignId(null)}
          />
        ) : (
          <>
            {currentTab === "home" && (
              <CreateCampaign onCampaignCreated={setSelectedCampaignId} />
            )}
            {currentTab === "company" && <CompanyAssets />}
            {currentTab === "history" && (
              <CampaignHistory
                onCampaignSelect={(id) => {
                  setSelectedCampaignId(id);
                  setCurrentTab("home");
                }}
              />
            )}
          </>
        )}
      </Authenticated>
    </div>
  );
}
