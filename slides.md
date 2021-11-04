---
theme: shibainu
class: 'text-center'
highlighter: prism
lineNumbers: true
info: |
    # ユーザ管理画面開発
drawings:
    persist: false
---

# ユーザ管理画面開発説明

---
layout: quote
---

激しい開発を経て、プロダクト本体はリリースされた。

しかし利用ユーザや企業の登録・更新・削除処理は、未だエンジニアの手作業で行われていた。

導入企業・ユーザ数が伸びるにつれ、その負荷も指数関数的に増大していた。

これは、トイル撲滅のため立ち上がった男達の物語である。

---
layout: quote
---

<img src="/img/beginning.jpg" class="container mx-auto">

---
layout: default-5
---

# 目次

- サービス概要
- 開発の進め方
- 使用技術（Dockerfile以上）
- 使用技術（Dockerfile未満）
- 今後

---
layout: section-2
---

# サ－ビス概要

---

# サ－ビス概要

機能要件

- ユーザ・企業・接続元IPリストのCRUDをする
- ユーザを作る権限を持った企業外ユーザ（販売代理店等）を管理する

<v-click>

機能要件だけ見るとチュートリアルに毛が生えた程度

</v-click>
---

# サ－ビス概要

非機能要件

- 別VPCのRDSを操作する
- 認証・認可 <bi-arrow-right-square-fill /> OIDC
    - 製品アクセスの有無により、ユーザプールを分割する
- マイクロサービスの開発・運用を効率化する
    - 冪等性の考慮
        - 分散トランザクション管理をなるべくやらない <bi-arrow-right-square-fill /> Sagaパターンの実装が不要なアーキテクチャを考える
    - アプリケーションでの処理をビジネスロジックに集中させる <typcn-equals /> ビジネスロジック以外の処理はなるべくインフラで実装する
        - ログ振分け・サーキットブレイカー等
- セキュリティ最重視
    - WAF
    - AWSアカウント自体の管理

---
layout: section-2
---
# 開発の進め方

---

# [GitHub Beta Projects](https://github.com/features/issues/)で管理

Discussions <bi-arrow-right-square-fill /> Issues <bi-arrow-right-square-fill /> Pull Requestsの流れが最高

<v-click>

- Discussions : とりあえずの提案・バグか仕様か分からないので質問、等

<img src="/img/github_discussions.png" width= "450">

</v-click>
<v-click>

- Issues : やることが決定したもの

</v-click>
<v-click>

- Pull Requests : 実装のレビュー

</v-click>
<v-click>

- テンプレートを設置し、ボタンでIssuesの複数テンプレートを使い分ける

<img src="/img/github_issue_template.png" width= "450">

</v-click>


---

# [GitHub Beta Projects](https://github.com/features/issues/)で管理

複数リポジトリのIssuesを一覧化

<img src="/img/github_project.png" width= "650">

<v-click>

- 各マイクロサービスのリポジトリを1つ1つ見に行く必要がない
- カスタムフィールドでPriorityを追加
- Priority毎にグループ分けして表示

</v-click>

---

# [GitHub Beta Projects](https://github.com/features/issues/)で管理

<div class="grid grid-cols-[35%,65%] gap-4">
    <div>
        <p>JIRAのように扱うため、<br/>labelsで機能補完</p>
        <p>closed, blocked by等、<br/>チケット間の関係性を表現</p>
        <p>sortが奇麗になるよう、<br/>bug, enhance等の接頭辞を付与</p>
        <p>色の並びにも気を配った</p>
    </div>
    <img src="/img/github_labels.png" width="500">
</div>

---
layout: section-2
---

# 使用技術<br/>（Dockerfile以上）
---

# 使用技術（Dockerfile以上）

|     |     |
| --- | --- |
| <kbd>frontend</kbd> | <img src="/img/typescript.svg" width="70" class="inline-block p-4"><img src="/img/next.js.svg" width="100" class="inline-block p-4"><img src="/img/material_ui.svg" width="160" class="inline-block p-4">|
| <kbd>backend</kbd> | <img src="/img/rust.svg" width="80" class="inline-block p-4"><img src="/img/actixweb.jpg" width="150" class="inline-block p-4"> |
| <kbd>CI/CD</kbd> | <img src="/img/github_actions.svg" width="100"> |
| <kbd>認証・認可</kbd> | <img src="/img/auth0.svg" width="100"> |

---

# 使用技術（Dockerfile以上）

|     |     |
| --- | --- |
| <kbd>frontend</kbd> | SSRに対応 |
| <kbd>backend</kbd> | DDD指向・オニオンアーキテクチャで実装<br/>リソースAPIではトークン検証処理を行う |
| <kbd>CI/CD</kbd> | [aws謹製のGithub Actions](https://github.com/aws-actions)で実装 |
| <kbd>認証・認可</kbd> | OIDCに則って各APIを構築 ・ [Organizations](https://auth0.com/docs/organizations)機能を使用（予定） |

---

# 開発秘話（frontend）

- 元々の構成は<img src="/img/react.svg" width="200" class="inline-block p-4"><whh-plus /><img src="/img/vite.svg" width="100" class="inline-block p-4">
- ユーザのロースペックなPC環境を考慮してSSR化を検討。<img src="/img/next.js.svg" width="150" class="inline-block p-4">に。
    - vite.jsの構成から、next.jsの構成に移すのが大変だった
    - ググってもjsの記事しか出てこない。tsの型指定が辛い。

---

# 開発秘話（backend）

rustの型制約が激しい

- アプリケーションレイヤーでもセキュリティを高める必要があり、<img src="/img/rust.svg" width="80" class="inline-block p-4">採用
    - 異様に強い型制約、メモリ安全が魅力
    - ロギング、トークン検証等をモジュール化し、アスペクト指向プログラミングを実施

<v-click>

- とはいえ、型制約が激しくてビルドが通らない。。。
    - MySQLのテーブルでbool値を格納するカラムがtinyint(1)で作成されていた
    - が、Rust側でintを指定すると、ビルドエラー

</v-click>

<v-click>

- [Rust公式](https://docs.rs/sqlx/0.3.5/sqlx/mysql/types/index.html)によると、MySQLのtinyint(1)はRustではbool型と扱う、とのこと
    - MySQL`int(11) unsigned `とRust`u16` であればエラーだが、MySQL`int(11) unsigned `とRust`u32` はエラーにならない

</v-click>

---

# 開発秘話（backend）

DDD

- オニオンアーキテクチャを以下のように実装した
    - ドメインモデル層: このシステムで扱うべき関心事
    - ドメインサービス層: ドメインモデルのビジネスロジックを定義。アプリケーションサービス層から利用される共通ロジックを提供。
    - アプリケーションサービス層: ユーザとの接点（エンドポイント等）を定義
    - インフラストラクチャ層: 外部ライブラリ、DB等の接続

<v-click>

- 実装したモジュールをどの層に置くか
    - SQL文の記述、AWS SDKはインフラストラクチャ層に。ドメインモデリングを阻害しないようにする。
    - トークン検証はアプリケーションサービス層
        - エンドポイント毎に検証スコープの範囲が違うため、ビジネスロジックにも思える
        - アプリケーション固有の処理だが、ドメインに関する処理ではないので、アプリケーションサービス層に配置した

</v-click>

---

# 開発秘話（backend）

やっぱりrustの型制約が激しい

- 型制約が激しくてDIが辛い。。。
    - [goでinterface型を使う](https://qiita.com/hirotakan/items/698c1f5773a3cca6193e#interfacesdatabase--frameworks--drivers%E3%83%AC%E3%82%A4%E3%83%A4%E3%83%BC)ような逃げ道がない。
    - 依存関係を逆転しきれないことも。

---

# 開発秘話（backend）

トークン検証

- TODO

---
layout: section-2
---

# 使用技術<br/>（Dockerfile未満）

---
# 使用技術（Dockerfile未満）

## コンテナー・ネットワーク

---

# 使用技術（Dockerfile未満）

## コンテナー・ネットワーク

- AWS ECS on Fargate
    - キャパシティープロバイダー戦略を設定し、FARGATE_SPOTを最大限使用
- AWS ECR
    - イメージスキャン
    - ライフサイクルポリシー設定
- AWS Application Load Balancer
- AWS Firelens
- AWS Cloud Map
- AWS Route53
    - DNS SEC署名有効化
- AWS App Mesh
    - VPC内通信もTLS有効化

---
src: ./slides/real_resources.md
---
---

# ログ設計

- リクエストの流れを追いやすい設計にする
    - 1つのリクエストに対して、全ノードのログを一ヶ所で見たい
    - frontendのロググループを見て、次はbackendのログを見て、というログ設計はやめる

<v-click>

## [firelens](https://dev.classmethod.jp/articles/aws-fargate-with-firelens-minimum/)

- awsがマネージドサービス用にカスタマイズしたfluent bit
- log_routerコンテナーをサイドカー構成でecsタスクに同梱し、任意の場所にログ送信
    - たとえば、envoyのアクセスログはs3へ、アプリケーションログはCloudwatch Logsへ、アクセスログのうち特定のクライアントからのログのみkinesis data firehose経由でAmazon OpenSearchへ等
- 試されるfluent bit力
    - 全ログをとりあえずcloudwatch logsに出力中
    - Datadogにも出力して、可視性・一覧性を追求する

</v-click>

---

# 開発秘話

firelens


- 今回の場合では、設定ファイル無しでfirelensを使える
    - [ブログ](https://dev.classmethod.jp/articles/fargate-fiirelens-fluentbit/)を漁ると、タスク定義とは別にfluent bitの設定ファイルを用意する、という記事ばかりヒットする
        - s3に配置する、設定ファイルをコンテナー内で読み込むようにDockerfileを編集する、等
        - 管理コスト。。。

<v-click>

- ログ出力先が一ヶ所の場合のみ、タスク定義に記載したオプションを設定値としてfluent bitに渡せる

</v-click>

---

# 開発秘話

firelens

- log_routerコンテナー自体のログ（Cloudwatch Logs）にDataAlreadyAcceptedExceptionエラーが出力され続ける
    - `The given batch of log events has already been accepted. The next batch can be sent with sequenceToken`のメッセージが、ECSタスクがリクエストを受け付ける毎に記録される
    - [Cloudwatch LogsのsequenceTokenは被っていなかった](https://michimani.net/post/use-cloudwatch-via-aws-cli/)
    - 原因は、log_routerコンテナーのデフォルト値と自分で設定した値の競合だった
        - aws製fluent bitコンテナーは、[このような値](https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/firelens-taskdef.html)を無条件設定する
        - [fluent bit公式](https://docs.fluentbit.io/manual/pipeline/outputs/cloudwatch)を参考に、タスク定義のlogConfigurationで`"Match": "*"` を設定した
        - Matchパラメーターが複数設定され、ログの二重送信をCloudWatch Logsが拒否した結果、DataAlreadyAcceptedExceptionエラーが発生していた
    - AWSサポートに問い合わせて、解決まで2か月かかった。。。


---
src: ./slides/real_resources.md
---
---
src: ./slides/virtual_resources.md
---

---

# サービスメッシュ

- AWS App Mesh採用
    - 選択肢はApp Mesh, Istio, Linkerdだった
    - Istioほどの機能は不要
    - とにかくメンテしたくない
- envoyコンテナーをサイドカー構成でecsタスクに同梱した
- ingressアクセスをサービスメッシュで管理できるように、仮想ゲートウェイを構築した
- EKS移行後にLinkerdを検討予定
    - [k8sが前提のツールなため](https://servicemesh.es)
    - [envoyじゃない](https://linkerd.io/2020/12/03/why-linkerd-doesnt-use-envoy/)メリデメを考える

---

# 開発秘話（App Mesh）

マネコンで設定すると、誤ったデフォルト値が強制挿入される

<v-click>

- AWSマネジメントコンソールでタスク定義を作成する際、App Mesh統合の有効化にチェックを入れると、App Meshで用いるenvoyイメージや必要な設定が自動挿入される
    - envoyコンテナーに環境変数`APPMESH_VIRTUAL_NODE_NAME`が挿入される

</v-click>
<v-click>

- 東京リージョンで自動設定されるイメージバージョンは`v1.19.1.0-prod`だったが、[公式](https://docs.aws.amazon.com/ja_jp/app-mesh/latest/userguide/envoy-config.html)によると、1.15.0以上では環境変数`APPMESH_RESOURCE_ARN`が必要
    - バージョン1.19.1のイメージに`APPMESH_VIRTUAL_NODE_NAME`を追加すると、挙動が不安定になった
        - `APPMESH_VIRTUAL_NODE_NAME`と`APPMESH_RESOURCE_ARN`を両方追加すると、envoyからappへの通信がconnection errorとなった

</v-click>
<v-click>

- さらに、App Mesh統合の有効化をチェックして、`APPMESH_VIRTUAL_NODE_NAME`を削除すると、エラーでタスク定義の保存に失敗する
    - App Mesh統合の有効化のチェックを外したうえで、`APPMESH_RESOURCE_ARN`のみが追加されるように、タスク定義のJSONを手で書くしかなかった

</v-click>

---

# 開発秘話（App Mesh）

朝見てみたら、仮想ゲートウェイの起動失敗タスクが500以上。。。。。

<div class="grid grid-cols-[47%,53%] gap-4"><div><v-click>

- 原因は、appのヘルスチェックエンドポイントのステータスコードが200以外だったこと

</v-click>
<v-click>

- 通信経路は以下
    1. Route53ホストゾーン
    2. ALB
    3. ターゲットグループ
    4. 仮想ゲートウェイのenvoyコンテナー
    5. 仮想サービス
    6. 仮想ルーター
    7. 仮想ノードのenvoyコンテナー
    8. 仮想ノードのappコンテナー

</v-click>
</div>
<div><v-click>

- mesh内通信でステータスコードは書き換えられない <br/><typcn-equals /> ターゲットグループの受け取るステータスコードはappのもの

</v-click>
<v-click>

- 200以外のステータスコードをターゲットグループが受け取ると、自身のヘルスチェックに失敗するため、仮想ゲートウェイにSIGTERMが送信される

</v-click>
<v-click>

- タスクにつき1コンテナーの起動だったため、仮想ゲートウェイのenvoyコンテナーが停止してタスク数が0になる

</v-click>
<v-click>

- ECSサービスで最低タスク数を1と設定したため、新たなタスクが立ち上がる

</v-click>
</div></div>

---

# 開発秘話（App Mesh）

朝見てみたら、仮想ゲートウェイの起動失敗タスクが500以上。。。。。

<img src="/img/mugen.jpg" width="800">

---

# 開発秘話（App Mesh）

http2対応できない

- actix webのAPI群への通信をhttp2にしたかったので、[公式](https://actix.rs/docs/http2/)にしたがってtls暗号化し、appをhttp2対応させた
- が、`upstream connect error or disconnect/reset before headers. reset reason: connection termination`というenvoyのエラーが出力される

<v-click>

- awsサポート回答によると、↓とのこと
    - [http2は、tls必須ではない](https://qiita.com/kitauji/items/3bf03533895251c93af2#httpsh2-%E3%81%A8-httph2c)
    - envoyへの通信とenvoy app間のプロトコルは一致させなければならない。envoyへはhttp2、envoy app間はhttp1.1というのはできない。
    - envoy app間をtls暗号化すると、app meshのコントロールプレーンが通信を補足できない
    - appはtls暗号化せずhttp2対応しなくてはならない

</v-click>

---

# 開発秘話（App Mesh）

http2対応できない

- [actix webの公式](https://actix.rs/docs/http2/)を見ても、tls暗号化せずにhttp2化する方法が見つからない。`actix-web automatically upgrades connections to HTTP/2 if possible.`と書いてはあるが、tls暗号化しないとactix webはhttp2にならなかった。

<v-click>

- actix webをtls暗号化せずにhttp2対応させる術が見つからず、app meshでのhttp2対応は諦めるという結論になった

</v-click>

---
src: ./slides/virtual_resources.md
---
layout: default-5
---

# ECSタスク

- 各ECSサービスはタスクに以下のコンテナーを持つ
    - log_router
    - envoy
    - datadog agent（予定）
    - app

<v-click>

- 管理するコンテナーはappだけ
    - 仮想ゲートウェイのタスクはappコンテナー無し

</v-click>
<v-click>

- ecs execで各コンテナー内にssmできるよう設定済み

</v-click>

---
layout: section-2
---

<div class="grid grid-cols-[65%,35%] gap-4">

# 使用技術<br/>（Dockerfile未満）

<v-click>
<img src="/img/madaaruyo.png" width="700">
</v-click>
</div>

---

# サ－ビス概要

非機能要件

- 別VPCのRDSを操作する
- 認証・認可 <bi-arrow-right-square-fill /> OIDC
    - 製品アクセスの有無により、ユーザプールを分割する
- マイクロサービスの開発・運用を効率化する
    - 冪等性の考慮
        - 分散トランザクション管理をなるべくやらない <bi-arrow-right-square-fill /> Sagaパターンの実装が不要なアーキテクチャを考える
    - アプリケーションでの処理をビジネスロジックに集中させる <typcn-equals /> ビジネスロジック以外の処理はなるべくインフラで実装する
        - ログ振分け・サーキットブレイカー等

<v-click>

- **セキュリティ最重視**
    - **WAF**
    - **AWSアカウント自体の管理**

</v-click>


---

# 使用技術（Dockerfile未満）

<div class="grid grid-cols-[50%,50%] gap-4"><div>

## コンテナー・ネットワーク

- AWS ECS on Fargate
    - キャパシティープロバイダー戦略を設定し、FARGATE_SPOTを最大限使用
- AWS ECR
    - イメージスキャン
    - ライフサイクルポリシー設定
- AWS Application Load Balancer
- AWS Firelens
- AWS Cloud Map
- AWS Route53
    - DNS SEC署名有効化
- AWS App Mesh
    - VPC内通信もTLS有効化

</div>
<v-click><div>

## セキュリティ

- AWS Config
- AWS Control Tower
    - AWS Organizations
    - AWS WAF
    - AWS Shield
    - AWS Firewall Manager
- AWS Guard Duty
- AWS Macie
- AWS KMSをきちんと管理
- AWS IAMをきちんと管理
    - IAMグループに対してポリシー割当
    - パーミッションバウンダリ設定
- [AWS BudgetsをChatbotでSlackに通知](https://dev.classmethod.jp/articles/aws-budgets-alert-by-aws-chatbot/)

</div></v-click>
</div>

---
src: ./slides/real_resources.md
---

---
layout: default-3
---

## セキュリティ対策も追加

<img src="/img/add_security_resources.svg" width="560">

---
layout: default-3
---

## dev環境のみの構成

<img src="/img/dev_environment.svg" width="460">

---

## モニタリング（トレース）

- AWS XRayを使いたかった
    - rust用のXRay SDKがないので、トレース用データを送信できない。。。
- Datadog agentでトレースする（予定）

## モニタリング（ログ）

firelensでどこにでも出せる

```markdown {1|2}
AWS Cloudwatch Logs
Datadog
```


## モニタリング（メトリクス）

```markdown {1|2|3-4|1}
Datadog
AWS Container Insights
Amazon Managed Service for Prometheus
Amazon Managed Service for Grafana
```

<v-click>

# **Datadog頑張る**

</v-click>

---
layout: section-2
---

# 今後

---

# 今後

<div class="grid grid-cols-[50%,50%] gap-4"><div>

## システム面

- frontend管理
    - Storybook
    - Cypress or Autify
- WAF
    - Prisma Cloud
- サービスメッシュ
    - Linkerd
- k8s
    - AWS EKS
- IaC
    - AWS CDK or Plumi
- カオスエンジニアリング
    - AWS FIS or Gremlin

</div>
<v-click><div>

## サービス面

- CS連携の整備
    - サービス時間、SLAの策定
    - Intercom他、CSツール検討
- 利用規約
- セキュリティチェックシート
    - ホワイトペーパー作成
    - 静的サイト作成

</div></v-click>
</div>

---
layout: default-7
---

# 今後

<img src="/img/tegamawaranai.jpg" width="450">

---
layout: default-7
---

#

<div class="grid grid-cols-[50%,50%] gap-4">
<img src="/img/tegatarinai.jpg">
<v-click><img src="/img/yoroshiku.jpg" width="380"></v-click>
</div>
