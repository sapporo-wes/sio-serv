import { Box, Typography } from "@mui/material"
import TextField, { TextFieldProps } from "@mui/material/TextField"
import {
  ariaDescribedByIds,
  BaseInputTemplateProps,
  examplesId,
  getInputProps,
  labelValue,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
} from "@rjsf/utils"
import { ChangeEvent, FocusEvent } from "react"

const TYPES_THAT_SHRINK_LABEL = ["date", "datetime-local", "file", "time"]

/** The `BaseInputTemplate` is the template to use to render the basic `<input>` component for the `core` theme.
 * It is used as the template for rendering many of the <input> based widgets that differ by `type` and callbacks only.
 * It can be customized/overridden for other themes or individual implementations as needed.
 *
 * @param props - The `WidgetProps` for this template
 */
export default function BaseInputTemplate<
  T = any,  // eslint-disable-line
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,   // eslint-disable-line
>(props: BaseInputTemplateProps<T, S, F>) {
  const {
    id,
    name, // eslint-disable-line
    placeholder,
    required,
    readonly,
    disabled,
    type,
    label,
    hideLabel,
    hideError, // eslint-disable-line
    value,
    onChange,
    onChangeOverride,
    onBlur,
    onFocus,
    autofocus,
    options,
    schema,
    uiSchema, // eslint-disable-line
    rawErrors = [],
    errorSchema, // eslint-disable-line
    formContext, // eslint-disable-line
    registry, // eslint-disable-line
    InputLabelProps,
    ...textFieldProps
  } = props
  const inputProps = getInputProps<T, S, F>(schema, type, options)
  // Now we need to pull out the step, min, max into an inner `inputProps` for material-ui
  const { step, min, max, ...rest } = inputProps
  const otherProps = {
    inputProps: {
      step,
      min,
      max,
      ...(schema.examples ? { list: examplesId<T>(id) } : undefined),
    },
    ...rest,
  }
  const _onChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) =>
    onChange(value === "" ? options.emptyValue : value)
  const _onBlur = ({ target }: FocusEvent<HTMLInputElement>) => onBlur(id, target && target.value)
  const _onFocus = ({ target }: FocusEvent<HTMLInputElement>) => onFocus(id, target && target.value)
  const DisplayInputLabelProps = TYPES_THAT_SHRINK_LABEL.includes(type)
    ? {
      ...InputLabelProps,
      shrink: true,
    }
    : InputLabelProps

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Typography variant="h2" sx={{ fontSize: "1.1rem", fontWeight: "bold", mb: "0.75rem" }}>
        {labelValue(label || undefined, hideLabel, undefined)}
      </Typography>
      <Box sx={{ margin: "0 1.5rem", width: "100%" }}>
        <TextField
          id={id}
          name={id}
          placeholder={placeholder}
          // label={labelValue(label || undefined, hideLabel, undefined)}
          autoFocus={autofocus}
          required={required}
          disabled={disabled || readonly}
          {...otherProps}
          value={value || value === 0 ? value : ""}
          error={rawErrors.length > 0}
          onChange={onChangeOverride || _onChange}
          onBlur={_onBlur}
          onFocus={_onFocus}
          InputLabelProps={DisplayInputLabelProps}
          {...(textFieldProps as TextFieldProps)}
          aria-describedby={ariaDescribedByIds<T>(id, !!schema.examples)}
          fullWidth
          size="small"
          sx={{ maxWidth: "720px" }}
        />
        {Array.isArray(schema.examples) && (
          <datalist id={examplesId<T>(id)}>
            {(schema.examples as string[])
              .concat(schema.default && !schema.examples.includes(schema.default) ? ([schema.default] as string[]) : [])
              .map((example: any) => {  // eslint-disable-line
                return <option key={example} value={example} />
              })}
          </datalist>
        )}
      </Box>
    </Box>
  )
}
