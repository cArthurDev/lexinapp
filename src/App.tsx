import React, { useState } from "react";
import { isLoggedIn } from "@/lib/auth";
import LoginPage from "@/pages/LoginPage";
import Workspace from "@/pages/Workspace";
import { Toaster as Sonner } from "@/components/ui/sonner";

const App: React.FC = () => {
  const [authed, setAuthed] = useState(isLoggedIn());

  if (!authed) {
    return (
      <>
        <Sonner />
        <LoginPage onLogin={() => setAuthed(true)} />
      </>
    );
  }

  return (
    <>
      <Sonner />
      <Workspace onLogout={() => setAuthed(false)} />
    </>
  );
};

export default App;
