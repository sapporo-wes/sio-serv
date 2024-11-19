// https://rjsf-team.github.io/react-jsonschema-form/docs/advanced-customization/
// Widgets correspond to HTML tags (e.g., input, select).
// A field contains one or more widgets (it represents a row in the form, including a label).
// Modifying fields is costly (in practice, MUI does not modify fields).
// Therefore, we modify the template instead.
// https://github.com/rjsf-team/react-jsonschema-form/tree/main/packages/mui/src
// Copy the implementation from here and make changes only where necessary.

import { withTheme, ThemeProps } from "@rjsf/core"
import { Theme as MuiTheme } from "@rjsf/mui"

import BaseInputTemplate from "@/components/Form/BaseInputTemplate"
import CheckboxWidget from "@/components/Form/CheckboxWidget"
import DescriptionField from "@/components/Form/DescriptionField"
import FieldTemplate from "@/components/Form/FieldTemplate"
import ImputationPanelWidget from "@/components/Form/ImputationPanelWidget"

const Theme: ThemeProps = {
  // @ts-expect-error: templates never to be undefined
  templates: Object.assign(MuiTheme.templates, {
    BaseInputTemplate,
    DescriptionFieldTemplate: DescriptionField,
    FieldTemplate,
  }),
  // @ts-expect-error: templates never to be undefined
  widgets: Object.assign(MuiTheme.widgets, {
    CheckboxWidget,
    ImputationPanelWidget,
  }),
  fields: {},
}

const Form = withTheme(Theme)

export default Form
