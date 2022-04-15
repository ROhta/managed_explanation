# 使用技術（Dockerfile未満）

## コンテナー・ネットワーク

- AWS ECS on Fargate
    - キャパシティープロバイダー戦略により、FARGATE_SPOTを最大限使用
- AWS ECR
    - イメージスキャン
    - ライフサイクルポリシー設定
- AWS Application Load Balancer
- AWS Cloud Map
- AWS Route53
    - DNS SEC署名有効化
- AWS Firelens
- AWS App Mesh
    - VPC内通信もTLS有効化
- AWS NetworkFirewall
