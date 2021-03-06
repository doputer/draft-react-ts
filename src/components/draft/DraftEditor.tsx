import 'draft-js/dist/Draft.css';

import { DraftEditorCommand, Editor, EditorState, RichUtils } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { useEffect, useState } from 'react';

import { Toggles } from './interface';

export const DraftEditor = (): JSX.Element => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [blockButton, setBlockButton] = useState('');
  const [toggleButton, setToggleButton] = useState<Toggles>({
    BOLD: false,
    ITALIC: false,
    UNDERLINE: false,
    STRIKETHROUGH: false,
  });

  useEffect(() => {
    const inlineStyle = editorState.getCurrentInlineStyle();

    const BOLD = inlineStyle.has('BOLD');
    const ITALIC = inlineStyle.has('ITALIC');
    const UNDERLINE = inlineStyle.has('UNDERLINE');
    const STRIKETHROUGH = inlineStyle.has('STRIKETHROUGH');

    setToggleButton({ BOLD, ITALIC, UNDERLINE, STRIKETHROUGH });

    const currentSelection = editorState.getSelection();
    const currentKey = currentSelection.getStartKey();
    const currentBlock = editorState
      .getCurrentContent()
      .getBlockForKey(currentKey);

    setBlockButton(currentBlock.getType());
  }, [editorState]);

  useEffect(() => {
    const options = {
      blockStyleFn: (block: any) => {
        if (
          block.getType() === 'left' ||
          block.getType() === 'center' ||
          block.getType() === 'right'
        ) {
          return {
            style: {
              'text-align': block.getType(),
            },
          };
        }
      },
    };

    console.log(stateToHTML(editorState.getCurrentContent(), options));
  }, [editorState]);

  const handleKeyCommand = (command: DraftEditorCommand) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const handleTogggleClick = (e: React.MouseEvent, inlineStyle: string) => {
    e.preventDefault();
    if (inlineStyle === null) return;
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };

  const handleBlockClick = (e: React.MouseEvent, blockType: string) => {
    e.preventDefault();
    if (blockType === null) return;
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  const blockButtonOptions = [
    { name: 'heading-solid.svg', action: 'header-one' },
    { name: 'paragraph-solid.svg', action: 'unstyled' },
    { name: 'list-ol-solid.svg', action: 'ordered-list-item' },
    { name: 'list-ul-solid.svg', action: 'unordered-list-item' },
    { name: 'align-left-solid.svg', action: 'left' },
    { name: 'align-center-solid.svg', action: 'center' },
    { name: 'align-right-solid.svg', action: 'right' },

    { name: 'quote-right-solid.svg', action: 'blockquote' },
    { name: 'code-solid.svg', action: 'code-block' },
    // { name: 'atomic', action: 'atomic' },
  ];

  const toggleButtonOptions = [
    { name: 'bold-solid.svg', action: 'BOLD' },
    { name: 'italic-solid.svg', action: 'ITALIC' },
    { name: 'underline-solid.svg', action: 'UNDERLINE' },
    { name: 'strikethrough-solid.svg', action: 'STRIKETHROUGH' },
  ];

  const getBlockStyle = (block: any): string => {
    switch (block.getType()) {
      case 'left':
        return 'align-left';
      case 'center':
        return 'align-center';
      case 'right':
        return 'align-right';
      default:
        return 'unstyled';
    }
  };

  return (
    <div className="editor-container">
      <div className="editor-inner">
        <div className="toolbar-container">
          <div>
            {blockButtonOptions.map((buttonOption, index) => (
              <button
                className="toolbar-inner"
                onMouseDown={(e) => handleBlockClick(e, buttonOption.action)}
                key={index}
                style={
                  buttonOption.action === blockButton
                    ? {
                        backgroundColor: '#c1c1c1',
                      }
                    : {
                        backgroundColor: '#fff',
                      }
                }
              >
                <img src={`/assets/icons/${buttonOption.name}`} alt="" />
              </button>
            ))}
            {toggleButtonOptions.map((buttonOption, index) => (
              <button
                className="toolbar-inner"
                onMouseDown={(e) => handleTogggleClick(e, buttonOption.action)}
                key={index}
                style={
                  toggleButton[buttonOption.action] === true
                    ? {
                        backgroundColor: '#c1c1c1',
                      }
                    : {
                        backgroundColor: '#fff',
                      }
                }
              >
                <img src={`/assets/icons/${buttonOption.name}`} alt="" />
              </button>
            ))}
          </div>
        </div>
        <div className="content-container">
          <Editor
            editorState={editorState}
            onChange={setEditorState}
            handleKeyCommand={handleKeyCommand}
            blockStyleFn={getBlockStyle}
          />
        </div>
      </div>
    </div>
  );
};
