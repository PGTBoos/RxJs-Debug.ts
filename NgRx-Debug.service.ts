// Found this on the web at home, its a debugger service for ngrx
//@NgModule({
  // ... other imports and declarations
  //providers: [NgRxDebugService],
  // ...
//})
export class AppModule { }


import { Injectable, NgZone } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NgRxDebugService {
  private readonly ACTION_DISPATCH = 'NgRx Action Dispatched';
  private readonly STATE_CHANGE = 'NgRx State Changed';
  private readonly EFFECT_TRIGGERED = 'NgRx Effect Triggered';

  constructor(
    private store: Store,
    private actions$: Actions,
    private ngZone: NgZone
  ) {}

  init() {
    this.interceptActions();
    this.interceptStateChanges();
    this.interceptEffects();
  }

  private interceptActions() {
    const originalDispatch = this.store.dispatch;
    this.store.dispatch = (action: any) => {
      console.group(this.ACTION_DISPATCH);
      console.log('Action:', action);
      console.groupEnd();
      return originalDispatch.call(this.store, action);
    };
  }

  private interceptStateChanges() {
    let previousState: any;
    this.store.subscribe(state => {
      this.ngZone.run(() => {
        console.group(this.STATE_CHANGE);
        console.log('Previous State:', previousState);
        console.log('Current State:', state);
        console.log('Changes:', this.getStateChanges(previousState, state));
        console.groupEnd();
        previousState = { ...state };
      });
    });
  }

  private interceptEffects() {
    this.actions$.pipe(
      tap(action => {
        console.group(this.EFFECT_TRIGGERED);
        console.log('Effect Action:', action);
        console.groupEnd();
      })
    ).subscribe();
  }

  private getStateChanges(previous: any, current: any) {
    if (!previous) return current;
    return Object.keys(current).reduce((changes, key) => {
      if (previous[key] !== current[key]) {
        changes[key] = {
          previous: previous[key],
          current: current[key]
        };
      }
      return changes;
    }, {} as any);
  }
}
