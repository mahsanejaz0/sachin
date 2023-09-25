import store from '../store';

export const ActionType = {
  RESIZE: 'RESIZE',
  SET_ACTIVE_NODE: 'SET_ACTIVE_NODE',
  SET_DATA: 'SET_DATA',
  SET_FILTER: 'SET_FILTER'
};

export function resize() {
  store.dispatch({
    type: ActionType.RESIZE
  });
}

export function setActiveNode(node) {
  store.dispatch({
    type: ActionType.SET_ACTIVE_NODE,
    node: node
  });
}

export function setFilter(filter) {
  store.dispatch({
    type: ActionType.SET_FILTER,
    filter: filter
  });
}
