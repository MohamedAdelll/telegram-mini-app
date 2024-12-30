import { type Control, Controller } from "react-hook-form";

import { MenuItem } from "@mui/material";

import type { FormSelectOption } from "../constants/options";
import FormInput from "./FormInput";

type ArraysITrackerFilters = Pick<
  ITrackerFilter,
  | "contractType"
  | "hoursToWorkPerWeek"
  | "featuredJobs"
  | "oneTimeProject"
  | "ongoingProject"
  | "contractToHireProject"
>;

type FormSelectProps = {
  control: Control<ITrackerFilter>;
  name: keyof ArraysITrackerFilters;
  label: string;
  helperText?: string;
  options: FormSelectOption[];
};

export default function FormSelect({
  control,
  name,
  label,
  helperText,
  options,
}: FormSelectProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormInput
          label={label}
          textFieldProps={{
            defaultValue: options[0].value,
            value: field.value,
            onChange: field.onChange,
            select: true,
            children: options.map((option) => (
              <MenuItem
                value={option.value}
                key={option.value}
                children={option.label}
              />
            )),
          }}
          helperText={helperText}
        />
      )}
    />
  );
}
