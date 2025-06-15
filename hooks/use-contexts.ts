"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Context {
  id: string;
  name: string;
  description?: string | null;
  icon: string;
  color: string;
  shared?: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Raw API response type (with string dates)
interface ContextApiResponse {
  id: string;
  name: string;
  description?: string | null;
  icon: string;
  color: string;
  shared?: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Transform API response to have proper Date objects
function transformContext(context: ContextApiResponse): Context {
  return {
    ...context,
    createdAt: new Date(context.createdAt),
    updatedAt: new Date(context.updatedAt),
  };
}

// Fetch all contexts
export function useContexts() {
  return useQuery({
    queryKey: ["contexts"],
    queryFn: async (): Promise<Context[]> => {
      const response = await fetch("/api/contexts");
      if (!response.ok) {
        throw new Error("Failed to fetch contexts");
      }
      const data = await response.json();
      return data.map(transformContext);
    },
  });
}

// Create a new context
export function useCreateContext() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contextData: {
      name: string;
      description?: string;
      icon?: string;
      color?: string;
      shared?: boolean;
    }) => {
      const response = await fetch("/api/contexts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contextData),
      });

      if (!response.ok) {
        throw new Error("Failed to create context");
      }

      const data = await response.json();
      return transformContext(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contexts"] });
    },
  });
}

// Update a context
export function useUpdateContext() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Context>;
    }) => {
      const response = await fetch(`/api/contexts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to update context");
      }

      const data = await response.json();
      return transformContext(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contexts"] });
    },
  });
}

// Delete a context
export function useDeleteContext() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/contexts/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete context");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contexts"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}