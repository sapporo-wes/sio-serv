import { Box, Container } from "@mui/material"
import Form from "@rjsf/mui"
import validator from "@rjsf/validator-ajv8"
import { useAuth } from "react-oidc-context"
import { useRecoilValue } from "recoil"

import AppFooter from "@/components/AppFooter"
import AppHeader from "@/components/AppHeader"
import CodeBlock from "@/components/CodeBlock"
import { convertToSchemaForForm } from "@/lib/configs"
import { uiTableAtom } from "@/store/configs"

export default function Home() {
  const auth = useAuth()
  const uiTable = useRecoilValue(uiTableAtom)
  const schemaForForm = convertToSchemaForForm(uiTable)

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppHeader />
      <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, justifyContent: "center" }}>
        <Form schema={schemaForForm} validator={validator} />
        <CodeBlock language="json" codeString={JSON.stringify(auth.user, null, 2)} />
      </Container>
      <AppFooter />
    </Box>
  )
}
