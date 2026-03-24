import { createContext, useContext, useState, ReactNode } from 'react';
import { mockRequests as initialRequests, PaymentRequest, RequestStatus } from '@/lib/mockData';

interface RequestsContextType {
  requests: PaymentRequest[];
  updateStatus: (id: string, status: RequestStatus) => void;
  getRequest: (id: string) => PaymentRequest | undefined;
}

const RequestsContext = createContext<RequestsContextType | undefined>(undefined);

export function RequestsProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<PaymentRequest[]>(initialRequests);

  const updateStatus = (id: string, status: RequestStatus) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const getRequest = (id: string) => requests.find(r => r.id === id);

  return (
    <RequestsContext.Provider value={{ requests, updateStatus, getRequest }}>
      {children}
    </RequestsContext.Provider>
  );
}

export function useRequests() {
  const ctx = useContext(RequestsContext);
  if (!ctx) throw new Error('useRequests must be used within RequestsProvider');
  return ctx;
}