import React, { createContext, useContext } from 'react';
import type { useUIDSeed } from 'react-uid';

interface MenuStaticContextValue {
  triggerRef: React.RefObject<HTMLElement>;
  seed: ReturnType<typeof useUIDSeed>;
  onAction?: (key: string) => void;
}

const menuContext = createContext<MenuStaticContextValue>({} as any);

menuContext.displayName = 'MenuContext';

export const MenuProvider = menuContext.Provider;

export function useMenu() {
  return useContext(menuContext);
}
