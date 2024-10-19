# Tests

- test files:
  - <https://raw.githubusercontent.com/sapporo-wes/sapporo-service/main/tests/resources/cwltool/trimming_and_qc_packed.cwl>
  - <https://raw.githubusercontent.com/sapporo-wes/sapporo-service/main/tests/resources/cwltool/ERR034597_1.small.fq.gz>
  - <https://raw.githubusercontent.com/sapporo-wes/sapporo-service/main/tests/resources/cwltool/ERR034597_2.small.fq.gz>

```bash=
# At the root of the repository
npm run schema-to-ui-table -- -i ./tests/wf-params-schema.json -o ./tests/ui-table.csv
npm run validate-ui-table -- -w ./tests/wf-params-schema.json -u ./tests/ui-table.csv -r ./tests/run-request.json

npm run schema-to-ui-table -- -i ./tests/wf-params-schema-nf-core-sarek.json -o ./tests/ui-table-nf-core-sarek.csv
npm run validate-ui-table -- -w ./tests/wf-params-schema-nf-core-sarek.json -u ./tests/ui-table-nf-core-sarek.csv -r ./tests/run-request.json
```

`compose.yml`:

```yaml=
      - SIO_SERV_WF_PARAMS_SCHEMA_FILE=/app/tests/wf-params-schema.json
      - SIO_SERV_UI_TABLE_FILE=/app/tests/ui-table.csv
```
