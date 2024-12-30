import { Control, Controller } from "react-hook-form";

import {
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
  Typography,
} from "@mui/material";

type BooleanITrackerFilters = Pick<
  ITrackerFilter,
  "enterpriseClients" | "paymentMethodVerified"
>;
type FormCheckboxProps = {
  name: keyof BooleanITrackerFilters;
  control: Control<ITrackerFilter>;
  formLabel: string;
  formHelperText: string;
};

export default function FormCheckbox({
  name,
  control,
  formLabel,
  formHelperText,
}: FormCheckboxProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControl>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <FormLabel
              style={{ userSelect: "none" }}
              htmlFor={name}
              children={<Typography children={formLabel} variant="body2" />}
            />
            <Checkbox
              id={name}
              checked={field.value}
              value={field.value}
              onChange={field.onChange}
            />
          </div>
          <FormHelperText
            children={
              <Typography variant="caption" children={formHelperText} />
            }
          />
        </FormControl>
      )}
    />
  );
}
