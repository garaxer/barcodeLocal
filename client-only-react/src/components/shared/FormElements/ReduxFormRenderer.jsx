import React from 'react';
import { Field } from 'redux-form';
import { renderTextField, renderCheckbox } from './ReduxFormComponents';

export const renderFields = (fields) => {
  const getFieldType = {
    text: renderTextField,
    checkbox: renderCheckbox,
  };

  return fields.map(({ name, label, component, type }) => (
    <div key={name}>
      <Field
        name={name}
        component={getFieldType[component] || renderTextField}
        label={label}
        type={type || ''}
      />
    </div>
  ));
};
