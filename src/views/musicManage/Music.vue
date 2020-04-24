<template>
  <div class="container1">
      <div class="operation" v-for="(item, index) in buttonMenu" :key="index">
        <mu-button color="" @click="batchDelete" v-if="item.title === '批量删除'">
         <mu-icon left :value="item.icon"></mu-icon>
        批量删除
        </mu-button>
         <mu-button color="error" @click="openAlertDialog()" v-if="item.title === '批量导入'">
          <mu-icon left :value="item.icon"></mu-icon>
          批量导入
        </mu-button>
        <mu-dialog title="批量导入注意事项" style="line-height: 30px" width="600" max-width="80%" :esc-press-close="false" :overlay-close="false" :open.sync="openAlert">
    批量导入时必须严格按照模板样式，没有模板请
    <span @click="downloadModel()" style="color:#1a73e8;font-weight:600;cursor: pointer;">下载模板</span>
    ,如已根据模板填写，请
    <span style="color:#1a73e8;font-weight:600;cursor: pointer;"> 继续导入</span>
    <input type="file" class="open-file" name="fileBox" id="fileBox" multiple @change="importSong($event)">
    <mu-button slot="actions" flat color="primary" @click="closeAlertDialog()">取消</mu-button>
  </mu-dialog>
      </div>
      <div class="song-table">
      <p class="search">
       <span>
          日期筛选：
      <mu-select v-model="dateFilter" class="data-selection" @change="filterSong()">
        <mu-option v-for="(option,index) in options" :key="index" :label="option.key" :value="option.value"></mu-option>
      </mu-select>
       </span>
       <span>
       <mu-text-field v-model="keywords" placeholder="输入关键词搜索"></mu-text-field>
        <mu-button color="success" @click="getSongByKeywords()">搜索</mu-button>
       </span>
      </p>
      <p class="header">
      <span>
      歌曲id
      </span>
      <span>歌曲名称</span>
      <span>歌手</span>
      <span>发行时间</span></span>
      <span>操作</span>
      </p>
      <mu-load-more @refresh="refresh" :refreshing="refreshing" :loading="loading" @load="load">
      <mu-list>
        <template v-for="item in songs.slice(start, end)">
          <mu-list-item>
            <mu-list-item-title style="text-align: left">
            <span>
            {{item.songId}}
            </span>
            </mu-list-item-title>
            <mu-list-item-title>
            <span>{{item.songName}}</span>
            </mu-list-item-title>
            <mu-list-item-title>
            <span>
            {{item.singer}}
            <mu-icon left value="favorite" v-if="item.singer === 'G.E.M.邓紫棋'" color="#d50000"></mu-icon>
            </span>
            </mu-list-item-title>
            <mu-list-item-title>
            <span>{{item.createTime.substring(0,10)}}</span>
            </mu-list-item-title>
            <mu-list-item-action v-for="(item, index) in buttonMenu" :key="index" style="justify-content:center;">
            <mu-button color="error" v-if="item.title === '删除'">
            <mu-icon left :value="item.icon"></mu-icon>
            {{item.title}}</mu-button>
            </mu-list-item-action>
          </mu-list-item>
          <mu-divider />
        </template>
      </mu-list>
    </mu-load-more>
      </div>
 </div>
</template>

<script>
export default {
 name: 'Music',
  data() {
    return {
      songs: [],
      refreshing: false,
      loading: false,
      text: 'List',
      start: 0,
      end: 10,
      buttonMenu: [],
      options: [
        {key: "一周内", value: "week"},
        {key: "本月", value: "month"},
        {key: "本季度", value: "quarter"}
      ],
      dateFilter: '',
      keywords: '',
      openAlert: false
    }
  },
  components: {},
  created() {
    this.getSong()
  },
  mounted() {},
  methods: {
    refresh () {
      this.refreshing = true;
      this.$refs.container.scrollTop = 0;
      setTimeout(() => {
        this.refreshing = false;
        this.num = 10;
      }, 2000)
    },
    load () {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.end += 10;
      }, 2000)
    },
    
    getSong(){
      this.axios({
        method: 'get',
        url: 'http://localhost:8080/song/list',
      }).then((res) => {
        this.songs =res.data.data
        this.getButtonMenu()
      })
    },

    //获取歌单中的按钮权限
    getButtonMenu() {
      for (let i = 0; i < this.$store.state.menuList.length; i++) {
        let menu = this.$store.state.menuList[i].subMenus

        if (menu != null) {
          for (let j = 0; j < menu.length; j++) {
            if (menu[j].title === '歌曲管理') {
              this.buttonMenu = menu[j].subMenus
              console.log(menu[j])
            }
          }
        }
      }
    },

    //日期筛选
    filterSong(){
      this.axios({
        method: 'get',
        url: 'http://localhost:8080/song/paragraph',
        params: {
          flag: this.dateFilter
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((res) => {
        console.log(res.data)
        this.songs =res.data.data
      })
    },

    //关键词搜索
    getSongByKeywords(){
      this.axios({
        method: 'get',
        url: 'http://localhost:8080/song/blur',
        params: {
          field: this.keywords
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((res) => {
        console.log(res.data)
        this.songs =res.data.data
      })
    },
    //批量导入遮罩层
    openAlertDialog () {
      console.log(123456)
      this.openAlert = true;
    },
    closeAlertDialog () {
      this.openAlert = false;
    },

    //批量删除
    batchDelete(){

    },

    //导入、下载模板
    downloadModel(){
      this.axios({
        method: 'get',
        url: 'http://localhost:8080/resources/model',
        responseType: 'blob'
      }).then((res) => {
        //指定类型位excel表类型
        const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
        //创建a标签节点
        const download = document.createElement('a')
        //与获取验证码url方法一样
        const href = window.URL.createObjectURL(blob)
        //给超链接的href属性赋url值
        download.href = href
        //设置下载的文件名
        download.download = '歌曲批量导入模板.xls'
        //将a标签放在body中
        document.body.appendChild(download)
        //给a标签生成一个点击事件
        download.click()
        //移除a标签，为了下次点击时创建
        document.body.removeChild(download)
        //移除url
        window.URL.revokeObjectURL(href)
      })
    },

    importSong(event){
      alert(1)
				let formData = new FormData();
				for (let j = 0; j < event.target.files.length; j++) {
					formData.append('file', event.target.files[j]);
					this.axios({
						method: 'post',
						url: 'http://localhost:8080/resources/guide',
						headers: {
							'Content-Type': 'multipart/form-data'
						},
						data: formData,
						processData: false,
						contentType: false
					}).then(res => {
					});
				}
    }


  },
  computed: {}
}
</script>

<style scoped lang="scss">
  .container1 {
    width: 100%;
    //操作按钮
    .operation {
      display: flex;
      margin-top: 20px;
    }
    .song-table {
      margin: 10px auto;
      width: 90%;
      padding: 10px 10px;
      box-shadow: 0px 2px 2px 3px #ddd;
      max-height: 600px;
      .search {
        display: flex;
        justify-content: space-between;
        .mu-button {
          margin-left: 10px;
        }
      }
      .header {
        width: 100%;
        display: flex;
        align-items: center;
        height: 60px;
        border-bottom: 1px solid rgb(205, 205, 205);
        span {
          flex: 0 0 20%;
          text-align: center;
          .data-selection {
            width: 60px;
          }
        }
      }
      .mu-list-item {
        width: 100%;
        display: flex;
        background-color: red;
        span {
          flex: 0 0 16.5%;
        }
      }
    }
  }
  .open-file {
    opacity: 0;
    position: relative;
    right: 80px;
  }
</style>
