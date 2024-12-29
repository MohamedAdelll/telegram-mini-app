import { Controller, useForm } from "react-hook-form";

import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import InsertEmoticonRoundedIcon from "@mui/icons-material/InsertEmoticonRounded";
import MonetizationRoundedIcon from "@mui/icons-material/MonetizationOnRounded";
import PageviewRoundedIcon from "@mui/icons-material/PageviewRounded";
import StarsRoundedIcon from "@mui/icons-material/StarsRounded";
import {
  Autocomplete,
  Button,
  Checkbox,
  Chip,
  createFilterOptions,
  FormControl,
  FormHelperText,
  FormLabel,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Slider,
  TextField,
} from "@mui/material";
import { init, retrieveLaunchParams } from "@telegram-apps/sdk";

import FormInput from "./components/FormInput";
import FormSection from "./components/FormSection";
import FormSectionHeader from "./components/FormSectionHeader";
import { formDefaultValues } from "./constants/defaultValues";
import {
  categories,
  contractToHire,
  contractTypes,
  countries,
  experienceLevels,
  featuredJobs,
  hoursToWorkPerWeek,
  oneTimeProject,
  ongoingProject,
} from "./constants/options";
import { SelectMenuProps } from "./constants/styles";

console.log(window.parent !== window);
if (window.parent !== window) init();

const filter = createFilterOptions<{
  title: string;
  inputValue: string | undefined;
}>({ ignoreCase: false });

let initDataRaw = "";
if (window.parent !== window) {
  ({ initDataRaw = "" } = retrieveLaunchParams());
  console.log(retrieveLaunchParams());
}

export default function App() {
  const {
    register,
    handleSubmit,
    watch,
    control,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: formDefaultValues,
  });

  const [
    contractTypeState,
    countryOfClientState,
    excludedCountryOfClientState,
  ] = watch(["contractType", "countryOfClient", "excludedCountryOfClient"]);
  return (
    <>
      <form
        onSubmit={handleSubmit(async (data) => {
          console.log(initDataRaw);
          const response = await fetch("http://localhost:3214/tracker/", {
            method: "POST",
            body: JSON.stringify({ filters: data }),
            headers: {
              authorization: `tma ${initDataRaw}`,
              "Content-Type": "application/json",
            },
          });
          const responseData = await response.json();

          if (Array.isArray(responseData.errors)) {
            responseData.errors.forEach(
              (error: { field: string; message: string }) => {
                setError(
                  error.field as keyof typeof formDefaultValues,
                  {
                    message: error.message,
                  },
                  { shouldFocus: true }
                );
              }
            );
          }
          console.log(response, responseData);
        })}
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          padding: "2rem 2rem",
          marginTop: "100px",
        }}
      >
        <FormSection id="intro-section">
          <FormInput
            label="Tracker Name"
            helperText={errors.trackerName?.message ?? ""}
            error={Boolean(errors.trackerName)}
            textFieldProps={{
              placeholder: "E.g. Hourly, $10+, Frontend.",
              inputProps: register("trackerName", {
                required: "You need to identify a name for your tracker",
              }),
            }}
          />
        </FormSection>
        {/* Start of Budget Section*/}
        <FormSection id="budget-section">
          <FormSectionHeader
            Icon={MonetizationRoundedIcon}
            title="Budget"
            subtitle="Choose the budget of your contracts."
          />
          <FormInput
            label="Contract Type"
            textFieldProps={{
              defaultValue: contractTypes[0].value,
              select: true,
              inputProps: register("contractType"),
              children: contractTypes.map((option) => (
                <MenuItem
                  value={option.value}
                  key={option.value}
                  children={option.label}
                />
              )),
            }}
            helperText="Select the type of contract."
          />
          {contractTypeState !== "FixedPrice" && (
            <>
              <FormInput
                label="Min. Hourly Rate"
                helperText={errors.minHourlyRate?.message ?? ""}
                error={Boolean(errors.minHourlyRate)}
                textFieldProps={{
                  placeholder: "0",
                  type: "number",
                  inputProps: {
                    ...register("minHourlyRate", {
                      valueAsNumber: true,
                      min: { value: 0, message: "Minimum hourly rate is 0" },
                    }),
                    min: 0,
                  },
                }}
                startAdornment="$"
                endAdornment="/hr"
              />
              <FormInput
                label="Max. Hourly Rate"
                helperText={errors.maxHourlyRate?.message ?? ""}
                error={Boolean(errors.maxHourlyRate)}
                textFieldProps={{
                  placeholder: "100",
                  type: "number",
                  inputProps: {
                    ...register("maxHourlyRate", {
                      min: { value: 0, message: "Minimum value is 0" },
                      valueAsNumber: true,
                    }),
                    min: 0,
                  },
                }}
                startAdornment="$"
                endAdornment="/hr"
              />
            </>
          )}

          {contractTypeState !== "Hourly" && (
            <>
              <FormInput
                label="Min. Fixed Budget"
                helperText={errors.minFixedBudget?.message ?? ""}
                error={Boolean(errors.minFixedBudget)}
                textFieldProps={{
                  placeholder: "0",
                  type: "number",
                  inputProps: {
                    ...register("minFixedBudget", {
                      min: { value: 0, message: "Minimum value is 0" },
                      valueAsNumber: true,
                    }),
                    min: 0,
                  },
                }}
                startAdornment="$"
              />
              <FormInput
                label="Max. Fixed Budget"
                helperText={errors.maxFixedBudget?.message ?? ""}
                error={Boolean(errors.maxFixedBudget)}
                textFieldProps={{
                  placeholder: "100",
                  type: "number",
                  inputProps: {
                    ...register("maxFixedBudget", {
                      min: { value: 0, message: "Minimum value is 0" },
                      valueAsNumber: true,
                    }),
                    min: 0,
                  },
                }}
                startAdornment="$"
              />
            </>
          )}
        </FormSection>
        {/* End of Budget Section*/}
        {/* Start of Job Attributes Section*/}
        <FormSection id="jobPreferences-section">
          <FormSectionHeader
            Icon={StarsRoundedIcon}
            title="Job Preferences"
            subtitle="Choose the preferences of the jobs you want to be notified with."
          />
          <Controller
            name="categories"
            control={control}
            render={({ field }) => {
              return (
                <Autocomplete
                  fullWidth
                  autoComplete
                  multiple
                  options={categories}
                  openOnFocus
                  noOptionsText="No categories found"
                  onChange={(_, value) => field.onChange(value)}
                  renderInput={(params) => (
                    <TextField
                      label="Categories"
                      name={field.name}
                      helperText="Choose the categories for the job."
                      {...params}
                      onBlur={field.onBlur}
                      value={field.value}
                    />
                  )}
                />
              );
            }}
          ></Controller>
          <Controller
            name="experienceLevel"
            control={control}
            render={({ field }) => (
              <FormControl>
                <InputLabel id="demo-multiple-checkbox-label">
                  Experience Level
                </InputLabel>
                <Select
                  multiple
                  value={field.value ?? []}
                  onChange={(e) => field.onChange(e.target.value)}
                  input={<OutlinedInput label="Experience Level" />}
                  name={field.name}
                  renderValue={() =>
                    field.value.map((value: string) => (
                      <Chip
                        style={{ margin: "0 2px" }}
                        key={value}
                        label={value}
                      />
                    ))
                  }
                  MenuProps={SelectMenuProps}
                >
                  {experienceLevels.map((name) => (
                    <MenuItem key={name} value={name}>
                      <Checkbox checked={field.value?.includes(name) ?? true} />
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText children="You will get job notifications if it requires any of the selected experience level(s)." />
              </FormControl>
            )}
          ></Controller>
          <FormInput
            label="Hours to work per week"
            textFieldProps={{
              select: true,
              inputProps: register("hoursToWorkPerWeek"),
              defaultValue: hoursToWorkPerWeek[0].value,
              children: hoursToWorkPerWeek.map((option) => (
                <MenuItem
                  value={option.value}
                  key={option.value}
                  children={option.label}
                />
              )),
            }}
          />
          <Controller
            name="requiredSkills"
            control={control}
            render={({ field }) => (
              <Autocomplete
                fullWidth
                autoComplete
                multiple
                freeSolo
                openOnFocus
                options={
                  [] as { inputValue: string | undefined; title: string }[]
                }
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
                      (val: string) =>
                        val.toLowerCase() === inputValue.toLowerCase()
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
                    label="Required Skills"
                    name={field.name}
                    helperText="You will get job notifications if it requires any of the selected skills."
                    {...params}
                    onBlur={field.onBlur}
                    value={field.value}
                  />
                )}
                onChange={(_, value) => {
                  const parsedValue = value.map((val) =>
                    typeof val === "string" ? val : val.inputValue
                  );
                  field.onChange(parsedValue);
                }}
              />
            )}
          ></Controller>
          <Controller
            name="excludedSkills"
            control={control}
            render={({ field }) => (
              <Autocomplete
                fullWidth
                autoComplete
                multiple
                freeSolo
                options={
                  [] as { inputValue: string | undefined; title: string }[]
                }
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
                  if (inputValue !== "") {
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
                openOnFocus
                renderInput={(params) => (
                  <TextField
                    label="Excluded Skills"
                    name={field.name}
                    helperText="You will not get job notifications if the job has any of these skills, case insensitive."
                    {...params}
                    onBlur={field.onBlur}
                    value={field.value}
                  />
                )}
                onChange={(_, value) => {
                  const parsedValue = value.map((val) =>
                    typeof val === "string" ? val : val.inputValue
                  );
                  field.onChange(parsedValue);
                }}
              />
            )}
          ></Controller>
        </FormSection>
        {/* End of Job Attributes Section*/}
        {/* Start of Job Parsing Section*/}
        <FormSection id="jobParsing-section">
          <FormSectionHeader
            Icon={PageviewRoundedIcon}
            title="Job Parsing"
            subtitle="Search for words in jobs title, description or skills."
          />
          <Controller
            name="matchAllWords"
            control={control}
            render={({ field }) => (
              <Autocomplete
                fullWidth
                autoComplete
                multiple
                freeSolo
                options={
                  [] as { inputValue: string | undefined; title: string }[]
                }
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
                  if (inputValue !== "") {
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
                openOnFocus
                renderInput={(params) => (
                  <TextField
                    label="Match All Words"
                    name={field.name}
                    helperText="You will get job notification if the job's description/title has a match of all the words selected here, this is case insensitive, but will not match partial words. E.g. 'react' will match 'React' but not 'ReactJS' etc."
                    {...params}
                    onBlur={field.onBlur}
                    value={field.value}
                  />
                )}
                onChange={(_, value) => field.onChange(value)}
              />
            )}
          />
          <Controller
            name="matchAnyWords"
            control={control}
            render={({ field }) => (
              <Autocomplete
                fullWidth
                autoComplete
                multiple
                freeSolo
                options={
                  [] as { inputValue: string | undefined; title: string }[]
                }
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
                  if (inputValue !== "") {
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
                openOnFocus
                renderInput={(params) => (
                  <TextField
                    label="Match Any of Words"
                    name={field.name}
                    helperText="You will get job notification if the job's description/title has a match of any of these words, this is case insensitive, but will not match partial words. E.g. 'react' will match 'React' but not 'ReactJS' etc."
                    {...params}
                    onBlur={field.onBlur}
                    value={field.value}
                  />
                )}
                onChange={(_, value) => field.onChange(value)}
              />
            )}
          />
          <Controller
            name="excludeAnyWords"
            control={control}
            render={({ field }) => (
              <Autocomplete
                fullWidth
                autoComplete
                multiple
                freeSolo
                options={
                  [] as { inputValue: string | undefined; title: string }[]
                }
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
                  if (inputValue !== "") {
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
                openOnFocus
                renderInput={(params) => (
                  <TextField
                    label="Exclude Any of Words"
                    name={field.name}
                    helperText="You will exclude job notifications if the job's description/title has a match of any of these words, this is case insensitive, but will not match partial words."
                    {...params}
                    onBlur={field.onBlur}
                    value={field.value}
                  />
                )}
                onChange={(_, value) => field.onChange(value)}
              />
            )}
          />
        </FormSection>
        {/* End of Job Parsing Section*/}
        {/* Start of Client Preferences Section*/}
        <FormSection id="clientPreferences-section">
          <FormSectionHeader
            Icon={InsertEmoticonRoundedIcon}
            title="Client Preferences"
            subtitle="Choose who you work with."
          />
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
                htmlFor="paymentMethodVerified"
                children="Payment Method Verified"
              />
              <Checkbox
                id="paymentMethodVerified"
                {...register("paymentMethodVerified")}
              />
            </div>
            <FormHelperText
              children={
                Math.random() > 0.5
                  ? "You will get job notifications if the client's payment method is verified."
                  : "You will get job notification regardless of the client's payment verification"
              }
            />
          </FormControl>
          <Controller
            name="minClientRating"
            control={control}
            rules={{
              min: { value: 0, message: "Minimum value is 0" },
              max: { value: 5, message: "Maximum value is 5" },
            }}
            render={({ field }) => (
              <FormControl>
                <FormLabel children="Min. client rating" />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "32px",
                    marginTop: "4px",
                  }}
                >
                  <Slider
                    valueLabelDisplay="auto"
                    min={0}
                    max={5}
                    step={0.5}
                    defaultValue={4.5}
                    name={field.name}
                    value={field.value ?? 4.5}
                    onChange={(_, value) => field.onChange(value)}
                  />
                  <FormLabel children={field.value?.toFixed?.(1) ?? 4.5} />
                </div>
              </FormControl>
            )}
          />
          <FormInput
            label="Min. reviews count"
            textFieldProps={{
              placeholder: "0",
              type: "number",
              inputProps: {
                ...register("minClientReviewsCount", {
                  min: { value: 0, message: "Minimum value is 0" },
                  valueAsNumber: true,
                }),
                min: 0,
              },
            }}
          />
          <Controller
            name="minHireRate"
            control={control}
            rules={{
              min: { value: 0, message: "Minimum value is 0" },
              max: { value: 100, message: "Maximum value is 100" },
            }}
            render={({ field }) => (
              <FormControl>
                <FormLabel children="Min. hire rate (%)" />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "32px",
                    marginTop: "4px",
                  }}
                >
                  <Slider
                    valueLabelDisplay="auto"
                    min={0}
                    max={100}
                    step={1}
                    value={field.value}
                    name={field.name}
                    onChange={(_, value) =>
                      typeof value === "number" ? field.onChange(value) : null
                    }
                  />
                  <FormLabel
                    children={`${(field.value || 55)
                      .toString()
                      .padStart(2, "0")}%`}
                  />
                </div>
              </FormControl>
            )}
          />
          <FormInput
            label="Min. number of hires"
            textFieldProps={{
              placeholder: "0",
              type: "number",
              inputProps: {
                ...register("minNumOfHires", {
                  min: { value: 0, message: "Minimum value is 0" },
                  valueAsNumber: true,
                }),
                min: 0,
              },
            }}
          />
          <FormInput
            label="Min. total jobs"
            helperText={errors.minTotalJobs?.message ?? ""}
            error={Boolean(errors.minTotalJobs)}
            textFieldProps={{
              placeholder: "0",
              type: "number",
              inputProps: {
                ...register("minTotalJobs", {
                  min: { value: 0, message: "Minimum value is 0" },
                  valueAsNumber: true,
                }),
                min: 0,
              },
            }}
          />
          <FormInput
            label="Min. total spent"
            helperText={errors.minTotalSpent?.message ?? ""}
            error={Boolean(errors.minTotalSpent)}
            startAdornment="$"
            textFieldProps={{
              placeholder: "0",
              type: "number",
              inputProps: {
                ...register("minTotalSpent", {
                  min: { value: 0, message: "Minimum value is 0" },
                  valueAsNumber: true,
                }),
                min: 0,
              },
            }}
          />
          <FormInput
            label="Min. average hourly rate"
            error={Boolean(errors.minAvgHourlyRate)}
            startAdornment="$"
            endAdornment="/hr"
            helperText={errors.minAvgHourlyRate?.message ?? ""}
            textFieldProps={{
              placeholder: "0",
              type: "number",
              inputProps: {
                ...register("minAvgHourlyRate", {
                  min: { value: 0, message: "Minimum value is 0" },
                }),
                min: 0,
              },
            }}
          />
          <Controller
            name="countryOfClient"
            control={control}
            render={({ field }) => (
              <Autocomplete
                sx={{ marginTop: "0.5rem" }}
                fullWidth
                autoComplete
                multiple
                options={countries.filter(
                  (country) =>
                    !(excludedCountryOfClientState as string[])?.includes(
                      country
                    )
                )}
                openOnFocus
                onChange={(_, value) => field.onChange(value)}
                renderInput={(params) => (
                  <TextField
                    label="Choose country of clients"
                    name={field.name}
                    helperText="You will get job notifications if the client is from any of the selected countries."
                    {...params}
                    onBlur={field.onBlur}
                    value={field.value}
                  />
                )}
              />
            )}
          />
          <Controller
            name="excludedCountryOfClient"
            control={control}
            render={({ field }) => (
              <Autocomplete
                fullWidth
                autoComplete
                multiple
                options={countries.filter(
                  (country) =>
                    !(countryOfClientState as string[])?.includes(country)
                )}
                openOnFocus
                onChange={(_, value) => field.onChange(value)}
                renderInput={(params) => (
                  <TextField
                    label="Exclude country of clients"
                    helperText="You will not get job notifications if the client is from any of the selected countries."
                    {...params}
                    onBlur={field.onBlur}
                    name={field.name}
                    value={field.value}
                  />
                )}
              />
            )}
          />
        </FormSection>
        {/* End of Client Preferences Section*/}
        {/* Start of Extra filters Section*/}
        <FormSection id="extraFilters-section">
          <FormSectionHeader
            title="Extra Filters"
            subtitle="Choose the extra filters for your tracker."
            Icon={FilterAltOutlinedIcon}
          ></FormSectionHeader>
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
                htmlFor="enterpriseClients"
                children="Enterprise clients only"
              />
              <Checkbox
                id="enterpriseClients"
                {...register("enterpriseClients")}
              />
            </div>
          </FormControl>
          <FormInput
            label="Featured Jobs"
            helperText={errors.featuredJobs?.message ?? ""}
            error={Boolean(errors.featuredJobs)}
            textFieldProps={{
              defaultValue: featuredJobs[0].value,
              select: true,
              inputProps: register("featuredJobs"),
              children: featuredJobs.map((option) => (
                <MenuItem
                  value={option.value}
                  key={option.value}
                  children={option.label}
                />
              )),
            }}
          />
          <FormInput
            label="One-time Project"
            textFieldProps={{
              defaultValue: oneTimeProject[0].value,
              select: true,
              inputProps: register("oneTimeProject"),
              children: oneTimeProject.map((option) => (
                <MenuItem
                  value={option.value}
                  key={option.value}
                  children={option.label}
                />
              )),
            }}
          />
          <FormInput
            label="Ongoing Project"
            textFieldProps={{
              defaultValue: ongoingProject[0].value,
              select: true,
              inputProps: register("ongoingProject"),
              children: ongoingProject.map((option) => (
                <MenuItem
                  value={option.value}
                  key={option.value}
                  children={option.label}
                />
              )),
            }}
          />
          <FormInput
            label="Contract to Hire"
            textFieldProps={{
              defaultValue: contractToHire[0].value,
              select: true,
              inputProps: register("contractToHireProject"),
              children: contractToHire.map((option) => (
                <MenuItem
                  value={option.value}
                  key={option.value}
                  children={option.label}
                />
              )),
            }}
          />
        </FormSection>
        {/* End of Extra filters Section*/}
        {!!initDataRaw && (
          <Button
            variant="contained"
            sx={{ padding: "0.5rem 0" }}
            type="submit"
          >
            Create New Tracker
          </Button>
        )}
      </form>
    </>
  );
}
