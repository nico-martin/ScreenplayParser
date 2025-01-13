# Screenplay Parser

A fully typed JavaScript library to parse screenplays.

```typescript
import { ScreenplayParser } from 'screenplay-parser';

const screenplayParser = new ScreenplayParser('my screenplay');

// get an array of all the scenes
const scenes = screenplayParser.getScenes();

// get an array of all the acts
const acts = screenplayParser.getActs();
```