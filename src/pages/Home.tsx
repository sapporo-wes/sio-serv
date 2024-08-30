import { Box, Container } from "@mui/material"
import AppFooter from "@/components/AppFooter"
import AppHeader from "@/components/AppHeader"
import CodeBlock from "@/components/CodeBlock"
import { useAuth } from "react-oidc-context"
import { useRecoilValue } from "recoil"
import { uiTableAtom } from "@/store/configs"
import { convertToSchemaForForm } from "@/lib/configs"
import Form from "@rjsf/mui"
import validator from "@rjsf/validator-ajv8"

export default function Home() {
  const auth = useAuth()
  const uiTable = useRecoilValue(uiTableAtom)
  const schemaForForm = convertToSchemaForForm(uiTable)

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppHeader />
      <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, justifyContent: "center" }}>
        {auth.isAuthenticated ? (
          <>
            <h1>Auth Object の中身</h1>
            <CodeBlock language="json" codeString={JSON.stringify(auth.user, null, 2)} />
          </>
        ) : (
          <>
            <h1>Home</h1>
            <Form schema={schemaForForm} validator={validator} />
          </>
        )}
      </Container>
      <AppFooter />
    </Box>
  )
}
