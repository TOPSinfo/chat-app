/* tslint:disable no-switch-case-fall-through */
import { Action } from 'redux';
import { createSelector } from 'reselect';

import { Thread } from './thread.model';
import { Message } from '../message/message.model';
import * as ThreadActions from './thread.actions';

export interface ThreadsEntities {
  [id: string]: Thread;
}

export interface ThreadsState {
  ids: string[];
  entities: ThreadsEntities;
  currentThreadId?: string;
};

const initialState: ThreadsState = {
  ids: [],
  currentThreadId: null,
  entities: {}
};

/**
 * The `ThreadsReducer` describes how to modify the `ThreadsState` given a
 * particular action.
 */
export const ThreadsReducer =
  function(state: ThreadsState = initialState, action: Action): ThreadsState {
  switch (action.type) {

    // Adds a new Thread to the list of entities
    case ThreadActions.ADD_THREAD: {
      const thread = (<ThreadActions.AddThreadAction>action).thread;

      if (state.ids.includes(thread.id)) {
        return state;
      }

      return {
        ids: [ ...state.ids, thread.id ],
        currentThreadId: state.currentThreadId,
        entities: Object.assign({}, state.entities, {
          [thread.id]: thread
        })
      };
    }

    // Adds a new Message to a particular Thread
    case ThreadActions.ADD_MESSAGE: {
      const thread = (<ThreadActions.AddMessageAction>action).thread;
      const message = (<ThreadActions.AddMessageAction>action).message;

      // special case: if the message being added is in the current thread, then
      // mark it as read
      const isRead = message.thread.id === state.currentThreadId ?
                      true : message.isRead;
      const newMessage = Object.assign({}, message, { isRead: isRead });

      // grab the old thraed from entities
      const oldThread = state.entities[thread.id];

      // create a new thread which has our newMessage
      const newThread = Object.assign({}, oldThread, {
        messages: [...oldThread.messages, newMessage]
      });

      return {
        ids: state.ids, // unchanged
        currentThreadId: state.currentThreadId, // unchanged
        entities: Object.assign({}, state.entities, {
          [thread.id]: newThread
        })
      };
    }

    // Select a particular thread in the UI
    case ThreadActions.SELECT_THREAD: {
      const thread = (<ThreadActions.SelectThreadAction>action).thread;
      const oldThread = state.entities[thread.id];

      // mark the messages as read
      const newMessages = oldThread.messages.map(
        (message) => Object.assign({}, message, { isRead: true }));

      // give them to this new thread
      const newThread = Object.assign({}, oldThread, {
        messages: newMessages
      });

      return {
        ids: state.ids,
        currentThreadId: thread.id,
        entities: Object.assign({}, state.entities, {
          [thread.id]: newThread
        })
      };
    }

    case ThreadActions.DELETE_THREAD: {
      const threadId = (<ThreadActions.DeleteThreadAction>action).threadId;
      console.log(threadId,'threadId')
      if (!state.ids.includes(threadId)) {
        return state;
      }
      const ids = state.ids.filter(_val => _val !== threadId);
      const threads = state.entities;
      delete threads[threadId]
      return {
        ids: [ ...ids ],
        currentThreadId: ids[0],
        entities: Object.assign({}, threads)
      };
    }

    default:
      return state;
  }
};

export const getThreadsState = (state): ThreadsState => state.threads;

export const getThreadsEntities = createSelector(
  getThreadsState,
  ( state: ThreadsState ) => state.entities );

export const getAllThreads = createSelector(
  getThreadsEntities,
  ( entities: ThreadsEntities ) => Object.keys(entities)
                        .map((threadId) => entities[threadId]));



// This selector emits the current thread
export const getCurrentThread = createSelector(
  getThreadsEntities,
  getThreadsState,
  ( entities: ThreadsEntities, state: ThreadsState ) =>
    entities[state.currentThreadId] );

export const getAllMessages = createSelector(
  getAllThreads,
  ( threads: Thread[] ) =>
    threads.reduce( // gather all messages
      (messages, thread) => [...messages, ...thread.messages],
      [])); 
