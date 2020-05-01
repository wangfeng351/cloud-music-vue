<template>
  <div>
       <mu-button
        color="primary"
        class="btn"
        @click="upload()"
      >上传文件</mu-button>
      <input class="file" type="file" ref="file" @change="uploadFile($event)" multiple>
      <mu-button
        color="primary"
        class="btn"
        @click="downloadFile()"
      >下载文件</mu-button>
      <a href="www.baidu.com"></a>
  </div>
</template>

<script>
export default {
 name: 'Color',
  data() {
    return {

    }
  },
  components: {},
  created() {},
  mounted() {},
  methods: {
    upload(){
        this.$refs.file.click()
      },
    uploadFile(event){
      console.log(event)
      //新构建一个表单
        let formData = new FormData();
        //如果多个文件，对文件进行遍历
				for (let j = 0; j < event.target.files.length; j++) {
          //以键值对关系存入表单
					formData.append('file', event.target.files[j]);
        }
        this.axios({
						method: 'post',
            url: '/resources/upload',
            data: formData,
						headers: {
							'Content-Type': 'multipart/form-data'
						}
					}).then(res => {
            if(res.data.code == 1){
              alert('导入成功')
            }
					}); 
    },
    downloadFile(){
      this.axios({
        method: 'get',
        url: item.path,
        responseType: 'blob'
      }).then((res) => {
        // 使用Blob创建一个指向性的URL（参数， 参数的类型）
        //const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
        //创建a标签节点
        const download = document.createElement('a')
        //创建url对象，参数为Bolb，File或者MediaSource对象
        const href = window.URL.createObjectURL(res.data)
        //给超链接的href属性赋值
        download.href = href
        //设置下载的文件名
        download.download = '歌单数据表.xls'
        //将a标签放在body中
        document.body.appendChild(download)
        //给a标签生成一个点击事件
        download.click()
        //移除a标签，为了下次点击时创建
        document.body.removeChild(download)
        //移除url
        window.URL.revokeObjectURL(href)
      })
    }
  },
  computed: {}
}
</script>

<style scoped lang="scss">
  .file {
    opacity: 0;
  }
</style>
