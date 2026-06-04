export type SelectionAction =
  | { type: "TOGGLE_ITEM"; id: string }
  | { type: "SELECT_ALL"; ids: string[] }
  | { type: "DESELECT_ALL" };

export const initialSelection: Set<string> = new Set();

export function selectionReducer(
  state: Set<string>,
  action: SelectionAction,
): Set<string> {
  switch (action.type) {
    case "TOGGLE_ITEM": {
      const next = new Set(state);
      if (next.has(action.id)) {
        next.delete(action.id);
      } else {
        next.add(action.id);
      }
      return next;
    }

    case "SELECT_ALL":
      return new Set(action.ids);
    case "DESELECT_ALL":
      return new Set();
  }
}
