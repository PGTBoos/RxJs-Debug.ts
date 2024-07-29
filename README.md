# Debugging RxJS can be challenging.
I created a simple debug tap replacment and a debug service for debugging state activity
As I've found trying to fix other left persons's code, rxjs isnt easy to get a grip of when things go wrong. 
Especially if your not the original disigner of the code you work on.
I dont feel myself an expert in this area, though i was able to create a few helpfull tools.
A state log service, and debugging logging that logs to console in devmode only with some level setting.

## Angular *NgRx-Debug.service.ts*
This logs all the store events.
Depending on your code this logging might overwhelm you, so maybe you only want RxJs-debug.ts
To use it :
1. This service needs be be added in **app.module.ts** as a provider, alike `provider :[NgRxDebugService]` and an import.
2. Then in **app.component.ts**
   1. import it `{NgRxDebugService} from "./utils/NgRx-Debug.service";` (from where you saved this in your project)
   2. inside the constructor add a `private ngRxDebugService: NgRxDebugService` 
   3. inside ngOninit add  `if(isDevMode()){    this.ngRxDebugService.init();}`
      

## Angular *RxJs-Debug.ts*
RxJs console debug (simple), log only in devmode  

I've created this script as a simple tool that can be used in place of tap and console.log commands  
With the benefit that this command only works in developer mode.  

Within the code the log levels can be altered, and it can be disabled as well.  
As you wont need this often, but rather in case of problems.    
And you would not want to log all that info in a production environment.    
Hence this code was created.   

There are 2 commands:  
 - ```Java
   RxJsDebug(  RxJsLoggingLevel.INFO, 'Edit mode:' )
   ```
 - ```Java
   RxJsDebugFlow(RxJsLoggingLevel.DEBUG, 'some text of what you debug:', false, {subscribe: true, finalize: true})`
   ```

The first command, you can use basically to replace tap to console logging, though this one runs in devmode only.   
The Second is more an extention and does log basic life cycle info as well (verry basic sorry)  
I wanted to have 2 so it's more clear essentially the second can do both its more an extension.  


### Installation
just copy RjXs-debug.ts file to a utils folder, link to it with an import and you're ready to go.  
The commands are documented so using it shouldn't be a big problem.

### Background
I got inspired by some scripts and examples, and had some ideas about it as well.   
And i had a need to log a lot of RxJs flows, and thus i didnt want to make the code ugly   
by putting in between `tap(value => {console.log('Spy:', value);}` everywhere.   
As that would run in production as well, this checks if its running in debug mode.   
I gues maybe in some edge case you still like to use tap, but with this it can be a lot less.   

## If you like it, give it a star
Well i'm curious if people actually make use of things i provide for free.
If you give me a star, then I know people use it, and then i wont delete it.
