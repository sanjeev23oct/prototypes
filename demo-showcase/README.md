# Interactive Demo Mode - Live Example

A self-demonstrating e-commerce checkout form built with pure JavaScript. No external dependencies required!

## 🎬 Live Demo

**[Try it here!](https://sanjeev23oct.github.io/prototypes/demo-showcase/)**

## Features

- ✅ **Auto-play demo mode** - Watch the form fill itself
- ✅ **Play/Pause/Stop controls** - Full control over the demo
- ✅ **User override detection** - Click any field to take manual control
- ✅ **Resume capability** - Continue from where you left off
- ✅ **Progress tracking** - Visual progress bar and counter
- ✅ **Toast notifications** - Clear feedback at each step
- ✅ **Pure JavaScript** - No external dependencies
- ✅ **Responsive design** - Works on all devices

## How It Works

1. Click **"Play Demo"** to start the automated demonstration
2. Click **"Pause"** to stop the automation
3. Click any form field to take manual control (auto-pauses)
4. Click **"Resume"** to continue from where you left off
5. Click **"Stop"** to reset everything

## Technical Approach

### Action-Based Architecture

The demo is defined as a sequence of declarative actions:

```javascript
{ type: 'typeText', selector: '#email', text: 'user@example.com', delay: 50 }
{ type: 'selectOption', selector: '#country', value: 'usa', delay: 200 }
{ type: 'checkBox', selector: '#terms', delay: 200 }
{ type: 'click', selector: '#submitBtn', delay: 300 }
```

### State Management

Maintains state for play/pause/resume functionality:

```javascript
state: {
    isPlaying: false,
    isPaused: false,
    currentAction: 0,
    timeouts: [],
    userOverride: false
}
```

### Character-by-Character Typing

Simulates realistic user typing with configurable speed and proper event dispatching.

## Files

- `index.html` - Main HTML structure
- `styles.css` - Complete styling (no frameworks)
- `demo-engine.js` - Core demo automation engine
- `app.js` - Form navigation and submission logic

## Use Cases

Perfect for:
- Sales presentations
- Stakeholder demos
- User onboarding tutorials
- Conference presentations
- Internal training
- Complex workflow demonstrations

## Related Article

Read the full article: **[From Prototype to Production: Building Self-Demonstrating Web Apps](https://medium.com/@sanjeevgulati)**

Part of the rapid prototyping series:
- [Using Kiro for Rapid Prototyping](https://medium.com/ai-in-plain-english/using-kiro-for-rapid-prototyping-spec-driven-development-with-ai-9cfb5c080252?sk=c3d62e32328d8e8ed71bc954af026ad0)

## License

MIT License - Feel free to use in your own projects!
