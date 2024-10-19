# sio-serv

`sio-serv` is a service that provides a user-friendly web interface for executing workflows via Workflow Execution Service (WES).

## Overview

Recently, workflow languages (e.g., CWL, Nextflow) and APIs like the GA4GH Workflow Execution Service (WES) have become integral parts of the stack for managing and executing complex workflows. However, it has become clear that these technologies alone are insufficient to provide a user-friendly interface for end users. The primary input for workflow languages (also engines) is typically a JSON formatted file referred to as "workflow parameters." Editing or inputting this JSON directly can be challenging for end users, and repeatedly modifying these JSON files for batch processing, where only some parameters differ, is cumbersome and inefficient

sio-serv aims to address these challenges. Since workflow parameters are represented in JSON, the corresponding JSON Schema can be used to generate web forms through tools like react-jsonschema-form. Taking this concept further, sio-serv follows a flow of transforming `workflow parameters -> JSON Schema -> UI Schema (table format) -> Web Form`, introducing an intermediate representation called UI Schema. This UI Schema allows admins to create more user-friendly web forms tailored to end users' needs, offering more control and customization compared to automatically generated forms from JSON Schema alone. Additionally, sio-serv implements a mechanism where batch processes can be defined in a table format. This table-based configuration is then internally converted into the necessary JSON workflow parameters, streamlining the execution of multiple jobs by simplifying the input process for users.

sio-serv integrates four components:

- sio-serv (Single Page Application, SPA)
- [sapporo-service](https://github.com/sapporo-wes/sapporo-service) (Workflow Execution Service, WES)
- [MinIO](https://min.io) (S3-compatible object storage)
- [Keycloak](https://www.keycloak.org) (OIDC authentication provider)

These components are integrated to enable seamless workflow execution, secure storage, and user authentication. Below is a combined diagram illustrating the concept and architecture of this integration.

![sio-serv-arch](https://github.com/user-attachments/assets/8e8a25b4-2a49-4a65-bda8-e1e2c3fd5c58)

## Quickstart

Unfortunately, setting up sio-serv isn't something you can just do in a few clicks, but don't worry---we've laid out everything you need in the "Full Deployment Guide" section below.

## Full Deployment Guide

This guide explains how to deploy sio-serv on `localhost` using Docker. For a production deployment, additional environment-specific configurations, such as DNS and reverse proxy settings, may be required. However, by adjusting the appropriate configuration values, deployment to these environments should be achievable.

First, create the Docker network:

```bash
docker network create sio-serv-network
```

### Auth. Configurations

This section covers the authentication setup using Keycloak. For detailed instructions, please refer to the separate document: [./auth-configurations.md](./auth-configurations.md).

### sio-serv Configurations

Three configuration files for specifying which and how workflow to execute in `sio-serv` are defined in [./compose.yml](./compose.yml).

```yaml
      - SIO_SERV_WF_PARAMS_SCHEMA_FILE=/app/tests/wf-params-schema.json
      - SIO_SERV_UI_TABLE_FILE=/app/tests/ui-table.csv
      - SIO_SERV_RUN_REQUEST_FILE=/app/tests/run-request.json
```

Each file serves a specific purpose:

- **Workflow Parameters Schema File**
  - A JSON Schema for the parameters of the workflow to be executed.
  - `SIO_SERV_WF_PARAMS_SCHEMA_FILE`
- **UI Table File**
  - A file that defines the display of the Web Form.
  - `SIO_SERV_UI_TABLE_FILE`
- **Run Request File**
  - A JSON file for the Sapporo run request.
  - Contains information about the workflow document to execute, as well as the workflow engine.
  - `SIO_SERV_RUN_REQUEST_FILE`

#### Workflow Parameters Schema File

As an example of a workflow parameters schema file, [./tests/wf-params-schema.json](./tests/wf-params-schema.json) is provided.

This file typically needs to be written manually.
However, if you are using a workflow from [nf-core](https://nf-co.re), files like [GitHub - nf-core/sarek - nextflow_schema.json](https://github.com/nf-core/sarek/blob/3.4.4/nextflow_schema.json) are available in the respective workflow repositories.
For CWL workflows, you can use tools like `cwl-inputs-schema-gen` of [cwl-utils](https://github.com/common-workflow-language/cwl-utils) to automatically generate the schema.

Note that the current version of `sio-serv` does not support complex JSON Schemas.
For example, features like `oneOf` and `anyOf`, or references using `$ref`, are not supported.
Additionally, specifying `type` as `[ "string", "null" ]` is also not supported.

#### UI Table File

Please refer to the diagram in the "Overview" section for the flow of generating and editing the UI Table File.

To generate the UI Table File, use the following commands:

```bash
$ docker compose exec app bash

# Inside the app container
$ npm run schema-to-ui-table -- --help

> sio-serv@0.1.0 schema-to-ui-table
> tsx ./src/cli/schemaToUITable.ts --help

Usage: schema-to-ui-table [OPTIONS]

Options:
  -i, --input <file>     Input workflow params schema file (required)
  -o, --output <file>    Output UI table file (default: ui-table.csv)
  -f, --format <format>  Output format: csv or tsv (default: csv)
  -p, --pipe             Write output to stdout
  -h, --help             Show this help message and exit

Examples:
  schema-to-ui-table -i wf-params-schema.json -o ui-table.csv
  schema-to-ui-table --input=wf-params-schema.json --pipe --format=tsv
```

Edit the CSV/TSV file generated by the `schema-to-ui-table` command to create the UI Table File.

A command is also available to validate all the files:

```bash
# Inside the app container
$ npm run validate-ui-table -- --help

> sio-serv@0.0.0 validate-ui-table
> tsx ./src/cli/validateUITable.ts --help

Usage: validate-ui-table [OPTIONS]

Options:
  -w, --wf-params-schema <file>   Workflow params schema file (required)
  -u, --ui-table <file>           UI table file (required)
  -r, --run-request <file>        Run request file
  -h, --help                      Show this help message and exit

Examples:
  validate-ui-table -w wf-params-schema.json -u ui-table.csv
  validate-ui-table --wf-params-schema=wf-params-schema.json --ui-table=ui-table.csv --run-request=run-request.json
```

#### Run Request File

The Run Request File is a JSON file that is sent directly to sapporo-service as a run request.
Examples of this file are provided as [./tests/run-request.json](./tests/run-request.json) and [./tests/run-request.min.json](./tests/run-request.min.json).

The structure of this file is as follows:

```typescript
interface FileObject {
  file_name: string
  file_url: string
}

export interface SprRunRequestFile {
  workflow_type: string
  workflow_type_version?: string | null
  workflow_engine: string
  workflow_engine_version?: string | null
  workflow_engine_parameters?: Record<string, string> | null
  workflow_url: string
  workflow_attachment_obj?: FileObject[] | null
  tags?: Record<string, string> | null
}
```

For more details, you may also refer to the Sapporo API specification at [SwaggerUI - sapporo-wes-2.0.0](https://petstore.swagger.io/?url=https://raw.githubusercontent.com/sapporo-wes/sapporo-service/main/sapporo-wes-spec-2.0.0.yml).

## License

sio-serv is licensed under the Creative Commons Attribution 4.0 International license (CC-BY 4.0). See the [LICENSE](./LICENSE) file for details.
All rights reserved by the Graduate School of Medicine and School of Medicine, Chiba University.
