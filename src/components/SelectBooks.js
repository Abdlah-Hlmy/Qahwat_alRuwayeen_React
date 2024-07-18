import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function SelectBooks({ setSortOrder }) {
  const [value, setValue] = React.useState('');

  const handleChange = (event) => {
    const sortOrder = event.target.value;
    setValue(sortOrder);
    setSortOrder(sortOrder);
  };

  return (
    <Box sx={{ minWidth: 130 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">الملائمة</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          label="الملائمة"
          onChange={handleChange}
          sx={{backgroundColor: 'white', height: 52}}
        >
          <MenuItem value="LastFirst">الأقدم أولاً</MenuItem>
          <MenuItem value="FirstLast">الأحدث أولاً</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
