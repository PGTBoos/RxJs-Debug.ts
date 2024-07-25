# Angular RxJs-Debug.ts
RxJs console debug (simple), log only in devmode  

I've created this script as a simple tool that can be used in place of tap and console.log commands  
With the bennefit that this command only works in developer mode.  

Within the code the log levels can be altered, and it can be disabled as well.  
As you wont need this often, but rather in case of problems.    
And you would not want to log all that info in a production environment.    
Henche this code was created.   

There are 2 commands:  
 - `RxJsDebug(  RxJsLoggingLevel.INFO, 'Edit mode:' )`
 - `RxJsDebugFlow(RxJsLoggingLevel.DEBUG, 'some text of what you debug:', false, {subscribe: true, finalize: true})`

The first command, you can use basically to replace tap to console logging, though this one runs in devmode only.   
The Seccond is more an extention and does log basic life cycle info as well (verry basic sorry)  
I wanted to have 2 so it's more clear essentially the seccond can do both its more an extension.  


# Installation
just copy RjXs-debug.ts file to a utils folder, link to it with an import and your ready to go.  
The commands are documented so using it shouldn't be a big problem.

# Background
I got inspired by some scripts and examples, and had some ideas about it as well.   
And i had a need to log a lot of RxJs flows, and thus i didnt want to make the code ugly   
by putting in between `tap(value => {console.log('Spy:', value);}` everywhere.   
As that would run in production as well, this checks if its running in debug mode.   
I gues maybe in some edge case you still like to use tap, but with this it can be a lot less.   

# You made it till here
Wow that's great, people actually reading my posts.. perhaps i should start a blog   
I wish you a good day, and i hope your angular problems get solved, have luck!
