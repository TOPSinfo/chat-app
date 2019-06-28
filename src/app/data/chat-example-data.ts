import * as Redux from 'redux';
import {
  AppState,
  getAllMessages
} from '../app.reducer';
import { uuid } from '../util/uuid';
import * as moment from 'moment';
import { Thread } from '../thread/thread.model';
import * as ThreadActions from '../thread/thread.actions';
import { User } from '../user/user.model';
import * as UserActions from '../user/user.actions';


const me: User = {
  id: uuid(),
  isClient: true, 
  name: 'Sarang',
};

const ladycap: User = {
  id: uuid(),
  name: 'Nimesh',
};

const echo: User = {
  id: uuid(),
  name: 'test',
};

const rev: User = {
  id: uuid(),
  name: 'Mac',
};

const wait: User = {
  id: uuid(),
  name: 'Bernd',
};

const tLadycap: Thread = {
  id: 'tLadycap',
  name: ladycap.name,
  messages: []
};

const tEcho: Thread = {
  id: 'tEcho',
  name: echo.name,
  messages: []
};

const tRev: Thread = {
  id: 'tRev',
  name: rev.name,
  messages: []
};

const tWait: Thread = {
  id: 'tWait',
  name: wait.name,
  messages: []
};

export function ChatExampleData(store: Redux.Store<AppState>) {

  // set the current User
  store.dispatch(UserActions.setCurrentUser(me));

  // create a new thread and add messages
  store.dispatch(ThreadActions.addThread(tLadycap));
  store.dispatch(ThreadActions.addMessage(tLadycap, {
    author: me,
    sentAt: moment().subtract(45, 'minutes').toDate(),
    text: 'hello'
  }));
  store.dispatch(ThreadActions.addMessage(tLadycap, {
    author: ladycap,
    sentAt: moment().subtract(20, 'minutes').toDate(),
    text: 'hello'
  }));

  // create a few more threads
  store.dispatch(ThreadActions.addThread(tEcho));
  store.dispatch(ThreadActions.addMessage(tEcho, {
    author: echo,
    sentAt: moment().subtract(1, 'minutes').toDate(),
    text: 'hello'
  }));

  store.dispatch(ThreadActions.addThread(tRev));
  store.dispatch(ThreadActions.addMessage(tRev, {
    author: rev,
    sentAt: moment().subtract(3, 'minutes').toDate(),
    text: 'hello'
  }));

  store.dispatch(ThreadActions.addThread(tWait));
  store.dispatch(ThreadActions.addMessage(tWait, {
    author: wait,
    sentAt: moment().subtract(4, 'minutes').toDate(),
    text: `hello`
  }));

  // select the first thread
  store.dispatch(ThreadActions.selectThread(tLadycap));

  const handledMessages = {};
}
