// https://github.com/rjsf-team/react-jsonschema-form/blob/main/packages/mui/src/CheckboxWidget/CheckboxWidget.tsx

import { colors } from "@mui/material"
import Box from "@mui/material/Box"
import Checkbox from "@mui/material/Checkbox"
import FormControlLabel from "@mui/material/FormControlLabel"
import {
  ariaDescribedByIds,
  descriptionId,
  getTemplate,
  labelValue,
  schemaRequiresTrueValue,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  WidgetProps,
} from "@rjsf/utils"
import { FocusEvent } from "react"

/** The `CheckBoxWidget` is a widget for rendering boolean properties.
 *  It is typically used to represent a boolean.
 *
 * @param props - The `WidgetProps` for this component
 */
export default function CheckboxWidget<
  T = any, // eslint-disable-line
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any, // eslint-disable-line
>(props: WidgetProps<T, S, F>) {
  const {
    schema,
    id,
    value,
    disabled,
    readonly,
    label = "",
    hideLabel,
    autofocus,
    onChange,
    onBlur,
    onFocus,
    registry,
    options,
    uiSchema,
  } = props
  const DescriptionFieldTemplate = getTemplate<"DescriptionFieldTemplate", T, S, F>(
    "DescriptionFieldTemplate",
    registry,
    options,
  )
  // Because an unchecked checkbox will cause html5 validation to fail, only add
  // the "required" attribute if the field value must be "true", due to the
  // "const" or "enum" keywords
  const required = schemaRequiresTrueValue<S>(schema)

  const _onChange = (_: any, checked: boolean) => onChange(checked) // eslint-disable-line
  const _onBlur = ({ target }: FocusEvent<HTMLButtonElement>) => onBlur(id, target && target.value)
  const _onFocus = ({ target }: FocusEvent<HTMLButtonElement>) => onFocus(id, target && target.value)
  const description = options.description ?? schema.description

  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            id={id}
            name={id}
            checked={typeof value === "undefined" ? false : Boolean(value)}
            required={required}
            disabled={disabled || readonly}
            autoFocus={autofocus}
            onChange={_onChange}
            onBlur={_onBlur}
            onFocus={_onFocus}
            aria-describedby={ariaDescribedByIds<T>(id)}
          />
        }
        label={labelValue(label, hideLabel, false)}
      />
      {!hideLabel && !!description && (
        <Box sx={{ ml: "2rem", color: colors.grey[600] }}>
          <DescriptionFieldTemplate
            id={descriptionId<T>(id)}
            description={description}
            schema={schema}
            uiSchema={uiSchema}
            registry={registry}
          />
        </Box>
      )}
    </>
  )
}
