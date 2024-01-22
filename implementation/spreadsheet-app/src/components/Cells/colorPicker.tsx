import { useState, useRef, FC } from 'react';
import { ChromePicker, ColorResult } from 'react-color';
import TextField from "@mui/material/TextField";


interface ColorPickerProps {
  onCellColorChange: (color: { color: string }, cell: string) => void;
  onTextColorChange: (color: { color: string }, cell: string) => void;
}

const ColorPicker: FC<ColorPickerProps> = ({ onCellColorChange, onTextColorChange }) => {
  const [color, setColor] = useState<string>("#fff");
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [showAdditionalButton, setShowAdditionalButton] = useState<boolean>(false);

  const handleColorPickerToggle = () => {
    setShowColorPicker(prevState => !prevState);
    setShowAdditionalButton(prevState => !prevState);
  };

  const valueRef = useRef<HTMLInputElement>(null);

  // Sends the color and specific cell from the color picker to update in spreadsheet component
  const handleCellChangeButtonClick = () => {
    if (valueRef.current) {
      onCellColorChange({ color }, valueRef.current.value);
    }
  };

  const handleTextChangeButtonClick = () => {
    if (valueRef.current) {
      onTextColorChange({ color }, valueRef.current.value);
    }
  };

  return (
    <div>
      <button onClick={handleColorPickerToggle}>
        {showColorPicker ? 'Close color picker' : 'Pick a color'}
      </button>

      {showColorPicker && (
        <ChromePicker
          color={color}
          onChange={(updatedColor: ColorResult) => setColor(updatedColor.hex)}
        />
      )}

      {showAdditionalButton && (
        <div>
          <br />
          <TextField 
            id='outlined-textarea'
            label='Enter Cell to Change'
            variant='outlined'
            inputRef={valueRef}
            sx={{
              input: {
                color: "white"
              },
            }}
          />
          <div>
            <button onClick={handleTextChangeButtonClick}>
              Update Text Color
            </button>
            <button onClick={handleCellChangeButtonClick}>
              Update Cell Color
            </button>
          </div>
          <h6>Hex: {color} </h6>
        </div>
      )}
    </div>
    
  );
}

export default ColorPicker;
