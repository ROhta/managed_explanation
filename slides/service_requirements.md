# サ－ビス概要

非機能要件

- 別VPCのRDSを操作する
- 認証・認可 <bi-arrow-right-square-fill /> OIDC
  - 製品アクセスの有無により、ユーザプールを分割する
- マイクロサービスの開発・運用を効率化する
  - 冪等性の考慮
    - 分散トランザクション管理をなるべくやらない <bi-arrow-right-square-fill /> Sagaパターンの実装が不要なアーキテクチャを考える
  - アプリケーションでの処理をビジネスロジックに集中させる <typcn-equals /> ビジネスロジック以外の処理はなるべくAWSのマネージドサービスで行う
    - ログ振分け・サーキットブレイカー・セキュリティ対策等

<v-click>

- **セキュリティ最重視**
  - **各種ファイアウォール**
  - **AWSアカウント自体の管理**

</v-click>
