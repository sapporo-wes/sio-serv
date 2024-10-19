# Auth. Configurations

First, start and configure Keycloak as the OIDC authentication provider.

```bash
mkdir -m 777 ./keycloak-data
docker compose up -d keycloak
```

The settings for the Keycloak admin user are defined in [./compose.yml](./compose.yml) as shown below. Edit them if necessary.

```yaml
    environment:
      - KEYCLOAK_ADMIN=sio-serv-admin-user
      - KEYCLOAK_ADMIN_PASSWORD=sio-serv-admin-password
```

Next, open your browser and access `http://localhost:8080`, then log in using the Keycloak admin user credentials.

First, create a new realm by selecting `Create realm`.

![keycloak](https://hackmd.io/_uploads/SyvCBpqjR.png)

- `[Create realm]`
  - `Realm Name`: `sio-serv`

![keycloak](https://hackmd.io/_uploads/SJORrTqoR.png)

Next, create a new client under `Clients`.

![keycloak](https://hackmd.io/_uploads/rk-qPp5jC.png)

- `[Clients]`
  - `[Create client]`
    - `[General settings]`
      - `Client type`: `OpenID Connect`
      - `Client ID`: `sio-serv-app`
      - `Always display in UI`: `On`

![keycloak](https://github.com/user-attachments/assets/2a7ddc78-f164-4308-a51f-b858b6e88959)

- `[Clients]`
  - `[Create client]`
    - `[Capability config]`
      - `Client authentication`: `Off`
      - `Authorization`: `Off`
      - `Authentication flow`: `Standard flow`
- Notes:
  - Since an SPA (Single Page Application) cannot securely store client secrets, configure it as a Public Client (i.e., `Client authentication: Off`).
  - Proof Key for Code Exchange (PKCE) is automatically supported by Keycloak.

![keycloak](https://hackmd.io/_uploads/ryKVua5jR.png)

- `[Clients]`
  - `[Create client]`
    - `[Login settings]`
      - `Valid redirect URIs`: `http://localhost:3000/*`
      - `Valid post logout redirect URIs`: `http://localhost:3000/*`
      - `Web origins`: `http://localhost:3000`

![keycloak](https://hackmd.io/_uploads/BJeJ3acoC.png)

Next, in the Advanced settings of the created client, adjust the lifespans of tokens and sessions, and configure the PKCE method.

![keycloak](https://hackmd.io/_uploads/BJnhFysoR.png)

- `[Clients]`
  - `[Advanced]`
    - `[Advanced settings]`
      - `Access Token Lifespan`: `1 hour`
      - `Client Session Idle`: `3 hours`
      - `Client Session Max`: `1 day`
      - `Client Offline Session Idle`: `30 days`
      - `Proof Key for Code Exchange Code Challenge Method`: `S256`
- Notes:
  - Be sure to click the [Save] button below.

![keycloak](https://github.com/user-attachments/assets/aca3ff64-2357-44ec-84c8-eae0cfa2c083)

Also, create a user for login purposes within the realm.

![keycloak](https://hackmd.io/_uploads/BJE09ksoC.png)

- `[Users]`
  - `[Create user]`
    - `Email verified`: `On`
    - `Username`: `sio-serv-dev-user`
    - `Email`: `sio-serv-dev-user@example.com`
    - `First Name`: `Sio`
    - `Last Name`: `Serv`

![keycloak](https://hackmd.io/_uploads/r10xs3gx1g.png)

After that, set a password for the user.

![keycloak](https://hackmd.io/_uploads/SkRRsysiC.png)

- `[Users]`
  - `Credentials`
    - `Password`: `sio-serv-dev-password`
    - `Password Confirmation`: `sio-serv-dev-password`
    - `Temporary`: `Off`

![keycloak](https://hackmd.io/_uploads/ByaCiJijR.png)

Note that the user created here cannot access (or log in to) the current Keycloak Admin Console, as it belongs to a different realm.

## sapporo-service Auth. Configuration

The authentication settings for sapporo-service are defined in [./sapporo_config/auth_config.json](./sapporo_config/auth_config.json) as shown below.

```json
{
  "auth_enabled": true,
  "idp_provider": "external",
  "sapporo_auth_config": {
    "secret_key": "sapporo_secret_key_please_change_this",
    "expires_delta_hours": 24,
    "users": [
      {
        "username": "sapporo-dev-user",
        "password": "sapporo-dev-password"
      }
    ]
  },
  "external_config": {
    "idp_url": "<http://localhost:8080/realms/sio-serv>",
    "jwt_audience": "account",
    "client_mode": "public",
    "client_id": "sio-serv-app",
    "client_secret": "example-client-secret"
  }
}
```

If Keycloak is configured as described above, there is no need to edit this configuration.

For more information about this configuration file, please refer to the sapporo-service README: <https://github.com/sapporo-wes/sapporo-service?tab=readme-ov-file#authentication>.

## sio-serv Auth. Configuration

The authentication settings for sio-serv are defined in [./sapporo_config/auth_config.json](./sapporo_config/auth_config.json) as shown below.

```yaml
      - SIO_SERV_KEYCLOAK_REALM_URL=http://localhost:8080/realms/sio-serv
      - SIO_SERV_KEYCLOAK_CLIENT_ID=sio-serv-app
```

Once these settings are in place, let's start sio-serv and sapporo-service containers:

```bash
docker compose up -d --build app sapporo
docker compose exec -d app npm run dev
```

Open your browser and access `http://localhost:3000`. From the [Sign In] button at the top right, try logging in with `sio-serv-dev-user`.

![sio-serv](https://github.com/user-attachments/assets/16a2c0df-d242-475b-8a13-b1453582dcc1)

If no errors occur, the authentication setup for Keycloak, sio-serv, and sapporo-service is complete.

## MinIO Auth. Configuration

Currently, sio-serv does not support integration with MinIO, so configuring MinIO is not necessary at this time. You can skip this section.

For reference, a Japanese guide for MinIO configuration can be found at <https://hackmd.io/@suecharo/H1I5y65iR>.
