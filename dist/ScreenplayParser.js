// src/types.ts
var ScreenplayLineType = /* @__PURE__ */ ((ScreenplayLineType2) => {
  ScreenplayLineType2["ACTION"] = "ACTION";
  ScreenplayLineType2["TEXT"] = "TEXT";
  ScreenplayLineType2["PERSON"] = "PERSON";
  ScreenplayLineType2["PERSON_INSTRUCTION"] = "PERSON_INSTRUCTION";
  ScreenplayLineType2["INSTRUCTION"] = "INSTRUCTION";
  return ScreenplayLineType2;
})(ScreenplayLineType || {});

// src/ScreenplayParser.ts
var ScreenplayParser = class {
  constructor(screenplay, parserOptions = {}) {
    this.parserOptions = {
      indent: {
        ["ACTION" /* ACTION */]: [0, 0],
        ["TEXT" /* TEXT */]: [10, 10],
        ["PERSON" /* PERSON */]: [25, 30],
        ["PERSON_INSTRUCTION" /* PERSON_INSTRUCTION */]: [15, 20],
        ["INSTRUCTION" /* INSTRUCTION */]: [31, Infinity]
      }
    };
    this.items = [];
    this.inRange = (value, range) => range.length > 2 ? false : value >= range[0] && value <= range[1];
    this.parseItems = () => {
      const lines = this.screenplay.split("\n");
      let currentAct = "ACT ZERO";
      let currentScene = "INTRO";
      const items = [];
      for (const line of lines) {
        const trimmedLine = line.trim();
        const leadingWhitespaces = line.search(/\S/);
        if (leadingWhitespaces === -1) {
          items.push({
            type: "SEPARATOR" /* SEPARATOR */,
            act: currentAct,
            scene: currentScene,
            rawLine: line
          });
        } else if (trimmedLine.startsWith("ACT ")) {
          currentAct = trimmedLine;
        } else if (trimmedLine.match(/^(EXT\.|INT\.)/)) {
          currentScene = trimmedLine;
        } else if (this.inRange(leadingWhitespaces, this.indent["ACTION" /* ACTION */])) {
          items.push({
            type: "ACTION" /* ACTION */,
            action: trimmedLine,
            act: currentAct,
            scene: currentScene,
            rawLine: line
          });
        } else if (this.inRange(leadingWhitespaces, this.indent["TEXT" /* TEXT */])) {
          const lastItemIndex = items.length - 1;
          if (items[lastItemIndex] && items[lastItemIndex].type === "TEXT" /* TEXT */) {
            items[lastItemIndex].text = [trimmedLine, items[lastItemIndex].text].filter(Boolean).join(" ");
            items[lastItemIndex].rawLine += "\n" + line;
          } else {
            console.log("Text line without a speaker", items[lastItemIndex]);
          }
        } else if (this.inRange(
          leadingWhitespaces,
          this.indent["PERSON_INSTRUCTION" /* PERSON_INSTRUCTION */]
        )) {
          const lastItemIndex = items.length - 1;
          if (items[lastItemIndex] && items[lastItemIndex].type === "TEXT" /* TEXT */) {
            items[lastItemIndex].instruction += " " + trimmedLine;
            items[lastItemIndex].rawLine += "\n" + line;
          } else {
            items.push({
              type: "INSTRUCTIONS" /* INSTRUCTIONS */,
              instruction: trimmedLine,
              act: currentAct,
              scene: currentScene,
              rawLine: line
            });
          }
        } else if (this.inRange(leadingWhitespaces, this.indent["PERSON" /* PERSON */])) {
          items.push({
            type: "TEXT" /* TEXT */,
            speaker: trimmedLine,
            text: "",
            instruction: "",
            act: currentAct,
            scene: currentScene,
            rawLine: line
          });
        } else if (this.inRange(
          leadingWhitespaces,
          this.indent["INSTRUCTION" /* INSTRUCTION */]
        )) {
          items.push({
            type: "INSTRUCTIONS" /* INSTRUCTIONS */,
            instruction: trimmedLine,
            act: currentAct,
            scene: currentScene,
            rawLine: line
          });
        } else {
          items.push({
            type: "MISC" /* MISC */,
            content: trimmedLine,
            act: currentAct,
            scene: currentScene,
            rawLine: line
          });
        }
      }
      const joinedResults = [];
      for (const item of items) {
        const prevItem = joinedResults[joinedResults.length - 1];
        if (prevItem && prevItem.type === item.type && prevItem.act === item.act && prevItem.scene === item.scene) {
          if (item.type === "ACTION" /* ACTION */ && prevItem.type === "ACTION" /* ACTION */) {
            prevItem.action += " " + item.action;
            prevItem.rawLine += "\n" + item.rawLine;
          } else if (item.type === "MISC" /* MISC */ && prevItem.type === "MISC" /* MISC */) {
            prevItem.content += " " + item.content;
            prevItem.rawLine += "\n" + item.rawLine;
          } else if (item.type === "INSTRUCTIONS" /* INSTRUCTIONS */ && prevItem.type === "INSTRUCTIONS" /* INSTRUCTIONS */) {
            prevItem.instruction += " " + item.instruction;
            prevItem.rawLine += "\n" + item.rawLine;
          }
        } else {
          joinedResults.push(item);
        }
      }
      this.items = joinedResults;
    };
    this.getItems = () => this.items;
    this.getScenes = (items = this.items) => {
      const scenes = [];
      for (const item of items) {
        const lastSceneIndex = scenes.length - 1;
        if (scenes[lastSceneIndex] && scenes[lastSceneIndex].scene === item.scene) {
          scenes[lastSceneIndex].items.push(item);
        } else {
          scenes.push({
            act: item.act,
            scene: item.scene,
            items: [item]
          });
        }
      }
      return scenes.map((scene) => ({
        ...scene,
        text: this.joinItemsTexts(scene.items)
      }));
    };
    this.getActs = () => {
      const acts = [];
      for (const item of this.items) {
        const lastActIndex = acts.length - 1;
        if (acts[lastActIndex] && acts[lastActIndex].act === item.act) {
          acts[lastActIndex].items.push(item);
        } else {
          acts.push({
            act: item.act,
            items: [item]
          });
        }
      }
      return acts.map((act) => ({
        act: act.act,
        scenes: this.getScenes(act.items)
      }));
    };
    this.joinItemsTexts = (items) => items.map((item) => {
      if (item.type === "ACTION" /* ACTION */) {
        return item.action;
      }
      if (item.type === "TEXT" /* TEXT */) {
        return [
          item.speaker + ":",
          item.instruction ? `(${item.instruction})` : "",
          `"${item.text}"`
        ].filter(Boolean).join(" ");
      }
      if (item.type === "INSTRUCTIONS" /* INSTRUCTIONS */) {
        return item.instruction;
      }
      if (item.type === "MISC" /* MISC */) {
        return item.content;
      }
      return "";
    }).filter(Boolean).join("\n\n");
    if (!screenplay) {
      throw new Error("Screenplay is empty");
    }
    this.screenplay = screenplay;
    const indent = {
      ...this.parserOptions.indent,
      ...parserOptions?.indent || {}
    };
    this.parserOptions = {
      ...this.parserOptions,
      ...parserOptions,
      indent
    };
    this.leftAlignmentWhitespaces = screenplay.split("\n").reduce((acc, line) => {
      const leadingWhitespaces = line.search(/\S/);
      if (leadingWhitespaces === -1 || leadingWhitespaces >= acc) return acc;
      return leadingWhitespaces;
    }, 1e3);
    this.indent = Object.values(ScreenplayLineType).reduce(
      (acc, type) => ({
        ...acc,
        [type]: indent[type].map(
          (insert) => insert + this.leftAlignmentWhitespaces
        )
      }),
      {}
    );
    this.parseItems();
  }
};
var ScreenplayParser_default = ScreenplayParser;
export {
  ScreenplayParser_default as default
};
