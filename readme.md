# Screenplay Parser

A fully typed JavaScript library to parse `Hollywood standard format` screenplays.

## Installation

```bash
npm i @nico-martin/screenplay-parser
```

## Usage

Let's take this screenplay as an example.
1. Acts are defined by `ACT` followed by a roman numeral.
2. Scenes are defined by `INT` or `EXT` followed by a location.
3. Actions are defined by a block of text, aligned to the left.
4. Speakers are defined by the name, which has between 25-30 spaces to the left
5. Text passages are defined by a text block that has 10 spaces to the left

```text
                              ACT ONE

     FADE IN

     INT. DRESSING ROOM - NIGHT - CLOSE ON PAUL BLOCK

     Another smiling face, this one belonging to Paul Block, the
     manager of the group.  He's holding up a record industry 
     trade mag.

                               PAUL
               Number twelve with a bullet!  We're 
               going gold, folks...it's only a matter
               of time!

     As a roar of approval goes up, pull back to reveal a 
     post-concert party underway.  Champagne, sumptuous food,
     beautiful people.  Paul holds up a glass of champagne.

                               PAUL
               Here's to Class Action -- the band,
               Stevie March and Greg Noble!

```

If we want to parse this, we can do the following:

```typescript
import ScreenplayParser from 'screenplay-parser';

const screenplayParser = new ScreenplayParser('{screenplay}');

// get an array of all the items
const items = screenplayParser.getItems();

// get an array of all the scenes
const scenes = screenplayParser.getScenes();

// get an array of all the acts
const acts = screenplayParser.getActs();
```

First of all it parses the screenplay into `Items`. Those can be of type `ACTION`, `TEXT`, `INSTRUCTIONS`, `MISC` or `SEPARATOR`. Each type has a different structure, but all of them are part on an `act` and a `scene`.

We can then group the items into `Scenes` and `Acts`.

That's all. Happy parsing!