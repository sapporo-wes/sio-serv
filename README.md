# sio-serv

`sio-serv` is a service that provides a user-friendly web interface for executing workflows via Workflow Execution Service (WES).

## Overview

Recently, workflow languages (e.g., CWL, Nextflow) and APIs like the GA4GH Workflow Execution Service (WES) have become integral parts of the stack for managing and executing complex workflows. However, it has become clear that these technologies alone are insufficient to provide a user-friendly interface for end users. The primary input for workflow languages (also engines) is typically a JSON formatted file referred to as "workflow parameters." Editing or inputting this JSON directly can be challenging for end users, and repeatedly modifying these JSON files for batch processing, where only some parameters differ, is cumbersome and inefficient

sio-serv aims to address these challenges. Since workflow parameters are represented in JSON, the corresponding JSON Schema can be used to generate web forms through tools like react-jsonschema-form. Taking this concept further, sio-serv follows a flow of transforming `workflow parameters -> JSON Schema -> UI Schema (table format) -> Web Form`, introducing an intermediate representation called UI Schema. This UI Schema allows admins to create more user-friendly web forms tailored to end users' needs, offering more control and customization compared to automatically generated forms from JSON Schema alone. Additionally, sio-serv implements a mechanism where batch processes can be defined in a table format. This table-based configuration is then internally converted into the necessary JSON workflow parameters, streamlining the execution of multiple jobs by simplifying the input process for users.

sio-serv integrates four components:

- sio-serv (Single Page Application, SPA)
- sapporo-service (Workflow Execution Service, WES)
- MinIO (S3-compatible object storage)
- Keycloak (OIDC authentication provider)

These components are integrated to enable seamless workflow execution, secure storage, and user authentication. Below is a combined diagram illustrating the concept and architecture of this integration.

![sio-serv-arch](https://github.com/user-attachments/assets/8e8a25b4-2a49-4a65-bda8-e1e2c3fd5c58)

## Quickstart

Unfortunately, setting up sio-serv isn't something you can just do in a few clicks, but don't worry---we've laid out everything you need in the "Full Deployment Guide" section below.

## Full Deployment Guide

This guide explains how to deploy sio-serv on `localhost` using Docker. For a production deployment, additional environment-specific configurations, such as DNS and reverse proxy settings, may be required. However, by adjusting the appropriate configuration values, deployment to these environments should be achievable.

### Generating and Configuring the UI Schema

TODO

### Auth. Setup for Keycloak/MinIO/sapporo-service

- <https://hackmd.io/@suecharo/H1I5y65iR>

### Final Steps

TODO

## License

sio-serv is licensed under the Creative Commons Attribution 4.0 International license (CC-BY 4.0). See the [LICENSE](./LICENSE) file for details.
All rights reserved by the Graduate School of Medicine and School of Medicine, Chiba University.
