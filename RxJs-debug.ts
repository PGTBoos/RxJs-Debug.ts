import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {isDevMode} from '@angular/core';

export enum RxJsLoggingLevel {
  NONE,
  INFO,
  DEBUG,
  ERROR
}

export type ExtraNotifications = {
  subscribe?: boolean;
  unsubscribe?: boolean;
  finalize?: boolean;
}

const enableRxJsLogging = true;  // This can be toggled by code

let rxjsLoggingLevel = RxJsLoggingLevel.NONE;

export function setRxJsLoggingLevel(level: RxJsLoggingLevel) {
  rxjsLoggingLevel = level;
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
   * this function replaces the following debug tap code:
   *  .pipe(
   *  tap(editMode => console.log('Edit mode:', editMode))
   *  );
   *
   *  with:
   *  .pipe(
   *  RxJsDebug(  RxJsLoggingLevel.INFO, 'Edit mode:' )
   *  );
   */
  export function RxJsDebug<T>(level: RxJsLoggingLevel, message: string, includeStackTrace: boolean = false) {
    return (source: Observable<T>) => source
      .pipe(
        tap(val => {
          if (enableRxJsLogging && isDevMode()) {
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





/**
 * Enhances RxJS debugging capabilities by providing detailed logging for observable streams, including subscription, unsubscription, and finalization events. This function is an extension of `RxJsDebug`, offering deeper insights into the observable lifecycle.
 *
 * Unlike `RxJsDebug`, which focuses on logging the values emitted by an observable, `RxJsDebugDeep` allows for more granular control over what gets logged. It supports additional notifications for subscribe, unsubscribe, and finalize events, providing a comprehensive view of the observable's lifecycle. This is particularly useful for tracking down memory leaks or understanding complex subscription chains.
 *
 * @param level - The logging level. Determines the verbosity of the logs.
 * @param message - A message to prefix the logs with, providing context.
 * @param includeStackTrace - Optional. If true, includes the stack trace in the logs for next values and errors, aiding in debugging.
 * @param extraNotifications - Optional. An object specifying which additional lifecycle events (subscribe, unsubscribe, finalize) should be logged.
 * @returns A function that takes an Observable and returns an Observable. This function does not alter the stream's data or behavior but adds logging side effects.
 *
 * @example
 * // To log detailed information about an observable including when it is subscribed to and finalized:
 * observable.pipe(
 *   RxJsDebugDeep(RxJsLoggingLevel.DEBUG, 'some text of waht you debug:', false, {subscribe: true, finalize: true})
 * );
 */
 export function RxJsDebugDeep<T>(level: RxJsLoggingLevel, message: string, includeStackTrace: boolean = false, extraNotifications?: ExtraNotifications) {
  const formatNotif = (notif: string, data?: unknown) => [
    new Date().toISOString(),
    `[${message}: ${notif}]`,
    data,
  ];
  return (source: Observable<T>) => source.pipe(
    tap({
      next: val => {
        if (enableRxJsLogging && isDevMode() && level >= rxjsLoggingLevel) {
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
        if (enableRxJsLogging && isDevMode() && RxJsLoggingLevel.ERROR >= rxjsLoggingLevel) {
          const stackTrace = includeStackTrace ? new Error().stack : '';
          console.error(...formatNotif('Error', err), stackTrace);
        }
      },
      complete: () => {
        if (enableRxJsLogging && isDevMode() && level >= rxjsLoggingLevel) {
          console.info(...formatNotif('Completed'));
        }
      },
      subscribe: () => {
        if (enableRxJsLogging && isDevMode() && extraNotifications?.subscribe) {
          console.info(...formatNotif('Subscribed'));
        }
      },
      unsubscribe: () => {
        if (enableRxJsLogging && isDevMode() && extraNotifications?.unsubscribe) {
          console.info(...formatNotif('Unsubscribed'));
        }
      },
      finalize: () => {
        if (enableRxJsLogging && isDevMode() && extraNotifications?.finalize) {
          console.info(...formatNotif('Finalized'));
        }
      },
    })
  );
}
