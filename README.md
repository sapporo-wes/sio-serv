# sio-serv

## Discussion and FAQ

- なぜ、jsonschema から直接 UI を生成しないのか
  - それも可能だが、これまでの経験から考えると、自動生成した form は多くの場合、nest が深かったりなどして、使い勝手が悪いことが多い。
  - 限定的だが、ある程度 UI を制御するために、一度 admin によって edit される table を jsonschema から生成することにしている。
  - もちろん、この jsonschema -> table 時に、情報量や表現力が落ちることを考慮しなければならない。

## License

This project is licensed under the Creative Commons Attribution 4.0 International license (CC-BY 4.0).
See the [LICENSE](./LICENSE) file for details.
All rights reserved by the Graduate School of Medicine and School of Medicine, Chiba University.
