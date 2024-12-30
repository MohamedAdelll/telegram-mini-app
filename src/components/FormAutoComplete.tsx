import { Control, Controller } from "react-hook-form";

import { Autocomplete, TextField, Typography } from "@mui/material";

type ArraysITrackerFilters = Pick<
  ITrackerFilter,
  "categories" | "countryOfClient" | "excludedCountryOfClient"
>;

type FormAutoCompleteProps = {
  control: Control<ITrackerFilter>;
  name: keyof ArraysITrackerFilters;
  label: string;
  helperText: string;
  noOptionsText: string;
  options: readonly string[];
};

export default function FormAutoComplete({
  control,
  name,
  label,
  helperText,
  options,
  noOptionsText,
}: FormAutoCompleteProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <Autocomplete
            fullWidth
            autoComplete
            multiple
            options={options}
            openOnFocus
            noOptionsText={
              <Typography variant="caption" children={noOptionsText} />
            }
            value={field.value}
            onChange={(_, value) => field.onChange(value)}
            renderInput={(params) => (
              <TextField
                label={<Typography variant="body2" children={label} />}
                name={field.name}
                helperText={
                  <Typography variant="caption" children={helperText} />
                }
                {...params}
                onBlur={field.onBlur}
                value={field.value}
              />
            )}
          />
        );
      }}
    ></Controller>
  );
}
