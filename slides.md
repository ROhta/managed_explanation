---
theme: shibainu
class: 'text-center'
highlighter: prism
lineNumbers: true
info: |
  ## 開発説明
drawings:
  persist: true
---

# ユーザ管理画面開発説明

---
layout: quote
---
#

<div class="titles"><div class="titlecontent">

 <p class="center">EPISODE IV<br />A NEW HOPE FOR CSS3</p>

 <p>It is a period of vendor war.</p>

 <p>This is a demonstration of Star Wars-style scrolling 3D titles in CSS3. It possibly has no practical purpose whatsoever but it looks great and you can impress your friends.</p>

 <p>Before movie-buffs start ranting, I realize Star Wars wasn't the first to use crawling 3D titles, but few of you will remember the Flash Gordon series or the 1936 adaption of HG Wells' "Things to Come".</p>

 <p>Also, by mentioning "Star Wars", everyone will understand what I mean. And I'll receive several thousand more visits.</p>

 <p>The scrolling titles work well in Chrome, Safari and Firefox. Opera doesn't implement 3D transforms yet, but the text will scroll. IE users receive a blank page. A shame, but IE10 should support it.</p>

 <p>So how does it work? Well, it's fairly simple. We have an outer absolute DIV (#titles) which is rotated along the X-axis using perspective to give the impression of depth. The same DIV also has an :after psuedo-element which applies a linear gradient so the text appears to fade out.</p>

 <p>Inside, we have another absolutely-positioned DIV which contains the text (#titlecontent). The top is set to 100% to ensure it starts off-screen then uses CSS3 animation to move it upward over time. No JavaScript is required.</p>

 <p>You will probably need to adjust the movement amount and timing depending on the quantity of text you want to show. The 3D depth can also be tweaked in the</p>

 <p>All the code is contained in this single HTML file</p>

 <p class="center">View the source, Luke!</p>

 <p>Sorry. Couldn't resist it.</p>

 <p>You're welcome to use this demonstration code in your own sites. Please link back to the original article at:</p>

 <p class="center"><a href="http://www.sitepoint.com/css3-starwars-scrolling-text/">sitepoint.com/<br />css3-starwars-scrolling-text/</a></p>

 <p>and give me a shout on Twitter <a href="http://twitter.com/craigbuckler">@craigbuckler</a> &ndash; I'd love to see how you use and abuse it!</p>

 <p>Finally, Han shot first and the original, unadulterated movies remain the best. Stop fiddling with them, George!</p>

</div></div>

<style>
 .titles {
    position: absolute;
    width: 18em;
    height: 50em;
    bottom: 0;
    left: 50%;
    margin-left: -9em;
    font-size: 350%;
    font-weight: bold;
    text-align: justify;
    overflow: hidden;
    transform-origin: 50% 100%;
    transform: perspective(300px) rotateX(25deg);
 }
 .titles:after {
    position: absolute;
    content: ' ';
    left: 0;
    right: 0;
    top: 0;
    bottom: 60%;
    background-image: linear-gradient(top, rgba(0,0,0,1) 0%, transparent 100%);
    pointer-events: none;
 }
</style>

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

 - 機能要件
    - ユーザ・企業・接続元IPリストのCRUDをする
    - ユーザを作る権限を持った企業外ユーザ（販売代理店等）を管理する

---

# サ－ビス概要

 - 機能要件
    - ユーザ・企業・接続元IPリストのCRUDをする
    - ユーザを作る権限を持った企業外ユーザ（販売代理店等）を管理する

機能要件だけ見るとチュートリアルに毛が生えた程度

---

# サ－ビス概要

- 非機能要件
    - 別VPCのRDSを操作する
    - 認証・認可
        - OIDC
        - 製品アクセスの有無により、ユーザプールを分割する
    - マイクロサービスの開発・運用を効率化する
        - 冪等性の考慮
          - 分散トランザクション管理をなるべくやらない → Sagaパターンが実装不要になるアーキテクチャを考える
        - アプリケーション実装をビジネス実装に集中させる = インフラレイヤーでなるべく巻き取る
          - ログ振分け・サーキットブレイカー等
        - モニタリングの一覧性
    - セキュリティ最重視
        - WAF
        - AWSアカウント自体の管理

---
layout: section-2
---
# 開発の進め方

---

# [GitHub Beta Projects](https://github.com/features/issues/)で管理

<div grid="~ cols-2 gap-2" m="-t-2">
    <div>
        <p>Discussions → Issues → Pull Requests の流れが最高</p>
        <p>Discussions<br/>とりあえずの提案・バグか仕様か分からないので質問</p>
        <p>Issues<br/>やることが決定したもの</p>
        <p>Pull Requests<br/>実装のレビュー</p>
        <p>IssuesやPull Requestsはテンプレートを設置</p>
        <p>Issuesはボタン一つでテンプレートを使い分けられるように</p>
    </div>
    <div>
        <img src="github_discussions.png" width= "500">
        <br/>
        <img src="github_issue_template.png" width= "500">
    </div>
</div>

---

# [GitHub Beta Projects](https://github.com/features/issues/)で管理

<div grid="~ cols-2 gap-2" m="-t-2">
    <div>
        <p>複数リポジトリのIssueを一覧化</p>
        <p>各マイクロサービスのリポジトリを一つ一つ見に行く必要がない</p>
        <p>カスタムフィールドでPriorityを追加</p>
        <p>Priority毎にグループ分けして表示</p>
    </div>
    <img src="github_project.png" width= "500">
</div>

---

# [GitHub Beta Projects](https://github.com/features/issues/)で管理

<div grid="~ cols-2 gap-2" m="-t-2">
    <div>
        <p>JIRAのように扱うため、labelで機能補完</p>
        <p>closed, blocked by等、チケット間の関係性を表現</p>
        <p>sortが奇麗になるよう、bug, enhance等の接頭辞を付与</p>
        <p>色の並びにも気を配った</p>
    </div>
    <img src="github_labels.png" width="370">
</div>

---
layout: section-3
---

# 使用技術<br/>（Dockerfile以上）
---

# 使用技術（Dockerfile以上）

|     |     |
| --- | --- |
| <kbd>frontend</kbd> | <img src="/typescript.svg" width="70" class="inline-block p-4"><img src="/react.svg" width="150" class="inline-block p-4"><img src="/next.js.svg" width="100" class="inline-block p-4"><img src="/material_ui.svg" width="180" class="inline-block p-4"> |
| <kbd>backend</kbd> | <img src="/rust.svg" width="80" class="inline-block p-4"><img src="/actixweb.jpg" width="150" class="inline-block p-4"> |
| <kbd>CI/CD</kbd> | <img src="/github_actions.svg" width="80"> |
| <kbd>認証・認可</kbd> | <img src="/auth0.svg" width="100"> |

---

# 使用技術（Dockerfile以上）

|     |     |
| --- | --- |
| <kbd>frontend</kbd> | SSRに対応 |
| <kbd>backend</kbd> | DDD指向・オニオンアーキテクチャで実装、リソースAPIではトークン検証処理を行う |
| <kbd>CI/CD</kbd> | [aws謹製のactions](https://github.com/aws-actions)で実装 |
| <kbd>認証・認可</kbd> | OIDCに則って各APIを構築 ・ [Organizations](https://auth0.com/docs/organizations)機能を使用（予定） |

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
- AWS ECR
- AWS Application Load Balancer
- AWS Firelens
- AWS Cloudwatch Logs
- AWS Cloud Map
- AWS Route53
    - DNS SEC署名有効化
- AWS App Mesh
  - mTLS有効化

---
layout: default-6
---

# 実体リソース

<img src="/real_resources.svg" width="600">

---

# ログ設計

- リクエストの流れを追いやすい設計にする
    - 1つのリクエストに対して、全ノードのログを一ヶ所で見たい
    - frontendのロググループを見て、次はbackendのログを見て、というログ設計はやめる

---

# ログ設計

- リクエストの流れを追いやすい設計にする
    - 1つのリクエストに対して、全ノードのログを一ヶ所で見たい
    - frontendのロググループを見て、次はbackendのログを見て、というログ設計はやめる

## [firelens](https://dev.classmethod.jp/articles/aws-fargate-with-firelens-minimum/)

- awsのマネージドサービス用にカスタマイズされたfluent bit
- log_routerコンテナーをサイドカー構成でecsタスクに同梱し、好きな場所にログ送信できる
    - envoyのアクセスログはs3、アプリケーションログはcloudwatch logs、アクセスログうち特定のIPだけkinesis data firehose経由でAmazon OpenSearchに、等
- 試されるfluent bit力
    - 全ログをとりあえずcloudwatch logsに出力中
    - Datadogにも出力して、可視性・一覧性を追求する

---

# 開発秘話

---
layout: default-6
---

# 実体リソース

<img src="/real_resources.svg" width="600">

---
layout: default-6
---

# 仮想リソース

<img src="/virtual_resources.svg" width="600">

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

# 開発秘話

---
layout: default-6
---

# 仮想リソース

<img src="/virtual_resources.svg" width="600">

---

# ECSタスク

各ECSサービスはタスクに以下のコンテナーを持つ
- log_router
- envoy
- datadog agent（予定）
- app

---
layout: section-2
---

# 使用技術<br/>（Dockerfile未満）<br/>まだあるよ

---

# サ－ビス概要

- 非機能要件
    - 別VPCのRDSを操作する
    - 認証・認可
        - OIDC
        - 製品アクセスの有無により、ユーザプールを分割する
    - マイクロサービスの開発・運用を効率化する
        - 冪等性の考慮
          - 分散トランザクション管理をなるべくやらない → Sagaパターンが実装不要になるアーキテクチャを考える
        - アプリケーション実装をビジネス実装に集中させる = インフラレイヤーでなるべく巻き取る
          - ログ振分け・サーキットブレイカー等
        - *モニタリングの一覧性*
    - *セキュリティ最重視*
        - *WAF*
        - *AWSアカウント自体の管理*

---
# 使用技術（Dockerfile未満）

## セキュリティ

---

# 使用技術（Dockerfile未満）

## セキュリティ

- AWS Config
- AWS Organizations
    - AWS WAF
    - AWS Shield
    - AWS Firewall Manager
- AWS Guard Duty
- AWS Macie
- AWS KMSをきちんと管理
    - 鍵有効期限の管理
- AWS IAMをきちんと管理
    - きちんとIAMグループ作ってポリシー割当
    - 各IAMユーザにパーミッションバウンダリを設定
- [AWS BudgetsをChatbotでSlackに通知させてる](https://dev.classmethod.jp/articles/aws-budgets-alert-by-aws-chatbot/)

---
layout: default-6
---

# 実体リソース

<img src="/real_resources.svg" width="600">

---
layout: default-6
---

## セキュリティ対策も追加

<img src="/add_security_resources.svg" width="600">

---
layout: default-6
---

## dev環境のみの構成

<img src="/dev_environment.svg" width="500">

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

# **Datadog頑張る**

---
layout: section-2
---

# 今後

---

# 今後

## システム面

- frontend管理
    - Storybook
    - Cypress
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

---

# 今後

## サービス面

- CS連携の整備
    - サービス時間、SLAの策定
    - Intercom他、CSツール検討
- 利用規約
- セキュリティチェックシート
    - ホワイトペーパー作成
    - 静的サイト作成

---
layout: default-7
---

# 今後

<img src="tegamawaranai.jpg" width="450">

---
layout: default-7
---

#

<div grid="~ cols-2 gap-2" m="-t-2">
<img src="tegatarinai.jpg">
</div>

---
layout: default-7
---


#

<div grid="~ cols-2 gap-2" m="-t-2">
<img src="tegatarinai.jpg">
<img src="yoroshiku.jpg" width="380">
</div>
