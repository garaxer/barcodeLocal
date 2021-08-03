import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addBarcodes } from '../../actions';
import { makeStyles } from '@material-ui/core/styles';
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Typography,
  TextField,
  InputLabel,
  FormControl,
  MenuItem,
  Select,
  Container,
  Button,
  Paper,
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

import { getFiles } from '../../actions/barcodes.js';
import MakeBarcodes from './MakeBarcodes';

import userStyle from '../useStyle';
const useStyles = makeStyles(userStyle);

const Generate = ({ token, id }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [planType, setPlanType] = useState('AP');
  const [planCount, setPlanCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [barcodeType, setBarcodeType] = useState('PNG');
  const [plans, setPlans] = useState(null); // if plans: MakeBarcodes will render

  const handleChangePlanCount = (event) => {
    const newCount = event.target.value > 10 ? 10 : event.target.value;
    setPlanCount(newCount);
  };

  const dispatchFormResponse = ({ type, payload }) => {
    switch (type) {
      case 'GENERATE_RESPONSE':
        const newPayload = payload.map((x) => {
          const bprefix = x.slice(0, 2);
          const bnumber = x.slice(2);
          return { bprefix, bnumber, creator: id, createdAt: new Date() };
        });

        dispatch(addBarcodes(newPayload));
        setError('');
        break;
      case 'GENERATE_ERROR':
        console.log(payload);
        setError(`${payload || 'Network Error.'}`);
        break;
      default: {
        setLoading(false);
        alert('Unknown error occured. Unknown action called');
      }
    }
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const handleGenerateClick = (e) => {
    e.preventDefault();

    setLoading(true);
    getFiles(
      { planCount, planType },
      barcodeType,
      token,
      setPlans
    )(dispatchFormResponse);
  };

  return (
    <Container className={`${classes.loginForm}`} maxWidth="sm">
      <Paper elevation={3} className={classes.loginSmallForm}>
        <form noValidate autoComplete="off" onSubmit={handleGenerateClick}>
          <Typography variant="h4" gutterBottom>
            Get Latest Barcodes
          </Typography>

          <FormControl className={classes.field}>
            <InputLabel id="plan-type-label">Plan Type</InputLabel>
            <Select
              className={classes.field}
              labelId="plan-type"
              id="plan-type"
              value={planType}
              onChange={(e) => setPlanType(e.target.value)}
            >
              <MenuItem value="AP">AP</MenuItem>
              <MenuItem value="SP">SP</MenuItem>
            </Select>
          </FormControl>

          <div className={classes.field}>
            <TextField
              id="barcode-no"
              label="Barcode Count. (Max 10)"
              type="number"
              InputProps={{ inputProps: { min: 0, max: 10 } }}
              className={classes.field}
              value={planCount}
              onChange={handleChangePlanCount}
            />
          </div>

          <FormControl component="fieldset" className={classes.field}>
            <FormLabel component="legend">Barcode Type</FormLabel>
            <RadioGroup
              row
              aria-label="position"
              name="position"
              defaultValue="PNG"
            >
              <FormControlLabel
                onChange={(e) => setBarcodeType(e.target.value)}
                value="BOTH"
                control={<Radio color="primary" />}
                label="BOTH"
              />
              <FormControlLabel
                onChange={(e) => setBarcodeType(e.target.value)}
                value="PDF"
                control={<Radio />}
                label="PDF"
              />
              <FormControlLabel
                onChange={(e) => setBarcodeType(e.target.value)}
                value="PNG"
                control={<Radio />}
                label="PNG"
              />
            </RadioGroup>
          </FormControl>
          <div>
            <Button
              disabled={loading}
              onClick={handleGenerateClick}
              variant="contained"
              color="secondary"
            >
              {loading
                ? 'Generating...'
                : planCount > 1
                ? 'Generate (zip)'
                : 'Generate'}
            </Button>
          </div>
          {error && (
            <MuiAlert
              className={classes.alert}
              elevation={6}
              variant="filled"
              severity="error"
            >
              {error}
            </MuiAlert>
          )}
        </form>
      </Paper>
      <MakeBarcodes values={plans} />
    </Container>
  );
};

export default Generate;
