"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { myVenues as initialVenues, type VendorVenue } from "@/data/dashboard";

type VendorVenuesContextValue = {
  venues: VendorVenue[];
  addVenue: (venue: VendorVenue) => void;
  successMessage: string | null;
  setSuccessMessage: (message: string | null) => void;
};

const VendorVenuesContext = createContext<VendorVenuesContextValue | null>(null);

export function VendorVenuesProvider({ children }: { children: ReactNode }) {
  const [venues, setVenues] = useState<VendorVenue[]>(initialVenues);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const addVenue = useCallback((venue: VendorVenue) => {
    setVenues((prev) => [venue, ...prev]);
  }, []);

  return (
    <VendorVenuesContext.Provider
      value={{ venues, addVenue, successMessage, setSuccessMessage }}
    >
      {children}
    </VendorVenuesContext.Provider>
  );
}

export function useVendorVenues() {
  const context = useContext(VendorVenuesContext);
  if (!context) {
    throw new Error("useVendorVenues must be used within VendorVenuesProvider");
  }
  return context;
}
