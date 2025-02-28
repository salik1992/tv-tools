# TV Tools
This repository contains the code for the tools to simplify development of applications
that are targeted for televisions, set-top-boxes and other devices being controlled
primarily by directional navigation.

> [!CAUTION]
> This package is currently under active development and not yet ready for production

## Which UI library does it use?
This is the most important question for you if you are considering using this library.
The core is written in VanillaTS as no matter what UI rendering library you use,
the UX should be the same, the lists should scroll the same, the focus should move
the same direction, etc.

The other part is then a slim layer connecting the core to the rendering library.
Currently supported library is **React**, but it should be able to work with
other popular ones like **Vue.js** or **SolidJS** or even **VanillaJS**.

## Do I need to use the whole package or can I pick parts?
There is a dependency in the structure. So if you want to use certain part, you
will need to use also parts that it depends on.

So for example if you want to use the focus management, you will also need
to use control and handle that in your device manager. Or you may also pick
a device manager and not care about control.

If you want to use for example List, then you will need to use also focus and control.

## Implemented Features

### Control
Basically management of keyCodes and codes from remote control into a logical keys.
It supports binding more codes to a single logical key. So for example you can bind
left arrow on keyboard, left on D-Pad of controller and left stick movement on controller
to a single LEFT logical key that is then used within the app.

Control also handles switching LEFT/RIGHT movements for LTR/RTL app orientation.

### Focus
Focus management using predefined movements in code without any spatial calculations.
The spatial focus management is on the roadmap but at smaller priority.

### List
UI Component for rendering List (vertical or horizontal) that are optimized for
performance, using a render window and special implementation for animated vs basic
behavior.
 
## Roadmap (more or less in priority order)
- Grid - UI component for displaying data in grids
- Device - Unified device management across platforms
- Input management using native keyboards
- TableFocus - defining focus where it can be think of as table
- Virtual Keyboard
- More List and Grid behaviors - list/grid behavior decides when focus moves vs 
  when the list/grid scrolls
- Looping for List
- Automated movement for List
- Dynamically changing number of data elements in List/Grid
- EPG - electronic program guide
