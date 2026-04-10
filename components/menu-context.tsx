"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface MenuContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isServicesOpen: boolean;
  setIsServicesOpen: (open: boolean) => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  return (
    <MenuContext.Provider value={{ isOpen, setIsOpen, isServicesOpen, setIsServicesOpen }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
}