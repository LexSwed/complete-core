import React, { useCallback, useContext, useEffect, useLayoutEffect,  useRef } from 'react';
import { useUID } from 'react-uid';
import { portalContext } from '../Portal/Portal';

type PossibleRef<T> = React.Ref<T> | ((instance: T | null) => void) | null | undefined;

/**
 * https://react-hooks.org/docs/use-fork-ref
 */
export function useForkRef<T extends Element>(...refs: Array<PossibleRef<T>>) {
  return React.useMemo(() => {
    if (!refs.some(Boolean)) return;

    return (value: T | null) => {
      refs.forEach((ref) => setRef<T>(ref, value));
    };
  }, refs); // eslint-disable-line react-hooks/exhaustive-deps
}

function setRef<T = unknown>(ref: PossibleRef<T>, value: T | null) {
  if (typeof ref === 'function') {
    ref(value);
  } else if (typeof ref === 'object' && ref !== null) {
    (ref as any).current = value;
  }
}

export const isServer = typeof document === 'undefined';

export const useIsomorphicLayoutEffect = isServer ? useEffect : useLayoutEffect;

export const useLatest = <T>(value: T): { readonly current: T } => {
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref;
};

export function joinNonEmpty(...strings: Array<string | undefined>) {
  return strings.filter(Boolean).join(' ');
}

export function useAllHandlers<E = React.SyntheticEvent<any, Event>>(
  ...handlers: (
    | (E extends React.SyntheticEvent<any, Event> ? React.EventHandler<E> : (...args: any[]) => void)
    | undefined
  )[]
): E extends React.SyntheticEvent<any, Event> ? React.EventHandler<E> : (...args: any[]) => void {
  const handlersRef = useRef(handlers);

  useEffect(() => {
    handlersRef.current = handlers;
  }, handlers); // eslint-disable-line react-hooks/exhaustive-deps

  return useCallback((...args: any[]) => {
    handlersRef.current.forEach((fn) => (fn as any)?.(...args));
  }, []) as E extends React.SyntheticEvent<any, Event> ? React.EventHandler<E> : (...args: any[]) => void;
}

export type KeyboardHandler = ((event: React.KeyboardEvent<any>) => void) | undefined;
export type KeyboardHandlers = {
  [Key in React.KeyboardEvent<any>['key'] | `${React.KeyboardEvent<any>['key']}.propagate`]: KeyboardHandler;
};

export function useKeyboardHandles(handlers: KeyboardHandlers): KeyboardHandler {
  const handlersRef = useRef(handlers);

  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  return useCallback<(event: React.KeyboardEvent<any>) => void>((event) => {
    const handlers = handlersRef.current;
    let handler = handlers[event.key];
    if (handler) {
      event.preventDefault();
      return handler(event);
    }
    handler = handlers[`${event.key}.propagate`];
    if (handler) {
      handler(event);
    }
  }, []);
}

const MOUSEDOWN = 'mousedown';
const TOUCHSTART = 'touchstart';
const POINTERDOWN = 'pointerdown';

type HandledEventsType = typeof TOUCHSTART | typeof MOUSEDOWN | typeof POINTERDOWN;
type PossibleEvent = {
  [Type in HandledEventsType]: HTMLElementEventMap[Type];
}[HandledEventsType];
type Handler = (event: PossibleEvent) => void;

const events: HandledEventsType[] = [MOUSEDOWN, TOUCHSTART, POINTERDOWN];

export function useOnClickOutside(handler: Handler | null, isActive: boolean, ...refs: React.RefObject<HTMLElement>[]) {
  const handlerRef = useLatest(handler);
  const { ref } = useContext(portalContext);

  refs.push(ref);

  useEffect(() => {
    if (!isActive) {
      return;
    }
    const listener = (event: PossibleEvent) => {
      if (refs.some((ref) => ref.current?.contains?.(event.target as Node))) {
        return;
      }
      handlerRef.current?.(event);
    };

    events.forEach((event) => {
      document.addEventListener(event, listener);
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, listener);
      });
    };
  }, [handlerRef, isActive, ...refs]); //eslint-disable-line react-hooks/exhaustive-deps
}

export function useId(id?: string) {
  let newId = useUID();

  return id || newId;
}
