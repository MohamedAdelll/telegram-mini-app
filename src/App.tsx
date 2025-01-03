import axios from "axios";
import eruda from "eruda";
import {
  Controller,
  useForm,
} from "react-hook-form";

import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import InsertEmoticonRoundedIcon
  from "@mui/icons-material/InsertEmoticonRounded";
import MonetizationRoundedIcon from "@mui/icons-material/MonetizationOnRounded";
import PageviewRoundedIcon from "@mui/icons-material/PageviewRounded";
import StarsRoundedIcon from "@mui/icons-material/StarsRounded";
import {
  Button,
  Checkbox,
  Chip,
  FormControl,
  FormHelperText,
  FormLabel,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Slider,
  Typography,
} from "@mui/material";
import {
  init,
  retrieveLaunchParams,
} from "@telegram-apps/sdk";

import FormAutoComplete from "./components/FormAutoComplete";
import FormAutoCompleteFreeSolo from "./components/FormAutoCompleteFreeSolo";
import FormCheckbox from "./components/FormCheckbox";
import FormInput from "./components/FormInput";
import FormSection from "./components/FormSection";
import FormSectionHeader from "./components/FormSectionHeader";
import FormSelect from "./components/FormSelect";
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
import useFetch from "./hooks/useFetch";

const serverUrl = "https://127.0.0.1:3214";

eruda.init();

try {
  init();
} catch (error) {
  console.log("wow", error);
}

let initDataRaw = "";
try {
  ({ initDataRaw = "" } = retrieveLaunchParams());
} catch (error) {
  console.log("wow", error);
}

let trackerId = "";
const params = new URL(window.location.href).searchParams;
for (const param of params) {
  const params = Object.fromEntries([param]);
  if (params.trackerId) {
    trackerId = params.trackerId;
  }
}

export default function App() {
  const { response } = useFetch<{ data: ITracker }>(
    `${serverUrl}/tracker/${trackerId}`,
    {
      headers: { authorization: `tma ${initDataRaw}` },
    }
  );
  const {
    register,
    // handleSubmit,
    watch,
    control,
    // setError,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: formDefaultValues,
    values: response?.data?.filters,
  });

  const values = getValues();
  console.log(values);

  const [
    contractTypeState,
    countryOfClientState,
    excludedCountryOfClientState,
  ] = watch(["contractType", "countryOfClient", "excludedCountryOfClient"]);
  return (
    <>
      <form
        // onSubmit={handleSubmit(async (data) => {
        //   try {
        //     const response = await fetch(
        //       `${serverUrl}/tracker/${trackerId ? trackerId : ""}`,
        //       {
        //         method: trackerId ? "PATCH" : "POST",
        //         body: JSON.stringify({ filters: data }),
        //         headers: {
        //           authorization: `tma ${initDataRaw}`,
        //           "Content-Type": "application/json",
        //         },
        //       }
        //     );
        //     console.log({ response });
        //     const responseData = await response.json();

        //     if (Array.isArray(responseData.errors)) {
        //       responseData.errors.forEach(
        //         (error: { field: string; message: string }) => {
        //           setError(
        //             error.field as keyof typeof formDefaultValues,
        //             {
        //               message: error.message,
        //             },
        //             { shouldFocus: true }
        //           );
        //         }
        //       );
        //     }
        //   } catch (error) {
        //     console.log("error", error);
        //   }
        // })}
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          padding: "2rem 2rem",
          paddingBottom: "6rem",
          marginTop: "100px",
        }}
        onSubmit={async (e) => {
          e.preventDefault();
          const data = getValues();
          console.log(
            "submitting",
            { data, trackerId, axios },
            `${serverUrl}/tracker/${trackerId ? trackerId : ""}`
          );
          try {
            const response = await axios({
              method: trackerId ? "PATCH" : "POST",
              url: `${serverUrl}/tracker/${trackerId ? trackerId : ""}`,
              data: { filters: data },
              headers: {
                authorization: `tma ${initDataRaw}`,
                "Content-Type": "application/json",
              },
            });

            console.log("Response Data:", response.data);
          } catch (error) {
            console.log("Axios Error:", error as Error);
          }
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
          <FormSelect
            control={control}
            name="contractType"
            label="Contract Type"
            helperText="You will get job notifications based on the selected contract type."
            options={contractTypes}
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
          <FormAutoComplete
            control={control}
            options={categories}
            noOptionsText="No categories selected"
            name="categories"
            label="Categories"
            helperText="Choose the categories for the job"
          />
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
          <FormSelect
            control={control}
            name="hoursToWorkPerWeek"
            label="Hours to Work Per Week"
            helperText="You will get job notifications based on the selected hours to work per week."
            options={hoursToWorkPerWeek}
          />
          <FormAutoCompleteFreeSolo
            control={control}
            name="requiredSkills"
            label="Required Skills"
            helperText="You will get job notifications if it requires any of the selected skills."
          />
          <FormAutoCompleteFreeSolo
            control={control}
            name="excludedSkills"
            label="Excluded Skills"
            helperText="You will not get job notifications if it requires any of the selected skills."
          />
        </FormSection>
        {/* End of Job Attributes Section*/}
        {/* Start of Job Parsing Section*/}
        <FormSection id="jobParsing-section">
          <FormSectionHeader
            Icon={PageviewRoundedIcon}
            title="Job Parsing"
            subtitle="Search for words in jobs title, description or skills."
          />
          <FormAutoCompleteFreeSolo
            control={control}
            name="matchAllWords"
            label="Match All Words"
            helperText="You will get job notification if the job's description/title has a match of all of these words, this is case insensitive, but will not match partial words. E.g. 'react' will match 'React' but not 'ReactJS' etc."
          />
          <FormAutoCompleteFreeSolo
            control={control}
            name="matchAnyWords"
            label="Match Any Words"
            helperText="You will get job notification if the job's description/title has a match of any of these words, this is case insensitive, but will not match partial words."
          />
          <FormAutoCompleteFreeSolo
            control={control}
            name="excludeAnyWords"
            label="Exclude Any Words"
            helperText="You will not get job notification if the job's description/title has a match of any of these words, this is case insensitive, but will not match partial words."
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
          <FormCheckbox
            control={control}
            name="paymentMethodVerified"
            formLabel="Payment Method Verified"
            formHelperText={
              values.paymentMethodVerified
                ? "You will get job notifications if the client's payment method is verified."
                : "You will get job notification regardless of the client's payment verification"
            }
          />
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
                    value={field.value ?? undefined}
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
          <FormAutoComplete
            control={control}
            options={countries.filter(
              (country) =>
                !(excludedCountryOfClientState as string[])?.includes(country)
            )}
            noOptionsText="No countries selected"
            name="countryOfClient"
            label="Country of Clients"
            helperText="You will get job notifications if the client is from any of the selected countries."
          />
          <FormAutoComplete
            control={control}
            options={countries.filter(
              (country) =>
                !(countryOfClientState as string[])?.includes(country)
            )}
            noOptionsText="No countries selected"
            name="excludedCountryOfClient"
            label="Excluded Country of Clients"
            helperText="You will not get job notifications if the client is from any of the selected countries."
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
          <FormCheckbox
            control={control}
            name="enterpriseClients"
            formLabel="Enterprise Clients"
            formHelperText={
              values.enterpriseClients
                ? "You will get job notifications if the client is an enterprise client."
                : "You will get job notifications regardless of the client being an enterprise client."
            }
          />
          <FormSelect
            control={control}
            name="featuredJobs"
            label="Featured Jobs"
            options={featuredJobs}
          />
          <FormSelect
            control={control}
            name="oneTimeProject"
            label="One Time Project"
            options={oneTimeProject}
          />
          <FormSelect
            control={control}
            name="ongoingProject"
            label="Ongoing Project"
            options={ongoingProject}
          />
          <FormSelect
            control={control}
            name="contractToHireProject"
            label="Contract to Hire Project"
            options={contractToHire}
          />
        </FormSection>
        {/* End of Extra filters Section*/}
        {!!initDataRaw && (
          <div className="footer">
            <Button
              variant="contained"
              sx={{ padding: "0.5rem 0", width: "100%" }}
              type="submit"
              children={
                <Typography
                  variant="button"
                  children={trackerId ? "Edit Tracker" : "Create New Tracker"}
                />
              }
            />
          </div>
        )}
      </form>
    </>
  );
}
