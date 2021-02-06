<template>
  <v-row>
    <v-col cols="12" sm="8" md="6">
      <v-row class="mb-5">
        <input
          id="file"
          type="file"
          accept=".jpeg, .jpg, .png"
          @change="uploadImg"
        />
      </v-row>
      <v-row class="mb-5">
        <v-avatar color="grey lighten-3" size="85">
          <v-img :src="resizedImg"></v-img>
        </v-avatar>
        <canvas v-show="false" ref="canvas" />
      </v-row>
      <v-row class="mb-5">
        <v-btn class="mr-5" color="primary" @click="registImg">登録</v-btn>
        <v-btn color="secondary" @click="$parent.iconChange = false"
          >キャンセル</v-btn
        >
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
/*
長方形の画像にも対応できるよう、一旦Canvasで100px*100pxにリサイズ
  https://qiita.com/su_mi1228/items/492c89db7f96823a26c0
さらに圧縮したい場合は compressorjsが良さそう
  https://qiita.com/ykhirao/items/33815dfe198ea332d142
Firebase Resize Imagesという拡張機能（200件まで無料）もある
  https://firebase.google.com/products/extensions/storage-resize-images
Storageに画像を保存
  https://firebase.google.com/docs/storage/web/upload-files?hl=ja
*/
export default {
  data() {
    return {
      resizedImg: null,
      resizedBlob: null
    };
  },
  methods: {
    uploadImg(e) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = e => {
        this.generateImgUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    },
    generateImgUrl(file) {
      const image = new Image();
      image.crossOrigin = "Anonymous";
      image.onload = e => {
        const resizedBase64 = this.makeResizeImg(image);
        // リサイズ済みのBase64をblobに変換
        const resizedBlob = this.base64ToBlob(resizedBase64);
        this.resizedBlob = resizedBlob;
        // urlを生成してプレビュー表示できるようにする
        const resizedImg = window.URL.createObjectURL(resizedBlob);
        this.resizedImg = resizedImg;
      };
      image.src = file;
    },
    makeResizeImg(image) {
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext("2d"); // 2Dコンテキスト
      // 縦横で長い方の最大値を100とする
      const MAX_SIZE = 100;
      // MAX_SIZEよりも小さかったらそのまま
      if (image.width < MAX_SIZE && image.height < MAX_SIZE) {
        [canvas.width, canvas.height] = [image.width, image.height];
        ctx.drawImage(image, 0, 0);
        return canvas.toDataURL("image/jpeg");
      }
      // 縦横比の計算
      let dstWidth;
      let dstHeight;
      if (image.width > image.height) {
        dstWidth = MAX_SIZE;
        dstHeight = (image.height * MAX_SIZE) / image.width;
      } else {
        dstHeight = MAX_SIZE;
        dstWidth = (image.width * MAX_SIZE) / image.height;
      }
      canvas.width = dstWidth;
      canvas.height = dstHeight;
      // リサイズ
      ctx.drawImage(
        image,
        0,
        0,
        image.width,
        image.height,
        0,
        0,
        dstWidth,
        dstHeight
      );
      // data_url形式に変換したものを返す
      return canvas.toDataURL("image/jpeg");
    },
    base64ToBlob(base64) {
      const bin = atob(base64.replace(/^.*,/, ""));
      const buffer = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) {
        buffer[i] = bin.charCodeAt(i);
      }
      return new Blob([buffer.buffer], {
        type: "image/png"
      });
    },
    async registImg() {
      const file = this.resizedBlob;
      if (!!file) {
        const uid = this.$store.state.authUser.uid;
        const userIconsRef = this.$fire.storage.ref("user_icons/" + uid);
        await userIconsRef.put(file);
        this.$parent.iconChange = false;
      } else {
        // TODO: v-alertで表示する
        alert("画像なし");
      }
    }
  }
};
</script>
