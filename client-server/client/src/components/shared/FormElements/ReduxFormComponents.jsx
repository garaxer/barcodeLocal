// UserField contains logic to render a single
// label and text input for use in redux forms
import React from 'react';
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
} from '@material-ui/core';

export const renderTextField = ({
  label,
  input,
  meta: { touched, invalid, error },
  ...custom
}) => (
  <TextField
    label={label}
    placeholder={label}
    error={touched && invalid}
    helperText={touched && error}
    {...input}
    {...custom}
  />
);

export const renderCheckbox = ({ input, label }) => (
  <div>
    <FormControlLabel
      control={<Checkbox checked={!!input.value} onChange={input.onChange} />}
      label={label}
    />
  </div>
);

export const renderSubmitAndReset = ({
  pristine,
  reset,
  submitting,
  invalid,
}) => (
  <div>
    <Button
      type="submit"
      variant="contained"
      color="secondary"
      disabled={pristine || submitting || invalid}
    >
      Submit
    </Button>
    {reset && (
      <Button disabled={pristine || submitting} onClick={reset}>
        Reset Values
      </Button>
    )}
  </div>
);

export default ({ input, label, meta: { error, touched } }) => {
  return (
    <div>
      <label>{label}</label>
      <input {...input} style={{ marginBottom: '5px' }} />
      <div className="red-text" style={{ marginBottom: '20px' }}>
        {touched && error}
      </div>
    </div>
  );
};
