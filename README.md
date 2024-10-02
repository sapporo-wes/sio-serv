# sio-serv

- <https://hackmd.io/@suecharo/H1I5y65iR>
  - 各認証系の設定法方

## Development

```bash=
$ mkdir keycloak-data
$ chmod 777 keycloak-data/

docker network create sio-serv-network
docker compose -f compose.dev.yml up -d --build
docker compose -f compose.sapporo.yml up -d
docker compose -f compose.keycloak.yml up -d
docker compose -f compose.minio.yml up -d

docker compose -f compose.dev.yml exec app npm run dev
```

## Discussion and FAQ

- なぜ、jsonschema から直接 UI を生成しないのか
  - それも可能だが、これまでの経験から考えると、自動生成した form は多くの場合、nest が深かったりなどして、使い勝手が悪いことが多い。
  - 限定的だが、ある程度 UI を制御するために、一度 admin によって edit される table を jsonschema から生成することにしている。
  - もちろん、この jsonschema -> table 時に、情報量や表現力が落ちることを考慮しなければならない。

## Routing

<!-- [TODO]: 考え中 -->

それぞれ、domain を取ってさばくことを想定している。

しかし、開発時は /etc/hosts にそれぞれ、docker の default bridge の IP を設定しておき、traefik でリクエストを振り分けることを想定している。

- app: sio-serv-app
- sapporo: sio-serv-sapporo
- keycloak: sio-serv-keycloak
- minio: sio-serv-minio

```
$ docker network inspect bridge | jq .[0].IPAM.Config[0].Gateway
"172.17.0.1"

$ cat /etc/hosts
172.17.0.1 sio-serv-app
172.17.0.1 sio-serv-sapporo
172.17.0.1 sio-serv-minio
172.17.0.1 sio-serv-keycloak
```

## License

This project is licensed under the Creative Commons Attribution 4.0 International license (CC-BY 4.0).
See the [LICENSE](./LICENSE) file for details.
All rights reserved by the Graduate School of Medicine and School of Medicine, Chiba University.
