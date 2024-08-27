import { Button } from "@mui/material"
import { SxProps } from "@mui/system"
import { useAuth } from "react-oidc-context"
import AppHeaderBase from "@/components/AppHeaderBase"

export interface AppHeaderProps {
  sx?: SxProps
}

export default function AppHeader({ sx }: AppHeaderProps) {
  const auth = useAuth()

  return (
    <AppHeaderBase
      sx={sx}
      rightContent={
        auth.isAuthenticated ? (
          <Button
            variant="outlined"
            sx={{
              color: "white",
              textTransform: "none",
              border: "1px solid white",
            }}
            children="Sign Out"
            onClick={() => auth.removeUser()}
          />
        ) : (
          <Button
            variant="outlined"
            sx={{
              color: "white",
              textTransform: "none",
              border: "1px solid white",
            }}
            children="Sign In"
            onClick={() => auth.signinRedirect()}
          />
        )
      }
    />
  )
}
