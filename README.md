# Betaflight 4.3 Safe Migrator Assistant

<div align="center">
  
![](https://media.giphy.com/media/UZNd6HH4PF4p8SQV5L/giphy.gif)
  
![](https://media.giphy.com/media/Pqo9CtZDvNokhOFROY/giphy.gif)
  
  This tool can be reached at the address: <br />
### https://bf43-safe-migration.robertodedomenico.it/
  <br />
  
<br />Betaflight 4.3 introduces tons of improvements, including great improvements on pid tuning, filtering and new sliders.

So therefore, the "diff all" command may produce unsafe values. Given the many improvements and changes, in this video by <b>Chris Rosser</b> (thank you for the great work and for your very interesting videos)

[![Watch the video](https://img.youtube.com/vi/0s4iJ5Vc-48/hqdefault.jpg)](https://youtu.be/0s4iJ5Vc-48)

He advises (rightly) to make a selection of what is safe and what is insecure (or to be checked).

This tool was created precisely starting from his indications, it must be understood as a migration assistant to Betaflight 4.3.

Just copy your result of "diff all" from a Betaflight <4.3 quad, and paste into the tool.
The tool analyze any command (the lists of safe and unsafe value are customizable using the options below) and produce as result a filtered version of your backup, simply by adding or commenting on each line that contains unsafe values.

I used Svelte, that is a great tool for rapid developing and prototyping.

                                        
[![Watch the video](https://img.youtube.com/vi/8SyJQU778No/hqdefault.jpg)](https://youtu.be/8SyJQU778No)
<br />Thank you to Chris for sharing my project in your Youtube Channel
                                                       

## Building and running from source

```bash
cd betaflight43-safe-migration
npm install && npm run dev
```

Navigate to [localhost:5000](http://localhost:5000). You should see your app running. 

### DISCLAIMER: with the use of this tool everyone is required to MANUALLY verify the produced result. Given the variety of quads and flight controllers it's possible that the results produced are not 100% perfect. This tool gives an indication, and is to be considered as a work in progress. The creators DO NOT assume any responsibility for any malfunction, product damage or problem that may occur after its use.
</div>
