import React, { createContext, useContext, useState, ReactNode } from "react";

// Define types
type Note = {
  id: string;
  title: string;
  body: string;
  createdAt?: Date;
  updatedAt?: Date;
};

type NotesContextType = {
  selectedNote: Note | null;
  setSelectedNote: (note: Note | null) => void;
};

// Create context
const NotesContext = createContext<NotesContextType | undefined>(undefined);

// Provider component
export const NotesProvider = ({ children }: { children: ReactNode }) => {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  return (
    <NotesContext.Provider value={{ selectedNote, setSelectedNote }}>
      {children}
    </NotesContext.Provider>
  );
};

// Custom hook to use the NotesContext
export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
};
