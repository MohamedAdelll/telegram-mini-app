import {
  FormControl,
  FormHelperText,
  FormLabel,
  InputAdornment,
  TextField,
  TextFieldProps,
  Typography,
} from "@mui/material";

export default function FormInput(props: {
  label: string;
  startAdornment?: string;
  endAdornment?: string;
  error?: boolean;
  required?: boolean;
  helperText?: string;
  textFieldProps?: TextFieldProps;
}) {
  return (
    <FormControl error={props.error} required={props.required}>
      <FormLabel
        children={<Typography variant="body2" children={props.label} />}
      />
      <TextField
        error={props.error}
        required={props.required}
        {...props.textFieldProps}
        slotProps={{
          input: {
            startAdornment: props.startAdornment ? (
              <InputAdornment position="start">
                {props.startAdornment}
              </InputAdornment>
            ) : null,
            endAdornment: props.endAdornment ? (
              <InputAdornment position="end">
                {props.endAdornment}
              </InputAdornment>
            ) : null,
          },
        }}
      />
      <FormHelperText
        children={<Typography variant="caption" children={props.helperText} />}
      />
    </FormControl>
  );
}
