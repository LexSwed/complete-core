import React, { useContext, createContext, useMemo, useRef, useState } from 'react';
import { useUIDSeed } from 'react-uid';

type MenuStaticContextValue = {
  triggerRef: React.RefObject<HTMLElement>;
  popoverRef: React.RefObject<HTMLElement>;
  seed: ReturnType<typeof useUIDSeed>;
  onAction?: (key: string) => void;
};

const menuContext = createContext<MenuStaticContextValue>({} as any);

export const MenuProvider: React.FC<{
  onAction?: (key: string) => void;
}> = ({ children, onAction }) => {
  const seed = useUIDSeed();
  const triggerRef = useRef<HTMLElement>(null);
  const popoverRef = useRef<HTMLElement>(null);

  const menuContextValue = useMemo(
    () => ({
      triggerRef,
      popoverRef,
      seed,
      onAction,
    }),
    [triggerRef, popoverRef, seed, onAction]
  );

  return (
    <menuContext.Provider value={menuContextValue}>
      <MenuStateProvider>
        <>{children}</>
      </MenuStateProvider>
    </menuContext.Provider>
  );
};

const menuStateContext = createContext(false);
const menuStateControlsContext = createContext<ReturnType<typeof useOpenState>[1]>({} as any);

export const MenuStateProvider: React.FC = ({ children }) => {
  const [isOpen, controls] = useOpenState();

  return (
    <menuStateControlsContext.Provider value={controls}>
      <menuStateContext.Provider value={isOpen}>{children}</menuStateContext.Provider>
    </menuStateControlsContext.Provider>
  );
};

export function useMenu() {
  return useContext(menuContext);
}

export function useMenuOpenState() {
  return useContext(menuStateContext);
}

export function useMenuControlState() {
  return useContext(menuStateControlsContext);
}

type InternalState = { lastKey: string | null; items: Map<HTMLLIElement, { act: string }> };
type MenuControlFunctions = {
  stateRef: {
    readonly current: InternalState;
  };
  open: () => void;
  close: () => void;
  toggle: () => void;
  update: (state?: Partial<InternalState>) => void;
};
const initialState: InternalState = { lastKey: null, items: new Map() };
function useOpenState(): [isOpen: boolean, controls: MenuControlFunctions] {
  const [isOpen, setOpen] = useState(false);
  const internalStateRef = useRef<InternalState>(initialState);

  const controls = useMemo<MenuControlFunctions>(
    () => ({
      stateRef: internalStateRef,
      open: () => {
        setOpen(true);
      },
      close: () => {
        internalStateRef.current = initialState;
        setOpen(false);
      },
      toggle: () => {
        setOpen((open) => {
          if (open) {
            internalStateRef.current = initialState;
          }
          return !open;
        });
      },
      update: (state) => {
        internalStateRef.current = {
          ...internalStateRef.current,
          ...state,
        };
      },
    }),
    []
  );

  return [isOpen, controls];
}