declare enum ItemType {
    ACTION = "ACTION",
    TEXT = "TEXT",
    MISC = "MISC",
    INSTRUCTIONS = "INSTRUCTIONS",
    SEPARATOR = "SEPARATOR"
}
interface ItemBase {
    act: string;
    scene: string;
    rawLine: string;
}
interface ItemAction extends ItemBase {
    type: ItemType.ACTION;
    action: string;
}
interface ItemText extends ItemBase {
    type: ItemType.TEXT;
    text: string;
    instruction: string;
    speaker: string;
}
interface ItemMisc extends ItemBase {
    type: ItemType.MISC;
    content: string;
}
interface ItemInstructions extends ItemBase {
    type: ItemType.INSTRUCTIONS;
    instruction: string;
}
interface ItemSeparator extends ItemBase {
    type: ItemType.SEPARATOR;
}
type Item = ItemAction | ItemText | ItemMisc | ItemInstructions | ItemSeparator;
interface Scene {
    act: string;
    scene: string;
    items: Array<Item>;
    text: string;
}
interface Act {
    act: string;
    scenes: Array<Scene>;
}
declare enum ScreenplayLineType {
    ACTION = "ACTION",
    TEXT = "TEXT",
    PERSON = "PERSON",
    PERSON_INSTRUCTION = "PERSON_INSTRUCTION",
    INSTRUCTION = "INSTRUCTION"
}
interface ParserOptions {
    indent: {
        [ScreenplayLineType.ACTION]: Array<number>;
        [ScreenplayLineType.TEXT]: Array<number>;
        [ScreenplayLineType.PERSON]: Array<number>;
        [ScreenplayLineType.PERSON_INSTRUCTION]: Array<number>;
        [ScreenplayLineType.INSTRUCTION]: Array<number>;
    };
}

declare class ScreenplayParser {
    private screenplay;
    private parserOptions;
    private leftAlignmentWhitespaces;
    private indent;
    private items;
    constructor(screenplay: string, parserOptions?: Partial<ParserOptions>);
    private inRange;
    private parseItems;
    getItems: () => Array<Item>;
    getScenes: (items?: Array<Item>) => Array<Scene>;
    getActs: () => Array<Act>;
    private joinItemsTexts;
}

export { ScreenplayParser as default };
