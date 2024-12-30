import { Control, Controller } from "react-hook-form";

import {
  Autocomplete,
  createFilterOptions,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

const filter = createFilterOptions<{
  title: string;
  inputValue: string | undefined;
}>({ ignoreCase: false });

type ArraysITrackerFilters = Pick<
  ITrackerFilter,
  | "requiredSkills"
  | "excludedSkills"
  | "matchAllWords"
  | "matchAnyWords"
  | "excludeAnyWords"
>;

type FormAutoCompleteFreeSoloProps = {
  control: Control<ITrackerFilter>;
  name: keyof ArraysITrackerFilters;
  label: string;
  helperText: string;
};

export default function FormAutoCompleteFreeSolo({
  control,
  name,
  label,
  helperText,
}: FormAutoCompleteFreeSoloProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Autocomplete
          fullWidth
          autoComplete
          multiple
          freeSolo
          openOnFocus
          value={field.value}
          onChange={(_, value) => {
            const parsedValue = value.map((val) =>
              typeof val === "string" ? val : val.inputValue
            );
            field.onChange(parsedValue);
          }}
          options={[] as { inputValue: string | undefined; title: string }[]}
          getOptionLabel={(option) => {
            if (typeof option === "string") {
              return option;
            }
            if (option.inputValue) {
              return option.inputValue;
            }
            return option.title;
          }}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);
            const { inputValue } = params;
            if (
              field.value?.some(
                (val: string) => val.toLowerCase() === inputValue.toLowerCase()
              )
            ) {
              return filtered;
            } else if (inputValue !== "") {
              filtered.push({
                inputValue,
                title: `Add "${inputValue}"`,
              });
            }
            return filtered;
          }}
          renderOption={(props, option) => (
            <MenuItem {...props} key={option.title}>
              {option.title}
            </MenuItem>
          )}
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
      )}
    />
  );
}
