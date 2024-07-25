import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isDevMode } from '@angular/core';

export enum RxJsLoggingLevel {
  NONE,
  INFO,
  DEBUG,
  ERROR
}

// Here you can turn it off for debug mode
const enableRxJsLogging = true;  

// Log above this level.
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
