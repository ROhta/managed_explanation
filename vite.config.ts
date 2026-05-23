// Slidev v52 で導入された slide-import-guard プラグインが、
// <img src="/img/..."> から @vitejs/plugin-vue が生成する
// `import _imports_0 from '/img/...'` をファイルシステム絶対パスとして
// 検証し、`server.fs.allow` 外と判定してエラーにする問題への dev 限定回避策。
//
// 該当ガード: @slidev/cli の `node/vite/importGuard.ts`
//   if (!isSlideMarkdownId(id) || !config?.server.fs.strict) return null;
// → server.fs.strict: false で guard が早期 return し検証スキップされる。
//
// build には server.fs.* は影響せず、`<img src="/img/...">` は通常通り
// import 変換 → base prefix 付与の流れで GitHub Pages のサブパス配信に追従する。
export default {
  server: {
    fs: {
      strict: false,
    },
  },
}
