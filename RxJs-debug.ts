// This is intended for the harder debug problems.
// You can add the extra logging code and keep it in production, rxjs debug can be globally switched off, or since v3 be as well controled by a boolean.
// There is also a replacement for console.log which can be controlled on a per file boolean, and wont log in production.
// These are all extra's you can still use console.log for those places you dont mind everybody can see it, or where it doesnt overwhelm you.
//
// V3 added a function overload so RxJSDebug can use a first verbose value as well
// v2 added ConsoleLog, it logs only in dev mode and if a (per file) based verbose bool is set
// v1 basic rxjs logging



import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {isDevMode} from '@angular/core';

//RxjS-Debug doesnt have .warn . error  as console.log does instead its controlled by a level
export enum RxJsLoggingLevel {
  NONE,
  INFO,
  DEBUG,
  ERROR
}

// to control the extra notifications for RxJsFlow
export type ExtraNotifications = {
  subscribe?: boolean;
  unsubscribe?: boolean;
  finalize?: boolean;
}

// If you want to turn off RxJs logging, of everywhere in debug mode, set it to false
const enableRxJsLogging = true;

// Above the minimum level, all will be shown
let rxjsLoggingLevel = RxJsLoggingLevel.NONE;

// To control the logging level by code elsewhere
export function setRxJsLoggingLevel(level: RxJsLoggingLevel) {
  rxjsLoggingLevel = level;
}

/**
 * Enhances RxJS debugging capabilities by providing detailed logging for observable streams, including subscription, unsubscription, and finalization events. This function is an extension of `RxJsDebug`, offering deeper insights into the observable lifecycle.
 *
 * Unlike `RxJsDebug`, which focuses on logging the values emitted by an observable, `RxJsDebugFlow` allows for more granular control over what gets logged. It supports additional notifications for subscribe, unsubscribe, and finalize events, providing a comprehensive view of the observable's lifecycle. This is particularly useful for tracking down memory leaks or understanding complex subscription chains.
 *
 * @param level - The logging level. Determines the verbosity of the logs.
 * @param message - A message to prefix the logs with, providing context.
 * @param includeStackTrace - Optional. If true, includes the stack trace in the logs for next values and errors, aiding in debugging.
 * @param extraNotifications - Optional. An object specifying which additional lifecycle events (subscribe, unsubscribe, finalize) should be logged.
 * @returns A function that takes an Observable and returns an Observable. This function does not alter the stream's data or behavior but adds logging side effects.
 *
 * @example
 * // To log detailed information about an observable including when it is subscribed to and finalized:
 * observable.pipe( RxJsDebugFlow(RxJsLoggingLevel.DEBUG, 'some text of what you debug:', false, {subscribe: true, finalize: true})
 * // There is an overload so you can also use a verbose boolean which then also must be true
 * observable.pipe( RxJsDebugFlow(this.verbose, RxJsLoggingLevel.DEBUG, 'some text of what you debug:', false, {subscribe: true, finalize: true}));
 */
export function RxJsDebugFlow<T>(level: RxJsLoggingLevel, message: string, includeStackTrace?: boolean, extraNotifications?: ExtraNotifications): (source: Observable<T>) => Observable<T>;
export function RxJsDebugFlow<T>(verbose: boolean, level: RxJsLoggingLevel, message: string, includeStackTrace?: boolean, extraNotifications?: ExtraNotifications): (source: Observable<T>) => Observable<T>;
export function RxJsDebugFlow<T>(...args: any[]): (source: Observable<T>) => Observable<T> {
  const [arg1, arg2, arg3, arg4, arg5] = args;

  const verbose = typeof arg1 === 'boolean' ? arg1 : true;
  const level = typeof arg1 === 'boolean' ? arg2 : arg1;
  const message = typeof arg1 === 'boolean' ? arg3 : arg2;
  const includeStackTrace = typeof arg1 === 'boolean' ? arg4 : arg3 || false;
  const extraNotifications = typeof arg1 === 'boolean' ? arg5 : arg4 || {};

  const formatNotif = (notif: string, data?: unknown) => [
    new Date().toISOString(),
    `[${message}: ${notif}]`,
    data,
  ];

  return (source: Observable<T>) => source.pipe(
    tap({
      next: val => {
        if (verbose && enableRxJsLogging && isDevMode() && level >= rxjsLoggingLevel) {
          const stackTrace = includeStackTrace ? new Error().stack : '';
          switch (level) {
            case RxJsLoggingLevel.ERROR:
              console.error(...formatNotif('Next', val), stackTrace);
              break;
            case RxJsLoggingLevel.INFO:
              console.log(...formatNotif('Next', val), stackTrace);
              break;
            case RxJsLoggingLevel.DEBUG:
              console.warn(...formatNotif('Next', val), stackTrace);
              break;
          }
        }
      },
      error: err => {
        if (verbose && enableRxJsLogging && isDevMode() && RxJsLoggingLevel.ERROR >= rxjsLoggingLevel) {
          const stackTrace = includeStackTrace ? new Error().stack : '';
          console.error(...formatNotif('Error', err), stackTrace);
        }
      },
      complete: () => {
        if (verbose && enableRxJsLogging && isDevMode() && level >= rxjsLoggingLevel) {
          console.info(...formatNotif('Completed'));
        }
      },
      subscribe: () => {
        if (verbose && enableRxJsLogging && isDevMode() && extraNotifications?.subscribe) {
          console.info(...formatNotif('Subscribed'));
        }
      },
      unsubscribe: () => {
        if (verbose && enableRxJsLogging && isDevMode() && extraNotifications?.unsubscribe) {
          console.info(...formatNotif('Unsubscribed'));
        }
      },
      finalize: () => {
        if (verbose && enableRxJsLogging && isDevMode() && extraNotifications?.finalize) {
          console.info(...formatNotif('Finalized'));
        }
      },
    })
  );
}


/**
 * Logs debug information for the given observable, but only in debug mode.
 * @param level - The logging level.
 * @param message - The log message.
 * @returns A function that takes an Observable and logs information based on the logging level.
 * @param includeStackTrace - Whether to include the stack trace in the log.
 * @returns A function that takes an Observable and logs information based on the logging level.
 *
 * @example
 *  //this function replaces the following debug tap code:
 *  .pipe( tap(editMode => console.log('Edit mode:', editMode))  );
 *
 *  //with:
 *  .pipe( RxJsDebug(  RxJsLoggingLevel.INFO, 'Edit mode:' ));
 *  //There is also a overload to use a verbose boolean, that then also should be true (for per file debugging)
 *  .pipe( RxJsDebug(this.verbose, RxJsLoggingLevel.INFO, 'Edit mode:' ));
 */
// Overloads for RxJsDebug
export function RxJsDebug<T>(level: RxJsLoggingLevel, message: string, includeStackTrace?: boolean): (source: Observable<T>) => Observable<T>;
export function RxJsDebug<T>(verbose: boolean, level: RxJsLoggingLevel, message: string, includeStackTrace?: boolean): (source: Observable<T>) => Observable<T>;
export function RxJsDebug<T>(...args: any[]): (source: Observable<T>) => Observable<T> {
  const [arg1, arg2, arg3, arg4] = args;

  const verbose = typeof arg1 === 'boolean' ? arg1 : true;
  const level = typeof arg1 === 'boolean' ? arg2 : arg1;
  const message = typeof arg1 === 'boolean' ? arg3 : arg2;
  const includeStackTrace = typeof arg1 === 'boolean' ? arg4 : arg3 || false;

  return (source: Observable<T>) => source
    .pipe(
      tap(val => {
        if (verbose && enableRxJsLogging && isDevMode()) {
          if (level >= rxjsLoggingLevel) {
            const typeInfo = typeof val;
            const stackTrace = includeStackTrace ? new Error().stack : '';  // Capture stack trace if needed
            switch (level) {
              case RxJsLoggingLevel.ERROR:
                console.error(`*${typeInfo}* ${message}:`, val, stackTrace);
                break;
              case RxJsLoggingLevel.INFO:
                console.log(`*${typeInfo}* ${message}:`, val, stackTrace);
                break;
              case RxJsLoggingLevel.DEBUG:
                console.warn(`*${typeInfo}* ${message}:`, val, stackTrace);
                break;
            }
          }
        }
      })
    );
}


//Besides RxJs I'm adding extra console loggers, for those to show logging all you need to do is, is set a local value to true ea this.verbose
type Loggable = string | number | boolean | object | null | undefined | Loggable[] | unknown;

/**
 * ConsoleLog as console.log but without the dot.
 * Logs messages to the console, but only in debug mode, based upon a leading boolean which you can set on a per file basis
 */
export function ConsoleLog(verbose: boolean, ...messages: Loggable[]) {
  if (isDevMode() && verbose) {
    console.log(...messages);
  }
}

/**
 * ConsoleError as console.error but without the dot.
 * Logs error messages to the console, but only in debug mode, based upon a leading boolean which you can set on a per file basis
 */
export function ConsoleError(verbose: boolean, ...messages: Loggable[]) {
  if (isDevMode() && verbose) {
    console.error(...messages);
  }
}

/**
 * ConsoleWarning as console.warn but without the dot.
 * Logs warning messages to the console, but only in debug mode, based upon a leading boolean which you can set on a per file basis
 */
export function ConsoleWarn(verbose: boolean, ...messages: Loggable[]) {
  if (isDevMode() && verbose) {
    console.warn(...messages);
  }
}
