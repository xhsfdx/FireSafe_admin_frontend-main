<template>
  <div class="pdf-fullscreen">
    <iframe
      src="/web/viewer.html?file=/pdf/3.pdf"
      frameborder="0"
      style="width:100vw;height:100vh;min-height:100vh;"
    ></iframe>
  </div>
</template>

<script>
export default {
  name: 'PdfOnly'
}
</script>

<style scoped>
.pdf-fullscreen {
  width: 100vw;
  height: 100vh;
  background: #f7fafd;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
