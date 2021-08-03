import React from 'react';
import { reduxForm } from 'redux-form';
import { makeStyles } from '@material-ui/core/styles';
import userStyle from '../useStyle';
import { renderSubmitAndReset } from '../shared/FormElements/ReduxFormComponents';
import { renderFields } from '../shared/FormElements/ReduxFormRenderer';

const useStyles = makeStyles(userStyle);

const exists = (x) => !(x ?? false) && 'Required';
const isEmail = (email) =>
  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email) &&
  'Invalid email address';
const greaterThanN = (n) => (password) =>
  !(password.length > n) && 'Password must be at least 8 characters';
const groupValidators = (farray) => (value) =>
  farray.reduce((a, c) => a || c(value), false);

const validationSchema = [
  {
    field: 'name',
    message: exists,
  },
  {
    field: 'email',
    message: groupValidators([exists, isEmail]),
  },
  {
    field: 'password',
    message: groupValidators([exists, greaterThanN(7)]),
  },
];

const validate = (schema) => (data) => {
  const validator = (a, { field, message }) => {
    const validMessage = message(data[field]);
    return validMessage ? { ...a, [field]: validMessage } : a;
  };

  const errors = schema.reduce(validator, {});

  return errors;
};

const UserForm = (props) => {
  const classes = useStyles();
  const {
    handleSubmit,
    pristine,
    reset,
    submitting,
    formFields,
    invalid,
  } = props;

  return (
    <form onSubmit={handleSubmit} className={classes.form}>
      {renderFields(formFields)}
      {renderSubmitAndReset({ pristine, reset, submitting, invalid })}
    </form>
  );
};

// Need to figure out a way to pass the validation schema in.
export const editForm = reduxForm({
  form: 'UserForm',
  validate: validate(
    validationSchema.filter(({ field }) =>
      ['name', 'email'].map((x) => x.name).includes(field)
    )
  ),
})(UserForm);

export const passwordForm = reduxForm({
  form: 'UserForm',
  validate: validate(
    validationSchema.filter(({ field }) =>
      ['password'].map((x) => x.name).includes(field)
    )
  ),
})(UserForm);

export default reduxForm({
  form: 'UserForm',
  validate: validate(validationSchema),
})(UserForm);

/**
const UserForm = ({ formFields, initialValues, onSubmit }) => {
  //Wrapping it in this component to create a custom validator.

  const RenderForm = (props) => {
    const classes = useStyles();
    const { handleSubmit, pristine, reset, submitting, formFields } = props;
    return (
      <form onSubmit={handleSubmit} className={classes.form}>
        {renderFields(formFields)}
        {renderSubmitAndReset({ pristine, reset, submitting })}
      </form>
    );
  };

  const Form = reduxForm({
    form: 'RenderForm',
    //Should validationSchema this in instead of computing each time. // Also consider per field validation.
    validate: validate(
      validationSchema.filter(({ field }) =>
        formFields.map((x) => x.name).includes(field)
      )
    ),
  })(RenderForm);

  return (
    <Form
      formFields={formFields}
      initialValues={initialValues}
      onSubmit={onSubmit}
    />
  );
};

export default UserForm;
 */
