# Tests

- test files:
  - <https://raw.githubusercontent.com/sapporo-wes/sapporo-service/main/tests/resources/cwltool/trimming_and_qc_packed.cwl>
  - <https://raw.githubusercontent.com/sapporo-wes/sapporo-service/main/tests/resources/cwltool/ERR034597_1.small.fq.gz>
  - <https://raw.githubusercontent.com/sapporo-wes/sapporo-service/main/tests/resources/cwltool/ERR034597_2.small.fq.gz>

```bash=
# At the root of the repository
npm run schema-to-table -- -i ./tests/wf-params-schema.json -o ./tests/ui-table.tsv
```
