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
    - アプリケーションでの処理をビジネスロジックに集中させる <typcn-equals /> ビジネスロジック以外の処理はなるべくAWSのマネージドサービスで行う
        - ログ振分け・サーキットブレイカー・セキュリティ対策等
- セキュリティ最重視
    - 各種ファイアウォール
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
| <kbd>認証・認可</kbd> | OIDCに則って各APIを構築 ・ [Organizations](https://auth0.com/docs/organizations)機能（予定）|

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
    - アプリケーションサービス層: ユーザとの接点（エンドポイント等）
    - インフラストラクチャ層: 外部ライブラリ、DB等の接続

<v-click>

- 実装したモジュールをどの層に置くか
    - SQL文とAWS SDKはインフラストラクチャ層に
    - トークン検証はアプリケーションサービス層
        - エンドポイント毎に検証スコープの範囲が違うため、ビジネスロジックにも思える
        - アプリケーション固有の処理だが、ドメインに関する処理ではないので、アプリケーションサービス層に配置した

</v-click>

---

# 開発秘話（backend）

やっぱりrustの型制約が激しい

- 型制約が激しくてDIが辛い。。。
    - [goでinterface型を使う](https://qiita.com/hirotakan/items/698c1f5773a3cca6193e#interfacesdatabase--frameworks--drivers%E3%83%AC%E3%82%A4%E3%83%A4%E3%83%BC)ような逃げ道がない。
    - 依存関係を逆転しきれないことも

<v-click>

- オニオンアーキテクチャの各層をモジュール化して、依存関係逆転の法則を実装する
    - 頑張る

</v-click>


---

# 開発秘話（backend）

APIドキュメント管理

- 当初はOpenAPIに則ろうとした
    - ドキュメントもgit管理したいし、ドキュメントとコードの連携も取りたい
    - だが、Swagger Editorを使うとソースコードと設定ファイルが分離するため、いずれ整合性が取れなくなる

<v-click>

- 要件をまとめると
    - ドキュメントのgit管理
    - コードからドキュメントの生成
    - ドキュメントからコードの生成
    - ドキュメントの設定ファイルがソースコードから独立していない
    - 独自フレームワークを持たない
        - オニオンアーキテクチャに影響を与えない、受けない
    - 簡便なホスティング

</v-click>

---

# 開発秘話（backend）

APIドキュメント管理

- 意外と要件に合致するものはなかった

<v-click>

- ホスティングはGitHub Pagesでよい
- Rust Docで、ドキュメントからコードの生成以外の要件は実現可能
    - ドメインモデル層でレスポンスを定義
    - アプリケーションサービス層のソースコードにパラメーターに関するコメントを記載

</v-click>
<v-click>

**Rust Doc + GitHub Pages**

</v-click>
<v-click>

- 以下の前提があれば、ソースコード上のコメントをAPIドキュメントとして機能させられる
    - 外部公開しない
    - フロントエンドのメンバーもrustを読める

</v-click>

---

# 開発秘話（backend）

APIドキュメント管理

<img src="/img/docs.png" width="600">

---

# 開発秘話（backend）

トークン検証

よくあるpemを使ったdecode処理

```rust {1|2-3|5|6-8|all}
use jsonwebtoken::{TokenData, DecodingKey, Validation, decode};
fn decode_jwt(jwt: &str, secret: &str) ->
    Result<TokenData<Claims>, jsonwebtoken::errors::Error> {

    let secret = std::env::var(secret).expect("secret is not set");
    decode::<Claims>(
        jwt, &DecodingKey::from_secret(secret.as_ref()),
        &Validation::default())
}
```

<v-click>

が、今回必要なトークン検証はpemを使った処理ではなく、<br/>
Auth0発行のJWKSから`kid`に基づいて該当のJWTを探し、`n` `e` でデコードする処理

</v-click>

---

# 開発秘話（backend）

トークン検証

1. ヘッダーの`kid` をもとに複数のJWKSの中から一致する`kid`を見つけ、JWTを特定

```rust {1|2|4,5|7-13|15}
pub fn find_from_kid(jwks: Jwks, kid: &str) -> Result<JwtKey, JwksError> {
    let length = jwks.keys.len();

    let mut index: usize = 0;
    let mut is_exists: bool = false;

    for i in 0..length {
        if jwks.keys[i].kid == kid {
            is_exists = true;
            index = i;
            break;
        }
    }

// 次ページに続く
```

---

# 開発秘話（backend）

トークン検証

```rust {1|3|4-13|14-16|all}
// 全ページから続く

    if is_exists == true {
        Ok(JwtKey {
            alg: jwks.keys[index].alg.to_owned(),
            kty: jwks.keys[index].kty.to_owned(),
            r#use: jwks.keys[index].r#use.to_owned(),
            n: jwks.keys[index].n.to_owned(),
            e: jwks.keys[index].e.to_owned(),
            kid: jwks.keys[index].kid.to_owned(),
            x5t: jwks.keys[index].x5t.to_owned(),
            x5c: jwks.keys[index].x5c.to_owned(),
        })
    } else {
        Err(JwksError)
    }
}
```
<v-click>

- JWKのパラメーターは、[JWTハンドブック](https://assets.ctfassets.net/2ntc334xpx65/5HColfm15cUhMmDQnupNzd/30d5913d94e79462043f6d8e3f557351/jwt-handbook-jp.pdf)の6,7章が詳しい
- 今回はRSA公開鍵を用いるので、その際の[必須パラメーターの`n`と`e`](https://openid-foundation-japan.github.io/rfc7638.ja.html#Example)も追加した

</v-click>

---

# 開発秘話（backend）

トークン検証

2.　JWTから該当の`n`と`e`を使い、トークン検証

```rust {1-4|6|7-12|13-17}
let jwt = match kid {
    Some(v) => auth0_token::find_from_kid(self.jwks.clone(), &v),
    None => panic!("something wrong with auth0 token"),
};

let val = match jsonwebtoken::decode::<Claims>(
    result,
    &DecodingKey::from_rsa_components(
        &jwt.as_ref().unwrap().n,
        &jwt.as_ref().unwrap().e
    ),
    &Validation::new(Algorithm::RS256),
) {
    Ok(v) => Some(v),
    Err(err) => match *err.kind() {
        _ => return Box::pin(ready(Err(JwtAuthError::Unauthorized.into()))),
    },
};
```

---
layout: section-2
---

# 使用技術<br/>（Dockerfile未満）

---
src: ./slides/technology_stack_container_networks.md
---
---
src: ./slides/real_resources.md
---
---

# ログ設計

- リクエストの流れを追いやすい設計にする
    - 1つのリクエストに対して、全ノードのログを一ヶ所で見たい
    - frontendのロググループを開いて、次はbackendのロググループを開いて、というログ設計はやめる

<v-click>

### [firelens](https://dev.classmethod.jp/articles/aws-fargate-with-firelens-minimum/)

- awsがマネージドサービス用にカスタマイズしたfluent bit
- log_routerコンテナーをサイドカー構成でecsタスクに同梱し、任意の場所にログ送信
    - たとえば、envoyのアクセスログはs3へ、アプリケーションログはCloudwatch Logsへ、アクセスログのうち特定のクライアントからのログのみkinesis data firehose経由でAmazon OpenSearchへ等
- 試されるfluent bit力
    - 全ログをとりあえずcloudwatch logsに出力した
    - Datadogにも出力して、可視性・一覧性を追求する

</v-click>

---

# 開発秘話（firelens）

設定ファイルを管理したくない


- [ブログ](https://dev.classmethod.jp/articles/fargate-fiirelens-fluentbit/)を漁ると、タスク定義とは別にfluent bitの設定ファイルを用意する、という記事ばかりヒットする
    - s3に配置する、設定ファイルをコンテナー内で読み込むようDockerfileを編集する、等
    - 管理コスト。。。

<v-click>

- ログ出力先が一ヶ所の場合のみ、タスク定義に記載したオプションを設定値としてfluent bitに渡せる
    - 今回の場合では、設定ファイル無しでfirelensを使える

</v-click>
<v-click>

- タスク全体でログ出力先を一ヶ所にまとめるのではない
    - コンテナー毎に一ヶ所
    - envoyのアクセスログはdatadog、アプリケーションログはcloudwatch logs、のような振分けが可能

</v-click>

---

# 開発秘話（firelens）

DataAlreadyAcceptedExceptionエラー

- log_routerコンテナー自体のログ（Cloudwatch Logs）にDataAlreadyAcceptedExceptionエラーが出力され続ける
    - `The given batch of log events has already been accepted. The next batch can be sent with sequenceToken`のメッセージが、ECSタスクがリクエストを受け付ける毎に記録される
    - [Cloudwatch LogsのsequenceTokenは被っていなかった](https://michimani.net/post/use-cloudwatch-via-aws-cli/)
    - 原因は、log_routerコンテナーの初期値と自分の設定値の競合だった
        - aws製fluent bitコンテナーは、[このような値](https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/firelens-taskdef.html)を無条件設定する
        - [fluent bit公式](https://docs.fluentbit.io/manual/pipeline/outputs/cloudwatch)を参考に、タスク定義の`"Match": "*"` をlogConfigurationに設定した
        - Match対象が複数設定され、ログの二重送信をCloudWatch Logsが拒否した結果、DataAlreadyAcceptedExceptionエラーが発生していた
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

<v-click>

- envoyコンテナーをサイドカー構成でecsタスクに同梱した
- ingressアクセスをサービスメッシュで管理できるように、仮想ゲートウェイを構築した

</v-click>
<v-click>

- EKS移行後にLinkerdを検討予定
    - [k8sが前提のツールなため](https://servicemesh.es)
    - [envoyじゃない](https://linkerd.io/2020/12/03/why-linkerd-doesnt-use-envoy/)メリデメを考える

</v-click>

---
src: ./slides/virtual_resources.md
---

---

# 開発秘話（App Mesh）

マネコンで設定すると、誤ったデフォルト値が強制挿入される

<v-click>

- AWSマネジメントコンソールでタスク定義を作成する際、App Mesh統合の有効化にチェックを入れると、App Meshで用いるenvoyイメージや必要な設定が自動挿入される
    - envoyコンテナーに環境変数`APPMESH_VIRTUAL_NODE_NAME`が挿入される

</v-click>
<v-click>

- マネコンで、東京リージョンで自動設定されるイメージバージョンは`v1.19.1.0-prod`だった
    - だが、[公式](https://docs.aws.amazon.com/ja_jp/app-mesh/latest/userguide/envoy-config.html)によると、バージョン1.15.0以上では環境変数`APPMESH_RESOURCE_ARN`が必要
    - `APPMESH_VIRTUAL_NODE_NAME`は不要
    - **マネコンが不要な環境変数を挿入してくる**

</v-click>

---

# 開発秘話（App Mesh）

マネコンで設定すると、誤ったデフォルト値が強制挿入される

- バージョン1.19.1のイメージに`APPMESH_VIRTUAL_NODE_NAME`（不要な方）を追加すると、挙動が不安定になった
    - `APPMESH_VIRTUAL_NODE_NAME`と`APPMESH_RESOURCE_ARN`を両方追加すると、envoyからappへの通信がconnection errorとなった
    - **`APPMESH_VIRTUAL_NODE_NAME`のみを挿入する必要がある**

<v-click>

- さらに、App Mesh統合の有効化をチェックして、`APPMESH_VIRTUAL_NODE_NAME`を削除すると、エラーでタスク定義の保存に失敗する
    - `APPMESH_RESOURCE_ARN`のみを追加するためには、App Mesh統合の有効化のチェックを外したうえで、タスク定義のJSONを手で書くしかなかった

</v-click>

---
src: ./slides/virtual_resources.md
---

---

# 開発秘話（App Mesh）

朝見てみたら、仮想ゲートウェイの起動失敗タスクが500以上。。。。。

<div class="grid grid-cols-[47%,53%] gap-4"><div><v-click>

- 原因は、appのヘルスチェックエンドポイントのステータスコードが200ではなかったこと

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

- タスク毎1コンテナーの起動だったため、仮想ゲートウェイのenvoyコンテナーが停止してタスク数が0になる

</v-click>
<v-click>

- ECSサービスで最小タスク数を1としていたため、新タスクが立ち上がる

</v-click>
</div></div>

---

# 開発秘話（App Mesh）

朝見てみたら、仮想ゲートウェイの起動失敗タスクが500以上。。。。。

<img src="/img/mugen.jpg" width="800">

---

# 開発秘話（App Mesh）

http2対応できない

<v-click>

- actix webのAPI群への通信をhttp2にしたかったので、[公式](https://actix.rs/docs/http2/)にしたがってtls暗号化し、appをhttp2対応させた
- しかし、`upstream connect error or disconnect/reset before headers. reset reason: connection termination`というenvoyのエラーが出力される

</v-click>
<v-click>

- awsサポート回答によると、↓とのこと
    - [http2は、tls必須ではない](https://qiita.com/kitauji/items/3bf03533895251c93af2#httpsh2-%E3%81%A8-httph2c)
    - envoyへの通信とenvoy app間のプロトコルは一致させる必要がある。envoyへはhttp2、envoy app間はhttp1.1という設定はできない。
    - が、envoy app間をtls暗号化すると、app meshのコントロールプレーンが通信を補足できない
    - appはtls暗号化せずhttp2対応しなくてはならない

</v-click>

---

# 開発秘話（App Mesh）

http2対応できない

- だが、[actix webの公式](https://actix.rs/docs/http2/)を見ても、tls暗号化せずにhttp2化する方法が見つからない。`actix-web automatically upgrades connections to HTTP/2 if possible.`と書いてはあるが、tls暗号化しないとactix webはhttp2にならなかった。

<v-click>

- actix webをtls暗号化せずにhttp2対応させる術が見つからず、app meshで仮想ノード間や仮想ゲートウェイ・仮想ノード間のhttp2対応は諦める、という結論になった
    - その後、クライアント・仮想ゲートウェイ間のhttp2化には成功した

</v-click>

---
src: ./slides/virtual_resources.md
---
---
src: ./slides/real_resources.md
---
---
layout: default-5
---

# ECSタスク

- 各ECSサービスはタスクに以下のコンテナーを持つ
    - log_router
    - envoy
    - datadog agent
    - xray_daemon
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
    - アプリケーションでの処理をビジネスロジックに集中させる <typcn-equals /> ビジネスロジック以外の処理はなるべくAWSのマネージドサービスで行う
        - ログ振分け・サーキットブレイカー・セキュリティ対策等

<v-click>

- **セキュリティ最重視**
    - **各種ファイアウォール**
    - **AWSアカウント自体の管理**

</v-click>

---
src: ./slides/technology_stack_container_networks.md
---
---

# 使用技術（Dockerfile未満）

## セキュリティ

- AWS Shield
- AWS WAF
- AWS NetworkFirewall
- AWS DNSFirewall
- AWS Config
- AWS Guard Duty
- AWS Macie
- AWS Security Hub
- AWS KMSをきちんと管理
- AWS IAMをきちんと管理
    - IAMグループに対してポリシー割当
    - パーミッションバウンダリ設定
- [AWS BudgetsをChatbotでSlackに通知](https://dev.classmethod.jp/articles/aws-budgets-alert-by-aws-chatbot/)

---

# 使用技術（Dockerfile未満）

## マルチアカウント管理

- AWS ControlTower
    - AWS Config
    - AWS CloudTrail
    - AWS Single Sign-On

---

# 使用技術（Dockerfile未満）

## AWS Organizationsとの連携サービス

<div class="grid grid-cols-[50%,50%] gap-4"><div>

- セキュリティ系サービス
    - Amazon Detective
    - AWS Guard Duty
    - AWS Health
    - AWS Macie
    - AWS Security Hub
    - AWS Firewall Manager
        - AWS WAF
        - AWS Network Firewall
        - AWS DNS Firewall

</div><div>

- 管理系サービス
    - AWS Audit Manager
    - AWS Compute Optimizer
    - AWS Resource Access Manager
    - Amazon VPC IP Address Manager
    - S3 Storage Lens


</div></div>

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

- Datadog agentが簡単

<v-click>

- AWS XRayもやりたい
    - [rustのXRay SDK](https://github.com/awslabs/aws-sdk-rust/tree/main/sdk/xray)はα版

</v-click>

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

## その他

- 開発環境のEC2からアクセス可能にする
    - Transit Gatewayを設置
- マルチAZ構成にする
- AWS Well-Architected Toolも真面目にやる

---
layout: default-3
---

## 現状の構成

<img src="/img/now.svg" width="900">

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
