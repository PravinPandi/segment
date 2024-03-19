import React, { useState } from 'react';
import axios from 'axios';
import {
  Button,
  Modal,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from '@mui/material';

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [segmentName, setSegmentName] = useState('');
  const [selectedSchema, setSelectedSchema] = useState('');
  const [schemas, setSchemas] = useState([]);
  const [error, setError] = useState('');

  const schemaOptions = [
    { label: 'First Name', value: 'first_name' },
    { label: 'Last Name', value: 'last_name' },
    { label: 'Gender', value: 'gender' },
    { label: 'Age', value: 'age' },
    { label: 'Account Name', value: 'account_name' },
    { label: 'City', value: 'city' },
    { label: 'State', value: 'state' },
  ];

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const handleSegmentNameChange = (e) => setSegmentName(e.target.value);
  const handleSchemaChange = (e) => setSelectedSchema(e.target.value);

  const handleAddSchema = () => {
    if (selectedSchema) {
      setSchemas((prevSchemas) => [...prevSchemas, selectedSchema]);
      setSelectedSchema('');
    }
  };

  const handleSchemaListChange = (e, index) => {
    setSchemas(
      schemas.map((schema, i) => (i === index ? e.target.value : schema))
    );
  };

  const handleRemoveSchema = (index) => {
    setSchemas(schemas.filter((_, i) => i !== index));
  };

  const handleSaveSegment = () => {
    if (!segmentName) {
      setError('Segment name is required');
      return;
    }

    if (schemas.length === 0) {
      setError('At least one schema is required');
      return;
    }

    const data = {
      segment_name: segmentName,
      schema: schemas.map((schema) => ({ [schema]: schema })),
    };
    axios.post(
      'https://webhook.site/4744834e-a467-4c6b-86ee-b4b561349356',
      data,
      {
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    handleClose();
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Save segment
      </Button>
      <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Save Segment</DialogTitle>
        <DialogContent>
          <Box marginBottom={2}>
            <TextField
              fullWidth
              label="Segment Name"
              value={segmentName}
              onChange={handleSegmentNameChange}
            />
          </Box>

          {schemas.map((schema, index) => (
            <Box
              key={index}
              marginBottom={2}
              display="flex"
              alignItems="center"
            >
              <FormControl fullWidth>
                <InputLabel>{schema}</InputLabel>
                <Select
                  value={schema}
                  onChange={(e) => handleSchemaListChange(e, index)}
                  inputProps={{
                    readOnly: true,
                  }}
                >
                  {schemaOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box marginLeft={2}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleRemoveSchema(index)}
                >
                  Remove
                </Button>
              </Box>
            </Box>
          ))}

          <Box marginBottom={2}>
            <FormControl fullWidth>
              <InputLabel>Add schema to segment</InputLabel>
              <Select value={selectedSchema} onChange={handleSchemaChange}>
                {schemaOptions
                  .filter((option) => !schemas.includes(option.value))
                  .map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>

          <Box marginBottom={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddSchema}
            >
              +Add new schema
            </Button>
          </Box>

          {error && (
            <Box color="red" marginTop={2}>
              {error}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveSegment}
          >
            Save the segment
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default App;
