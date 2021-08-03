import {
  Typography,
  TextField,
  InputLabel,
  FormControl,
  MenuItem,
  Select,
  Container,
  Button,
  Paper,
} from "@material-ui/core";
import { useTheme, Theme, makeStyles } from "@material-ui/core/styles";
import { useState } from "react";

import styled from "styled-components";
import DefaultStyle from "./useStyle";
import { BarcodeForm } from "./Types";
import { useFormErrors } from "./useFormErrors";
import MakeBarcodes from "./MakeBarcode";

const StyledContainer = styled(Container)`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
`;
const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const StyledPaper = styled(Paper)<{
  theme: Theme;
}>`
  margin-top: ${({ theme }) => theme.spacing(4)}px;
  padding: ${({ theme }) => theme.spacing(2)}px;
  min-width: 300px;
  '& .MuiTextField-root': {
    margin-bottom: ${({ theme }) => theme.spacing(2)}px;
  },
`;
type responseType = {
  error?: string;
  message?: string;
};
const url = "http://localhost:5000";
const sendBarcode = async (
  data: BarcodeForm,
  callBack: (d: responseType) => void
) => {
  try {
    const response = await fetch(url, {
      method: "PUT", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
        pragma: "no-cache",
        "cache-control": "no-cache",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    const responseData: responseType = await response.json(); // parses JSON response into native JavaScript objects

    if (responseData?.error) {
      // show an error on the page
      callBack(responseData);
    }
    callBack(responseData);
  } catch (error) {
    console.log(error);
    console.log(error.message);
    if (error.message === "Failed to fetch") {
      callBack({ error: "Network Error: Server Unreachable" });
    }
    callBack({ error: "Unknown Server Error" });
  }
};

/*
Actually download the barcode(s)
work on typescript only (no react) version
*/
const useStyles = makeStyles(DefaultStyle);

const BarcodeHome = () => {
  const classes = useStyles();
  const theme = useTheme();

  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<string[]>([]);
  const { checkForError, checkForErrors, errors } = useFormErrors<BarcodeForm>({
    validations: {
      email: {
        pattern: {
          value:
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          message: "Please enter a valid email.",
        },
      },
      planType: {
        custom: {
          isValid: (value: string) => value.length > 1,
          message: "Needs to be at least 2 characters long.",
        },
      },
      planStart: {
        required: {
          value: true,
          message: "Plan Start requirerd",
        },
      },
      planCount: {
        required: {
          value: true,
          message: "Plan Count requirerd",
        },
      },
    },
  });
  console.log(errors);
  const initialValues: BarcodeForm = {
    planType: "AP",
    planStart: 1,
    planCount: 1,
    email: "",
  };
  const [data, setData] = useState<BarcodeForm>(initialValues);

  const handleChange = (key: keyof BarcodeForm, value: string) => {
    console.log(key, value);
    let checkValue = ["planStart", "planCount"].includes(key)
      ? parseInt(value)
      : value;
    setData({
      ...data,
      [key]: checkValue,
    });
    checkForError(key, value); // Optional if you always want to check.
  };

  const handleGenerateClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkForErrors(data)) {
      return;
    }
    sendBarcode(data, console.log);
    console.log(data);
    const newPlans = Array.from(Array(data.planCount).keys()).map(
      (_, n) => `${data.planType}${n + data.planStart}`
    );
    console.log(newPlans);
    setPlans(newPlans);
  };

  const santizeNumbers = (v: number, min: number, max: number) =>
    v > max ? max : v < min ? min : v;

  const checkPristine = () => data === initialValues;

  type BlurRecord<T> = Partial<Record<keyof T, boolean>>;
  const [blurs, setBlurs] = useState<BlurRecord<BarcodeForm>>({});

  return (
    <StyledContainer maxWidth="sm">
      <StyledPaper theme={theme} elevation={3}>
        <StyledForm
          noValidate
          autoComplete="off"
          onSubmit={handleGenerateClick}
        >
          <Typography variant="h4" gutterBottom>
            Get Latest Barcodes
          </Typography>
          <TextField
            id="barcode-email"
            label="Email"
            name="email"
            className={classes.field}
            value={data.email}
            onBlur={() => setBlurs({ ...blurs, email: true })}
            onChange={(e) => handleChange("email", `${e.target.value}`)}
            helperText={blurs.email && errors.email}
            error={blurs.email && "email" in errors}
          />
          <TextField
            id="barcode-no"
            label="Barcode Number Start"
            type="number"
            name="planStart"
            className={classes.field}
            InputProps={{ inputProps: { min: 1, max: 999999 } }}
            value={data.planStart}
            onBlur={() => setBlurs({ ...blurs, planStart: true })}
            onChange={(e) =>
              handleChange(
                "planStart",
                e.target.value
                  ? `${santizeNumbers(parseInt(e.target.value), 1, 999999)}`
                  : e.target.value
              )
            }
            helperText={blurs.planStart && errors.planStart}
            error={blurs.planStart && "planStart" in errors}
          />

          <FormControl>
            <InputLabel id="plan-type-label">Plan Type</InputLabel>
            <Select
              className={classes.field}
              labelId="plan-type"
              id="plan-type"
              value={data.planType}
              name="planType"
              onChange={(e) => handleChange("planType", `${e.target.value}`)}
            >
              <MenuItem value="AP">AP</MenuItem>
              <MenuItem value="SP">SP</MenuItem>
            </Select>
          </FormControl>

          <TextField
            id="barcode-no"
            label="Count (1-50)"
            type="number"
            className={classes.field}
            InputProps={{ inputProps: { min: 1, max: 50 } }}
            value={data.planCount}
            onBlur={() => setBlurs({ ...blurs, planCount: true })}
            name="planCount"
            onChange={({ target: { value: v } }) =>
              handleChange(
                "planCount",
                v ? `${santizeNumbers(parseInt(v), 1, 999999)}` : v
              )
            }
            helperText={blurs.planCount && errors.planCount}
            error={blurs.planCount && "planCount" in errors}
          />
          <div>
            <Button
              disabled={Object.keys(errors).length > 0 || checkPristine()}
              onClick={handleGenerateClick}
              variant="contained"
              color="secondary"
            >
              {loading
                ? "Generating..."
                : data.planCount > 1
                ? "Generate (zip)"
                : "Generate"}
            </Button>
          </div>
        </StyledForm>
      </StyledPaper>
      {plans.length ? <MakeBarcodes values={plans} /> : plans}
    </StyledContainer>
  );
};

export default BarcodeHome;
