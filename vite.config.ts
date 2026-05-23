// Slidev v52 の slide-import-guard は <img src="/img/..."> を
// @vitejs/plugin-vue が生成する `import _imports_0 from '/img/...'`
// として検証し、ファイルシステム絶対パスとして解釈してエラーにする。
// includeAbsolute: false で絶対パスを import 文に変換させず、
// public/ 配下の静的ファイルとして配信させて回避する。
//
// vite を direct dependency にしていないため defineConfig は使わず plain object で記述。
export default {
  slidev: {
    vue: {
      template: {
        transformAssetUrls: {
          includeAbsolute: false,
        },
      },
    },
  },
}
