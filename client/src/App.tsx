import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Pages
import Home from "@/pages/Home";
import Step1Character from "@/pages/Wizard/Step1Character";
import Step2Storyboard from "@/pages/Wizard/Step2Storyboard";
import Step3Animation from "@/pages/Wizard/Step3Animation";
import Step4Export from "@/pages/Wizard/Step4Export";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      
      {/* Wizard Routes */}
      <Route path="/wizard/character" component={Step1Character} />
      <Route path="/wizard/storyboard" component={Step2Storyboard} />
      <Route path="/wizard/animation" component={Step3Animation} />
      <Route path="/wizard/export" component={Step4Export} />
      
      {/* Catch-all */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
